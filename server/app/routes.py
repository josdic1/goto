from flask import request, jsonify, session
from flask_restful import Resource
from app.extensions import db
from app.models import User, Cheat, Language, Category

# ================ AUTH RESOURCES ================ #

class Signup(Resource):
    def post(self):
        data = request.get_json()
        
        if User.query.filter_by(email=data.get('email')).first():
            return {'error': 'Email already exists'}, 400
        
        user = User(name=data['name'], email=data['email'], password=data['password'])
        db.session.add(user)
        db.session.commit()
        
        session['user_id'] = user.id
        return {'id': user.id, 'name': user.name, 'email': user.email}, 201


class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(email=data.get('email')).first()
        
        if user and user.authenticate(data.get('password')):
            session['user_id'] = user.id
            return {'id': user.id, 'name': user.name, 'email': user.email}
        
        return {'error': 'Invalid credentials'}, 401


class Logout(Resource):
    def post(self):
        session.pop('user_id', None)
        return {'message': 'Logged out'}, 200


class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return {'logged_in': False}, 401
        
        user = User.query.get(user_id)
        if not user:
            return {'error': 'User not found'}, 404
        
        cheats = Cheat.query.filter_by(user_id=user_id).all()
        
        # Group by language
        languages = {}
        for cheat in cheats:
            lang_id = cheat.language_id
            if lang_id not in languages:
                languages[lang_id] = {
                    'id': cheat.language.id,
                    'name': cheat.language.name,
                    'cheats': []
                }
            languages[lang_id]['cheats'].append({
                'id': cheat.id,
                'title': cheat.title,
                'code': cheat.code,
                'category': {'id': cheat.category.id, 'name': cheat.category.name}
            })
        
        # Group by category
        categories = {}
        for cheat in cheats:
            cat_id = cheat.category_id
            if cat_id not in categories:
                categories[cat_id] = {
                    'id': cheat.category.id,
                    'name': cheat.category.name,
                    'cheats': []
                }
            categories[cat_id]['cheats'].append({
                'id': cheat.id,
                'title': cheat.title,
                'code': cheat.code,
                'language': {'id': cheat.language.id, 'name': cheat.language.name}
            })
        
        return {
            'logged_in': True,
            'user': {'id': user.id, 'name': user.name, 'email': user.email},
            'languages': list(languages.values()),
            'categories': list(categories.values())
        }


# ================ CHEAT RESOURCES ================ #

class CheatList(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return {'error': 'Not logged in'}, 401
        
        query = Cheat.query.filter_by(user_id=user_id)
        
        language_id = request.args.get('language_id')
        if language_id:
            query = query.filter_by(language_id=language_id)
        
        category_id = request.args.get('category_id')
        if category_id:
            query = query.filter_by(category_id=category_id)
        
        cheats = query.all()
        
        return [{
            'id': c.id,
            'title': c.title,
            'code': c.code,
            'language': {'id': c.language.id, 'name': c.language.name},
            'category': {'id': c.category.id, 'name': c.category.name}
        } for c in cheats], 200
    
    def post(self):
        user_id = session.get('user_id')
        if not user_id:
            return {'error': 'Not logged in'}, 401
        
        data = request.get_json()
        cheat = Cheat(
            title=data['title'],
            code=data['code'],
            user_id=user_id,
            language_id=data['language_id'],
            category_id=data['category_id']
        )
        
        db.session.add(cheat)
        db.session.commit()
        
        return {'id': cheat.id, 'title': cheat.title, 'code': cheat.code}, 201


class CheatDetail(Resource):
    def get(self, cheat_id):
        cheat = Cheat.query.get_or_404(cheat_id)
        return {
            'id': cheat.id,
            'title': cheat.title,
            'code': cheat.code,
            'language': {'id': cheat.language.id, 'name': cheat.language.name},
            'category': {'id': cheat.category.id, 'name': cheat.category.name}
        }, 200
    
    def patch(self, cheat_id):
        user_id = session.get('user_id')
        if not user_id:
            return {'error': 'Not logged in'}, 401
        
        cheat = Cheat.query.get_or_404(cheat_id)
        if cheat.user_id != user_id:
            return {'error': 'Unauthorized'}, 403
        
        data = request.get_json()
        if 'title' in data:
            cheat.title = data['title']
        if 'code' in data:
            cheat.code = data['code']
        if 'language_id' in data:
            cheat.language_id = data['language_id']
        if 'category_id' in data:
            cheat.category_id = data['category_id']
        
        db.session.commit()
        return {'message': 'Updated'}, 200
    
    def delete(self, cheat_id):
        user_id = session.get('user_id')
        if not user_id:
            return {'error': 'Not logged in'}, 401
        
        cheat = Cheat.query.get_or_404(cheat_id)
        if cheat.user_id != user_id:
            return {'error': 'Unauthorized'}, 403
        
        db.session.delete(cheat)
        db.session.commit()
        
        return {'message': 'Deleted'}, 200


# ================ LANGUAGE RESOURCES ================ #

class LanguageList(Resource):
    def get(self):
        languages = Language.query.all()
        return [{'id': l.id, 'name': l.name} for l in languages], 200


# ================ CATEGORY RESOURCES ================ #

class CategoryList(Resource):
    def get(self):
        categories = Category.query.all()
        return [{'id': c.id, 'name': c.name} for c in categories], 200


# ================ REGISTER ROUTES ================ #

def initialize_routes(api):
    api.add_resource(Signup, '/signup')
    api.add_resource(Login, '/login')
    api.add_resource(Logout, '/logout')
    api.add_resource(CheckSession, '/check_session')
    
    api.add_resource(CheatList, '/cheats')
    api.add_resource(CheatDetail, '/cheats/<int:cheat_id>')
    
    api.add_resource(LanguageList, '/languages')
    api.add_resource(CategoryList, '/categories')