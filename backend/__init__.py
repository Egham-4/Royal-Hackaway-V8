from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    # cors = CORS(app, resources={r"/auth/*": {"origins": "http://localhost:3000"}})

    app.config['CORS_HEADERS'] = 'Content-Type'

    app.config['mongo_db_url'] = 'mongodb+srv://rafihamza2020:k2vWNEwgPfJXCIkZ@cluster0.bohiq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    app.config['JWT_SECRET_KEY'] = "alkjdlkasjdf;lkajhfa"

    jwt = JWTManager(app)

    from . import db
    db.init_app(app)

    from . import auth
    app.register_blueprint(auth.bp)

    CORS(app)
    
    return app


