from flask import Flask
from flask_jwt_extended import JWTManager
import pymongo


def create_app():
    app = Flask(__name__, instance_relative_config=True)

    app.config['mongo_db_url'] = 'mongodb+srv://rafihamza2020:k2vWNEwgPfJXCIkZ@cluster0.bohiq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    app.config['JWT_SECRET_KEY'] = "alkjdlkasjdf;lkajhfa"

    jwt = JWTManager(app)

    from . import db
    db.init_app(app)

    from . import auth
    app.register_blueprint(auth.bp)

    from . import file_upload
    app.register_blueprint(file_upload.bp)
    
    return app


