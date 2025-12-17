from flask import request, jsonify, session
from flask_restful import Resource
from sqlalchemy.orm import joinedload
from .extensions import db
from .models import User, Cheat, Language, Category 
from .serializers import user_schema, users_schema, language_schema, languages_schema, category_schema, categories_schema, cheat_schema, cheats_schema
import json
import os
import re
from collections import defaultdict
import html as html_module


class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = User.query.get(user_id)
            return {
                "logged_in": True,
                "user": user_schema.dump(user)
            }, 200
        return {"logged_in": False}, 401


### =========== USER ROUTES =========== ###
class UserDetail(Resource):
    def get(self, id):
        user = User.query.get_or_404(id)
        return user_schema.dump(user), 200

class UserList(Resource):
    def get(self):
        users = User.query.all()
        return users_schema.dump(users), 200
    
    def post(self):  
        data = request.json
        user = User(
            name=data['name'],
            email=data['email']
        )
        user.password = data['password']
        db.session.add(user)
        db.session.commit()
        session['user_id'] = user.id
        return user_schema.dump(user), 201
    
class Login(Resource):
    def post(self):
        data = request.json
        user = User.query.filter_by(email=data['email']).first()
        if user and user.check_password(data['password']):
            session['user_id'] = user.id
            return user_schema.dump(user), 200
        return {'error': 'Invalid email or password'}, 401

class Logout(Resource):
    def post(self):
        session.pop('user_id', None)
        return {}, 204


### =========== LANGUAGE ROUTES =========== ###
class LanguageDetail(Resource):
    def get(self, id):
        language = Language.query.get_or_404(id)
        return language_schema.dump(language), 200

class LanguageList(Resource):
    def get(self):
        languages = Language.query.all()
        return languages_schema.dump(languages), 200


### =========== CATEGORY ROUTES =========== ###
class CategoryDetail(Resource):
    def get(self, id):
        category = Category.query.get_or_404(id)
        return category_schema.dump(category), 200

class CategoryList(Resource):
    def get(self):
        categories = Category.query.all()
        return categories_schema.dump(categories), 200


### =========== CHEAT ROUTES =========== ###
class CheatDetail(Resource):
    def get(self, id):
        cheat = Cheat.query.get_or_404(id)
        return cheat_schema.dump(cheat), 200
        
    def delete(self, id):
        cheat = Cheat.query.get_or_404(id)
        db.session.delete(cheat)
        db.session.commit()
        return {}, 204
    
    def patch(self, id):
        cheat = Cheat.query.get_or_404(id)
        data = request.json
        cheat.title = data.get('title', cheat.title)
        cheat.code = data.get('code', cheat.code)
        cheat.notes = data.get('notes', cheat.notes)
        cheat.language_id = data.get('language_id', cheat.language_id)
        cheat.category_id = data.get('category_id', cheat.category_id)
        db.session.commit()
        return cheat_schema.dump(cheat), 200

class CheatList(Resource):
    def get(self):
        cheats = Cheat.query.all()
        return cheats_schema.dump(cheats), 200
    
    def post(self):
        data = request.json
        user = User.query.get(data['user_id'])
        category = Category.query.get(data['category_id'])
        language = Language.query.get(data['language_id'])
        
        cheat = Cheat(
            title=data['title'],
            code=data['code'],
            notes=data.get('notes', ''),
            user=user,
            category=category,
            language=language
        )
        db.session.add(cheat)
        db.session.commit()
        return cheat_schema.dump(cheat), 201


# ================ DEV TOOLS RESOURCE ================ #

class DevToolsResource(Resource):
    def post(self):
        from flask import current_app
        
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
                from sqlalchemy import inspect
                inspector = inspect(db.engine)
                tables = inspector.get_table_names()
                
                counts = {}
                for table in tables:
                    result = db.session.execute(db.text(f"SELECT COUNT(*) FROM {table}"))
                    counts[table] = result.scalar()
                
                results['output'] = "=== DATABASE INFO ===\n\n"
                results['output'] += f"Tables ({len(tables)}):\n"
                for table in tables:
                    results['output'] += f"  • {table}: {counts[table]} rows\n"
                
                user_id = session.get('user_id')
                if user_id:
                    user = User.query.get(user_id)
                    results['output'] += f"\n=== SESSION ===\n"
                    results['output'] += f"Logged in as: {user.name} ({user.email})\n"
                else:
                    results['output'] += f"\n=== SESSION ===\nNo active session\n"
                
                results['success'] = True
                
            elif command == 'delete_db':
                db_path = 'instance/app.db'
                if os.path.exists(db_path):
                    os.remove(db_path)
                    results['output'] = f"✓ Deleted {db_path}\n\n⚠️  Restart Flask server!"
                else:
                    results['output'] = f"⚠️  Database file not found"
                results['success'] = True
                    
            elif command == 'create_db':
                db.create_all()
                from sqlalchemy import inspect
                inspector = inspect(db.engine)
                tables = inspector.get_table_names()
                results['output'] = "✓ Tables created:\n" + "\n".join(f"  • {t}" for t in tables)
                results['success'] = True
                
            elif command == 'upgrade_db':
                import subprocess
                result = subprocess.run(['flask', 'db', 'upgrade'], capture_output=True, text=True)
                results['output'] = result.stdout or "Migration completed"
                results['error'] = result.stderr
                results['success'] = result.returncode == 0
                
            elif command == 'run_seed':
                import subprocess
                result = subprocess.run(['python', 'seed.py'], capture_output=True, text=True)
                results['output'] = result.stdout or "Seed completed"
                results['error'] = result.stderr
                results['success'] = result.returncode == 0
                
            elif command == 'generate_seed':
                results['output'] = "✓ generate_seed not implemented yet"
                results['success'] = True
                
            elif command == 'generate_curl':
                results['output'] = "Visit http://localhost:5555/curl in browser"
                results['success'] = True
                
            elif command == 'class_inventory':
                results['output'] = "Visit http://localhost:5555/class-inventory in browser"
                results['success'] = True
                
            else:
                results['error'] = f"Unknown command: {command}"
                
        except Exception as e:
            import traceback
            results['error'] = str(e)
            results['output'] = traceback.format_exc()
            
        return results


# ================ DEV TOOLS BROWSER PAGES ================ #

def register_devtools(app, api_prefix=''):
    """Register browser-accessible dev tool pages."""
    
    SCHEMA_MAP = {
        "users": user_schema,
        "cheats": cheat_schema,
        "languages": language_schema,
        "categories": category_schema
    }
    
    @app.route('/curl')
    def curl_page():
        """Browser page with all curl commands + copy buttons."""
        
        def extract_fields(schema):
            if schema is None:
                return []
            return [f for f in getattr(schema, "fields", {}) 
                    if f not in ("id", "_password_hash", "created_at", "updated_at")]
        
        base_url = "http://localhost:5555"
        commands = []
        
        for rule in app.url_map.iter_rules():
            if rule.endpoint in ("static", "curl_page", "class_inventory_page", "devtools_home", "debug_session"):
                continue
            
            methods = [m for m in rule.methods if m in ["GET", "POST", "PATCH", "PUT", "DELETE"]]
            
            for method in methods:
                url = str(rule)
                curl_cmd = f"curl -X {method} {base_url}{url}"
                
                schema = None
                for key, s in SCHEMA_MAP.items():
                    if key in url:
                        schema = s
                        break
                
                if method in ["POST", "PATCH", "PUT"] and schema:
                    fields = extract_fields(schema)
                    if fields:
                        data = {f: f"<{f}>" for f in fields}
                        curl_cmd += f" -H 'Content-Type: application/json' -d '{json.dumps(data)}'"
                
                if url in [f"{api_prefix}/logout", f"{api_prefix}/check_session"]:
                    curl_cmd += " -b cookies.txt"
                
                if url in [f"{api_prefix}/login", f"{api_prefix}/users"]:
                    curl_cmd += " -c cookies.txt"
                
                commands.append({
                    "header": f"{method} {url}",
                    "curl": curl_cmd
                })
        
        page_html = """<!DOCTYPE html>
<html>
<head>
    <title>cURL Commands</title>
    <style>
        body { font-family: monospace; padding: 20px; background: #1a1a1a; color: #0f0; }
        h1 { color: #0ff; }
        a { color: #0ff; }
        .cmd-box { background: #2a2a2a; padding: 15px; border-radius: 5px; margin: 10px 0; position: relative; }
        .header { color: #0ff; font-weight: bold; margin-bottom: 8px; }
        .curl { color: #0f0; white-space: pre-wrap; word-wrap: break-word; }
        .copy-btn { 
            position: absolute; top: 10px; right: 10px; 
            background: #0ff; color: #000; border: none; 
            padding: 5px 10px; cursor: pointer; border-radius: 3px; font-family: monospace;
        }
        .copy-btn:hover { background: #0f0; }
        .copy-btn.copied { background: #0f0; }
        .nav { margin-bottom: 20px; }
        .nav a { margin-right: 15px; }
    </style>
</head>
<body>
    <div class="nav">
        <a href="/devtools">← DevTools Home</a>
        <a href="/class-inventory">Class Inventory</a>
    </div>
    <h1>cURL Commands</h1>
"""
        
        for cmd in commands:
            escaped_curl = html_module.escape(cmd["curl"])
            page_html += f"""
    <div class="cmd-box">
        <button class="copy-btn" data-curl="{escaped_curl}" onclick="copyCmd(this)">Copy</button>
        <div class="header">{cmd["header"]}</div>
        <div class="curl">{cmd["curl"]}</div>
    </div>
"""
        
        page_html += """
    <script>
        function copyCmd(btn) {
            const text = btn.getAttribute('data-curl');
            navigator.clipboard.writeText(text);
            btn.textContent = 'Copied!';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.textContent = 'Copy';
                btn.classList.remove('copied');
            }, 1500);
        }
    </script>
</body>
</html>
"""
        return page_html
    
    
    @app.route('/class-inventory')
    def class_inventory_page():
        """Browser page showing CSS class usage across React components."""
        
        root_dir = './client/src'
        
        if not os.path.exists(root_dir):
            return f"<h1>❌ Directory '{root_dir}' not found!</h1>"
        
        class_inventory = defaultdict(lambda: {'files': [], 'count': 0})
        pattern = r'className=["\']([^"\']+)["\']|className=\{["\']([^"\']+)["\']\}'
        
        for root, dirs, files in os.walk(root_dir):
            dirs[:] = [d for d in dirs if d not in ['node_modules', 'dist', 'build', '.git']]
            
            for file in files:
                if file.endswith(('.jsx', '.js', '.tsx', '.ts')):
                    filepath = os.path.join(root, file)
                    rel_path = os.path.relpath(filepath, root_dir)
                    
                    try:
                        with open(filepath, 'r', encoding='utf-8') as f:
                            content = f.read()
                            matches = re.findall(pattern, content)
                            for match in matches:
                                classes = match[0] or match[1]
                                for classname in classes.split():
                                    if classname:
                                        class_inventory[classname]['files'].append(rel_path)
                                        class_inventory[classname]['count'] += 1
                    except:
                        pass
        
        categorized = {'shared': {}, 'service': {}, 'component': {}}
        
        for classname, data in class_inventory.items():
            unique_files = list(set(data['files']))
            count = len(unique_files)
            
            if count >= 3:
                categorized['shared'][classname] = unique_files
            elif count == 2:
                categorized['service'][classname] = unique_files
            else:
                categorized['component'][classname] = unique_files
        
        page_html = """<!DOCTYPE html>
<html>
<head>
    <title>Class Inventory</title>
    <style>
        body { font-family: monospace; padding: 20px; background: #1a1a1a; color: #0f0; }
        h1, h2 { color: #0ff; }
        a { color: #0ff; }
        .nav { margin-bottom: 20px; }
        .nav a { margin-right: 15px; }
        .section { background: #2a2a2a; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .class-item { padding: 8px; border-bottom: 1px solid #333; }
        .class-item:last-child { border-bottom: none; }
        .class-name { color: #ff0; font-weight: bold; }
        .file-list { color: #888; font-size: 12px; margin-top: 4px; }
        .count { color: #0f0; }
        .stats { display: flex; gap: 20px; margin-bottom: 20px; }
        .stat-box { background: #2a2a2a; padding: 15px; border-radius: 5px; text-align: center; }
        .stat-num { font-size: 24px; color: #0ff; }
    </style>
</head>
<body>
    <div class="nav">
        <a href="/devtools">← DevTools Home</a>
        <a href="/curl">cURL Commands</a>
    </div>
    <h1>Class Inventory</h1>
    
    <div class="stats">
        <div class="stat-box">
            <div class="stat-num">""" + str(len(class_inventory)) + """</div>
            <div>Total Classes</div>
        </div>
        <div class="stat-box">
            <div class="stat-num">""" + str(len(categorized['shared'])) + """</div>
            <div>Shared (3+)</div>
        </div>
        <div class="stat-box">
            <div class="stat-num">""" + str(len(categorized['service'])) + """</div>
            <div>Service (2)</div>
        </div>
        <div class="stat-box">
            <div class="stat-num">""" + str(len(categorized['component'])) + """</div>
            <div>Component (1)</div>
        </div>
    </div>
"""
        
        # Shared classes
        page_html += "<div class='section'><h2>📦 Shared Classes (3+ files)</h2>"
        for classname in sorted(categorized['shared'].keys()):
            files = categorized['shared'][classname]
            page_html += f"""
            <div class="class-item">
                <span class="class-name">{classname}</span> 
                <span class="count">({len(files)} files)</span>
                <div class="file-list">{', '.join(files)}</div>
            </div>
"""
        page_html += "</div>"
        
        # Service classes
        page_html += "<div class='section'><h2>🔧 Service Classes (2 files)</h2>"
        for classname in sorted(categorized['service'].keys()):
            files = categorized['service'][classname]
            page_html += f"""
            <div class="class-item">
                <span class="class-name">{classname}</span>
                <div class="file-list">{', '.join(files)}</div>
            </div>
"""
        page_html += "</div>"
        
        # Component classes
        page_html += "<div class='section'><h2>🎯 Component Classes (1 file)</h2>"
        for classname in sorted(categorized['component'].keys()):
            files = categorized['component'][classname]
            page_html += f"""
            <div class="class-item">
                <span class="class-name">{classname}</span>
                <div class="file-list">{files[0]}</div>
            </div>
"""
        page_html += "</div></body></html>"
        
        return page_html
    
    
    @app.route('/devtools')
    def devtools_home():
        """DevTools landing page with links to all tools."""
        
        return """<!DOCTYPE html>
<html>
<head>
    <title>DevTools</title>
    <style>
        body { font-family: monospace; padding: 20px; background: #1a1a1a; color: #0f0; }
        h1 { color: #0ff; }
        .tool-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
        .tool-card { 
            background: #2a2a2a; padding: 20px; border-radius: 5px; 
            text-decoration: none; color: #0f0; display: block;
            border: 1px solid #333; transition: all 0.2s;
        }
        .tool-card:hover { border-color: #0ff; background: #333; }
        .tool-card h2 { color: #0ff; margin: 0 0 10px 0; font-size: 18px; }
        .tool-card p { margin: 0; color: #888; font-size: 14px; }
    </style>
</head>
<body>
    <h1>🛠 DevTools</h1>
    <div class="tool-grid">
        <a href="/curl" class="tool-card">
            <h2>📋 cURL Commands</h2>
            <p>Auto-generated curl commands for all API routes with copy buttons</p>
        </a>
        <a href="/class-inventory" class="tool-card">
            <h2>🎨 Class Inventory</h2>
            <p>Scan React components for className usage and categorize by reuse</p>
        </a>
    </div>
</body>
</html>
"""


### =========== ROUTE INITIALIZATION =========== ###
    
def initialize_routes(api):
    api.add_resource(UserList, '/users')
    api.add_resource(UserDetail, '/users/<int:id>')
    api.add_resource(CheckSession, '/check_session')
    api.add_resource(Login, '/login')
    api.add_resource(Logout, '/logout')
    api.add_resource(LanguageList, '/languages')
    api.add_resource(LanguageDetail, '/languages/<int:id>')
    api.add_resource(CategoryList, '/categories')
    api.add_resource(CategoryDetail, '/categories/<int:id>')
    api.add_resource(CheatList, '/cheats')
    api.add_resource(CheatDetail, '/cheats/<int:id>')
    api.add_resource(DevToolsResource, '/devtools')
    
    # Register browser pages on the app directly
    register_devtools(api.app, api_prefix='/api')