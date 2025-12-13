from app.extensions import ma
from app.models import User, Cheat, Language, Category

# ═══════════════════════════════════════════════════════════════
# BASE SCHEMAS (Simple models)
# ═══════════════════════════════════════════════════════════════

class LanguageSchema(ma.SQLAlchemyAutoSchema):
    """Schema for Language model - used in nested relationships."""
    class Meta:
        model = Language
        load_instance = True

language_schema = LanguageSchema()
languages_schema = LanguageSchema(many=True)


class CategorySchema(ma.SQLAlchemyAutoSchema):
    """Schema for Category model - used in nested relationships."""
    class Meta:
        model = Category
        load_instance = True

category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)


# ═══════════════════════════════════════════════════════════════
# CHEAT SCHEMA (With nested relationships)
# ═══════════════════════════════════════════════════════════════

class CheatSchema(ma.SQLAlchemyAutoSchema):
    """
    Schema for Cheat model with nested language and category.
    No redundant foreign key IDs - cleaner JSON.
    """
    language = ma.Nested(LanguageSchema, only=('id', 'name'))
    category = ma.Nested(CategorySchema, only=('id', 'name'))
    
    class Meta:
        model = Cheat
        load_instance = True
        include_fk = False  # No redundant language_id/category_id

cheat_schema = CheatSchema()
cheats_schema = CheatSchema(many=True)


# ═══════════════════════════════════════════════════════════════
# SIMPLE USER SCHEMA (For login/signup)
# ═══════════════════════════════════════════════════════════════

class SimpleUserSchema(ma.SQLAlchemyAutoSchema):
    """
    Simple user schema without cheats.
    Used for login/signup responses.
    """
    class Meta:
        model = User
        load_instance = True
        exclude = ('_password_hash',)

simple_user_schema = SimpleUserSchema()


# ═══════════════════════════════════════════════════════════════
# FULL USER SCHEMA (With grouped cheats using ma.Method)
# ═══════════════════════════════════════════════════════════════

class UserWithGroupedCheatsSchema(ma.SQLAlchemyAutoSchema):
    """
    User schema with cheats grouped by language and category.
    Uses ma.Method for custom serialization logic.
    This is the CLEANEST approach - all grouping logic lives here!
    """
    
    class Meta:
        model = User
        load_instance = True
        exclude = ('_password_hash',)
    
    # Custom fields that override default serialization
    languages = ma.Method("get_languages_with_cheats")
    categories = ma.Method("get_categories_with_cheats")
    
    def get_languages_with_cheats(self, user):
        """
        Group user's cheats by language.
        
        Returns:
            [
                {
                    "id": 1,
                    "name": "JavaScript",
                    "cheats": [...]
                },
                ...
            ]
        """
        # Get all user's cheats in one query
        cheats = Cheat.query.filter_by(user_id=user.id).all()
        
        # Group by language
        grouped = {}
        for cheat in cheats:
            lang_id = cheat.language_id
            if lang_id not in grouped:
                grouped[lang_id] = {
                    'id': cheat.language.id,
                    'name': cheat.language.name,
                    'cheats': []
                }
            grouped[lang_id]['cheats'].append(cheat)
        
        # Serialize each group (batch serialize cheats)
        result = []
        for group in grouped.values():
            result.append({
                'id': group['id'],
                'name': group['name'],
                'cheats': cheats_schema.dump(group['cheats'])
            })
        
        return result
    
    def get_categories_with_cheats(self, user):
        """
        Group user's cheats by category.
        
        Returns:
            [
                {
                    "id": 1,
                    "name": "Arrays",
                    "cheats": [...]
                },
                ...
            ]
        """
        # Get all user's cheats in one query
        cheats = Cheat.query.filter_by(user_id=user.id).all()
        
        # Group by category
        grouped = {}
        for cheat in cheats:
            cat_id = cheat.category_id
            if cat_id not in grouped:
                grouped[cat_id] = {
                    'id': cheat.category.id,
                    'name': cheat.category.name,
                    'cheats': []
                }
            grouped[cat_id]['cheats'].append(cheat)
        
        # Serialize each group (batch serialize cheats)
        result = []
        for group in grouped.values():
            result.append({
                'id': group['id'],
                'name': group['name'],
                'cheats': cheats_schema.dump(group['cheats'])
            })
        
        return result


# Schema instances
user_schema = UserWithGroupedCheatsSchema()
users_schema = UserWithGroupedCheatsSchema(many=True)