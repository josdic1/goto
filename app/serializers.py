from .extensions import ma
from .models import User, Language, Category, Cheat
from marshmallow import fields

class CheatSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Cheat
        load_instance = True
        include_relationships = False
        include_fk = True

cheat_schema = CheatSchema()
cheats_schema = CheatSchema(many=True)


class CategorySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Category
        load_instance = True
        include_relationships = False

category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)

class LanguageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Language
        load_instance = True
        include_relationships = False

    cheats = fields.Nested(CheatSchema, many=True)

language_schema = LanguageSchema()
languages_schema = LanguageSchema(many=True)


class UserSchema(ma.SQLAlchemyAutoSchema):
    # Field declaration BEFORE Meta class
    categories = fields.Method("get_categories_with_cheats")
    languages = fields.Method("get_languages_with_cheats")
    
    class Meta:
        model = User
        load_instance = True
        include_relationships = False
        exclude = ('_password_hash',)

    def get_categories_with_cheats(self, user):
        print(f"DEBUG: Method called, user has {len(user.cheats)} cheats")
        category_map = {}
        
        for cheat in user.cheats:
            category = cheat.category
            category_id = category.id
            
            if category_id not in category_map:
                category_data = category_schema.dump(category)
                category_data['Cheats'] = []
                category_map[category_id] = category_data
            
            cheat_data = cheat_schema.dump(cheat)
            category_map[category_id]['Cheats'].append(cheat_data)
        
        return list(category_map.values())
    
    def get_languages_with_cheats(self, user):
        print(f"DEBUG: Method called, user has {len(user.cheats)} cheats")
        language_map = {}
        
        for cheat in user.cheats:
            language = cheat.language
            language_id = language.id
            
            if language_id not in language_map:
                language_data = language_schema.dump(language)
                language_data['Cheats'] = []
                language_map[language_id] = language_data
            
            cheat_data = cheat_schema.dump(cheat)
            language_map[language_id]['Cheats'].append(cheat_data)
        
        return list(language_map.values())

user_schema = UserSchema()
users_schema = UserSchema(many=True)


