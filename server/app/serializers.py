from app.extensions import ma
from app.models import User, Cheat, Language, Category

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        exclude = ('_password_hash',)

user_schema = UserSchema()
users_schema = UserSchema(many=True)


class LanguageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Language
        load_instance = True

language_schema = LanguageSchema()
languages_schema = LanguageSchema(many=True)


class CategorySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Category
        load_instance = True

category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)


class CheatSchema(ma.SQLAlchemyAutoSchema):
    category = ma.Nested(CategorySchema, only=('id', 'name'))
    
    class Meta:
        model = Cheat
        load_instance = True
        include_fk = True

cheat_schema = CheatSchema()
cheats_schema = CheatSchema(many=True)