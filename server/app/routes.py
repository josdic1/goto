from flask import request, jsonify, session
from flask_restful import Resource
from app.extensions import db
from app.models import User, Cheat, Language, Category
from app.serializers import (
    simple_user_schema,
    user_schema,
    language_schema, languages_schema,
    category_schema, categories_schema,
    cheat_schema, cheats_schema
)

# ================ AUTH RESOURCES ================ #

class Signup(Resource):
    def post(self):
        """Create new user account."""
        data = request.get_json()
        
        # Check if email already exists
        if User.query.filter_by(email=data.get('email')).first():
            return {'error': 'Email already exists'}, 400
        
        # Create new user (password auto-hashed in __init__)
        user = User(
            name=data['name'],
            email=data['email'],
            password=data['password']
        )
        db.session.add(user)
        db.session.commit()
        
        # Set session
        session['user_id'] = user.id
        
        # Return simple user data (no cheats needed for signup)
        return simple_user_schema.dump(user), 201


class Login(Resource):
    def post(self):
        """Authenticate user."""
        data = request.get_json()
        user = User.query.filter_by(email=data.get('email')).first()
        
        # Verify credentials
        if user and user.authenticate(data.get('password')):
            session['user_id'] = user.id
            # Return simple user data (no cheats needed for login)
            return simple_user_schema.dump(user), 200
        
        return {'error': 'Invalid credentials'}, 401


class Logout(Resource):
    def post(self):
        """End user session."""
        session.pop('user_id', None)
        return {'message': 'Logged out'}, 200


class CheckSession(Resource):
    def get(self):
        """
        Verify session and return user data with grouped cheats.
        
        Returns:
            {
                'logged_in': True,
                'user': {
                    'id': 1,
                    'name': 'Josh',
                    'email': 'josh@josh.com',
                    'languages': [
                        {
                            'id': 1,
                            'name': 'JavaScript',
                            'cheats': [...]
                        }
                    ],
                    'categories': [
                        {
                            'id': 1,
                            'name': 'Arrays',
                            'cheats': [...]
                        }
                    ]
                }
            }
        """
        user_id = session.get('user_id')
        if not user_id:
            return {'logged_in': False}, 401
        
        user = User.query.get(user_id)
        if not user:
            return {'error': 'User not found'}, 404
        
        # Schema handles ALL the grouping logic!
        return {
            'logged_in': True,
            'user': user_schema.dump(user)
        }, 200


# ================ CHEAT RESOURCES ================ #

class CheatList(Resource):
    def get(self):
        """
        Get all cheats for logged-in user.
        Optional filters: language_id, category_id
        """
        user_id = session.get('user_id')
        if not user_id:
            return {'error': 'Not logged in'}, 401
        
        # Base query
        query = Cheat.query.filter_by(user_id=user_id)
        
        # Apply filters if provided
        language_id = request.args.get('language_id')
        if language_id:
            query = query.filter_by(language_id=language_id)
        
        category_id = request.args.get('category_id')
        if category_id:
            query = query.filter_by(category_id=category_id)
        
        cheats = query.all()
        
        # Serialize with nested language and category
        return cheats_schema.dump(cheats), 200
    
    def post(self):
        """Create new cheat."""
        user_id = session.get('user_id')
        if not user_id:
            return {'error': 'Not logged in'}, 401
        
        data = request.get_json()
        
        # Create cheat
        cheat = Cheat(
            title=data['title'],
            code=data['code'],
            notes=data.get('notes', ''),
            user_id=user_id,
            language_id=data['language_id'],
            category_id=data['category_id']
        )
        
        db.session.add(cheat)
        db.session.commit()
        
        # Return complete cheat with nested relationships
        return cheat_schema.dump(cheat), 201


class CheatDetail(Resource):
    def get(self, cheat_id):
        """Get single cheat by ID."""
        cheat = Cheat.query.get_or_404(cheat_id)
        return cheat_schema.dump(cheat), 200
    
    def patch(self, cheat_id):
        """Update cheat."""
        user_id = session.get('user_id')
        if not user_id:
            return {'error': 'Not logged in'}, 401
        
        cheat = Cheat.query.get_or_404(cheat_id)
        
        # Verify ownership
        if cheat.user_id != user_id:
            return {'error': 'Unauthorized'}, 403
        
        # Update fields if provided
        data = request.get_json()
        if 'title' in data:
            cheat.title = data['title']
        if 'code' in data:
            cheat.code = data['code']
        if 'notes' in data:
            cheat.notes = data['notes']
        if 'language_id' in data:
            cheat.language_id = data['language_id']
        if 'category_id' in data:
            cheat.category_id = data['category_id']
        
        db.session.commit()
        
        # Return updated cheat with nested relationships
        return cheat_schema.dump(cheat), 200
    
    def delete(self, cheat_id):
        """Delete cheat."""
        user_id = session.get('user_id')
        if not user_id:
            return {'error': 'Not logged in'}, 401
        
        cheat = Cheat.query.get_or_404(cheat_id)
        
        # Verify ownership
        if cheat.user_id != user_id:
            return {'error': 'Unauthorized'}, 403
        
        db.session.delete(cheat)
        db.session.commit()
        
        return {'message': 'Deleted'}, 200


# ================ LANGUAGE RESOURCES ================ #

class LanguageList(Resource):
    def get(self):
        """Get all languages."""
        languages = Language.query.all()
        return languages_schema.dump(languages), 200


# ================ CATEGORY RESOURCES ================ #

class CategoryList(Resource):
    def get(self):
        """Get all categories."""
        categories = Category.query.all()
        return categories_schema.dump(categories), 200


# ================ DEV TOOLS RESOURCE ================ #

class DevToolsResource(Resource):
    def post(self):
        """Execute development commands."""
        data = request.get_json()
        command = data.get('command')
        
        results = {
            'command': command,
            'output': '',
            'error': '',
            'success': False
        }
        
        try:
            if command == 'check_session':
                # Check current session/db info
                from sqlalchemy import inspect
                inspector = inspect(db.engine)
                tables = inspector.get_table_names()
                
                # Get table row counts
                counts = {}
                for table in tables:
                    result = db.session.execute(db.text(f"SELECT COUNT(*) FROM {table}"))
                    counts[table] = result.scalar()
                
                results['output'] = "=== DATABASE INFO ===\n\n"
                results['output'] += f"Tables ({len(tables)}):\n"
                for table in tables:
                    results['output'] += f"  • {table}: {counts[table]} rows\n"
                
                # Session info
                user_id = session.get('user_id')
                if user_id:
                    user = User.query.get(user_id)
                    results['output'] += f"\n=== SESSION ===\n"
                    results['output'] += f"Logged in as: {user.name} ({user.email})\n"
                else:
                    results['output'] += f"\n=== SESSION ===\nNo active session\n"
                
                results['success'] = True
                
            elif command == 'delete_db':
                # Remove database file
                import os
                db_path = 'instance/app.db'
                if os.path.exists(db_path):
                    os.remove(db_path)
                    results['output'] = f"✓ Deleted {db_path}\n\n⚠️  You'll need to restart Flask server!"
                    results['success'] = True
                else:
                    results['output'] = f"⚠️  Database file not found at {db_path}"
                    results['success'] = True
                    
            elif command == 'create_db':
                # Create all tables
                db.create_all()
                results['output'] = "✓ Database tables created successfully!\n\nTables created:\n"
                
                from sqlalchemy import inspect
                inspector = inspect(db.engine)
                tables = inspector.get_table_names()
                for table in tables:
                    results['output'] += f"  • {table}\n"
                
                results['success'] = True
                
            elif command == 'upgrade_db':
                # Run migrations
                import subprocess
                result = subprocess.run(
                    ['flask', 'db', 'upgrade'],
                    capture_output=True,
                    text=True,
                    cwd='.'
                )
                results['output'] = result.stdout or "Migration completed"
                results['error'] = result.stderr
                results['success'] = result.returncode == 0
                
            elif command == 'run_seed':
                # Run seed file
                import subprocess
                result = subprocess.run(
                    ['python', 'seed.py'],
                    capture_output=True,
                    text=True,
                    cwd='.'
                )
                results['output'] = result.stdout or "Seed completed"
                results['error'] = result.stderr
                results['success'] = result.returncode == 0
                
            elif command == 'generate_seed':
                # Generate seed file from current database
                seed_content = self._generate_seed_file()
                
                with open('seed_generated.py', 'w') as f:
                    f.write(seed_content)
                    
                results['output'] = "✓ Generated seed_generated.py from current database!\n\n"
                results['output'] += "File contents:\n"
                results['output'] += "• All users with hashed passwords\n"
                results['output'] += "• All languages\n"
                results['output'] += "• All categories\n"
                results['output'] += "• All cheats with code and notes\n\n"
                results['output'] += "Run with: python seed_generated.py"
                results['success'] = True
                
            else:
                results['error'] = f"Unknown command: {command}"
                
        except Exception as e:
            import traceback
            results['error'] = str(e)
            results['output'] = traceback.format_exc()
            
        return jsonify(results)
    
    def _generate_seed_file(self):
        """Generate a seed.py file from current database state."""
        from datetime import datetime
        
        users = User.query.all()
        languages = Language.query.all()
        categories = Category.query.all()
        cheats = Cheat.query.all()
        
        # Generate user code
        user_lines = []
        for u in users:
            user_lines.append(
                f"        users['{u.name}'] = User(\n"
                f"            name='{u.name}',\n"
                f"            email='{u.email}'\n"
                f"        )\n"
                f"        users['{u.name}']._password_hash = '{u._password_hash}'\n"
                f"        db.session.add(users['{u.name}'])"
            )
        
        # Generate language code
        lang_lines = []
        for lang in languages:
            lang_lines.append(
                f"        languages['{lang.name}'] = Language(\n"
                f"            name='{lang.name}'\n"
                f"        )\n"
                f"        db.session.add(languages['{lang.name}'])"
            )
        
        # Generate category code
        cat_lines = []
        for cat in categories:
            cat_lines.append(
                f"        categories['{cat.name}'] = Category(\n"
                f"            name='{cat.name}'\n"
                f"        )\n"
                f"        db.session.add(categories['{cat.name}'])"
            )
        
        # Generate cheat code
        cheat_lines = []
        for cheat in cheats:
            # Escape quotes and newlines
            title = cheat.title.replace("'", "\\'").replace('"', '\\"')
            code = cheat.code.replace("'", "\\'").replace('"', '\\"').replace('\n', '\\n')
            notes = (cheat.notes or "").replace("'", "\\'").replace('"', '\\"').replace('\n', '\\n')
            
            cheat_lines.append(
                f"        cheat = Cheat(\n"
                f"            title='{title}',\n"
                f"            code='{code}',\n"
                f"            notes='{notes}',\n"
                f"            user=users['{cheat.user.name}'],\n"
                f"            language=languages['{cheat.language.name}'],\n"
                f"            category=categories['{cheat.category.name}']\n"
                f"        )\n"
                f"        db.session.add(cheat)"
            )
        
        seed_template = """#!/usr/bin/env python3
\"\"\"
Auto-generated seed file
Generated: {timestamp}
\"\"\"
from app import create_app
from app.extensions import db
from app.models import User, Language, Category, Cheat

def seed_database():
    app = create_app()
    
    with app.app_context():
        print("🌱 Starting seed...")
        
        # Clear existing data
        print("Clearing existing data...")
        Cheat.query.delete()
        Language.query.delete()
        Category.query.delete()
        User.query.delete()
        db.session.commit()
        
        # Create Users
        print("Creating users...")
        users = {{}}
{user_code}
        db.session.commit()
        
        # Create Languages
        print("Creating languages...")
        languages = {{}}
{language_code}
        db.session.commit()
        
        # Create Categories
        print("Creating categories...")
        categories = {{}}
{category_code}
        db.session.commit()
        
        # Create Cheats
        print("Creating cheats...")
{cheat_code}
        db.session.commit()
        
        print("✅ Seed completed!")
        print(f"  • {{len(users)}} users")
        print(f"  • {{len(languages)}} languages")
        print(f"  • {{len(categories)}} categories")
        print(f"  • {{len(cheats)}} cheats")

if __name__ == "__main__":
    seed_database()
"""
        
        return seed_template.format(
            timestamp=datetime.now().isoformat(),
            user_code='\n'.join(user_lines) if user_lines else '        pass',
            language_code='\n'.join(lang_lines) if lang_lines else '        pass',
            category_code='\n'.join(cat_lines) if cat_lines else '        pass',
            cheat_code='\n'.join(cheat_lines) if cheat_lines else '        pass'
        )


# ================ REGISTER ROUTES ================ #

def initialize_routes(api):
    """Register all API endpoints."""
    # Auth
    api.add_resource(Signup, '/signup')
    api.add_resource(Login, '/login')
    api.add_resource(Logout, '/logout')
    api.add_resource(CheckSession, '/check_session')
    
    # Cheats
    api.add_resource(CheatList, '/cheats')
    api.add_resource(CheatDetail, '/cheats/<int:cheat_id>')
    
    # Languages & Categories
    api.add_resource(LanguageList, '/languages')
    api.add_resource(CategoryList, '/categories')
    
    # Dev Tools
    api.add_resource(DevToolsResource, '/dev-tools')