from flask import Flask, send_from_directory
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from app.config import Config
from app.extensions import db, bcrypt, ma
import os

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    db.init_app(app)
    bcrypt.init_app(app)
    ma.init_app(app)
    Migrate(app, db)
    
    CORS(app,
         resources={r"/*": {"origins": "*"}},
         supports_credentials=True,
         allow_headers=["Content-Type"],
         methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])
    
    # Import models so Flask-Migrate sees them
    from . import models
    
    # Create Flask-RESTful API instance
    api = Api(app)
    
    # Register API routes
    from .routes import initialize_routes
    initialize_routes(api)
    
    # Serve React app for all non-API routes
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_react(path):
        """Serve React app."""
        dist_dir = os.path.join(os.path.dirname(app.root_path), 'client', 'dist')
        if path and os.path.exists(os.path.join(dist_dir, path)):
            return send_from_directory(dist_dir, path)
        return send_from_directory(dist_dir, 'index.html')
    
    return app