from flask import Flask, session  # <- add session here
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from .config import Config
from .extensions import db, bcrypt, ma
def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    bcrypt.init_app(app)
    ma.init_app(app)
    Migrate(app, db)

    CORS(app, 
         resources={r"/*": {"origins": "http://localhost:5173"}},
         supports_credentials=True,
         allow_headers=["Content-Type"],
         methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])

    # Import models so Flask-Migrate sees them
    from . import models
    
    # Create Flask-RESTful API instance
    api = Api(app)
    
    # Register routes
    from .routes import initialize_routes
    api = Api(app, prefix='/api')  # <- adds /api to all routes
    initialize_routes(api) 

    @app.route("/debug_session")
    def debug_session():
        return dict(session) 
    

    return app


    