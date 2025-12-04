from app.extensions import db, bcrypt
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime, timezone
from app.extensions import db, bcrypt, ma


################# MODELS #################

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    _password_hash = db.Column(db.String(128), nullable=False)
    
    cheats = db.relationship('Cheat', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)
    
    def __repr__(self):
        return f'<User {self.name}>'


class Language(db.Model):
    __tablename__ = 'languages'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    
    cheats = db.relationship('Cheat', backref='language', lazy=True)
    
    def __init__(self, name):
        self.name = name
    
    def __repr__(self):
        return f'<Language {self.name}>'


class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    
    cheats = db.relationship('Cheat', backref='category', lazy=True)
    
    def __init__(self, name):
        self.name = name
    
    def __repr__(self):
        return f'<Category {self.name}>'


class Cheat(db.Model):
    __tablename__ = 'cheats'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    code = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    language_id = db.Column(db.Integer, db.ForeignKey('languages.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    def __init__(self, title, code, user_id, language_id, category_id):
        self.title = title
        self.code = code
        self.user_id = user_id
        self.language_id = language_id
        self.category_id = category_id
    
    def __repr__(self):
        return f'<Cheat {self.title}>'