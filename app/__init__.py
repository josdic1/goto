from flask import Flask, session
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from .config import Config
from .extensions import db, bcrypt, ma

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    ma.init_app(app)
    Migrate(app, db)

    # Configure CORS
    CORS(app,
         resources={
             r"/api/*": {"origins": ["http://localhost:5173", "http://localhost:5174", "http://localhost:8081"]}},
         supports_credentials=True)
    # Import models so Flask-Migrate sees them
    from . import models
    
    # Create Flask-RESTful API instance with /api prefix
    api = Api(app, prefix='/api')
    
    # Register routes
    from .routes import initialize_routes
    initialize_routes(api)

    # Debug route to check session
    @app.route("/debug_session")
    def debug_session():
        return dict(session)

    return app