from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    cors = CORS(app)

    app.config['CORS_HEADERS'] = 'Content-Type'

    app.config['mongo_db_url'] = 'mongodb+srv://rafihamza2020:k2vWNEwgPfJXCIkZ@cluster0.bohiq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    app.config['JWT_SECRET_KEY'] = "alkjdlkasjdf;lkajhfa"

    jwt = JWTManager(app)

    from . import db
    db.init_app(app)

    from . import auth
    app.register_blueprint(auth.bp)

    from . import file_upload
    app.register_blueprint(file_upload.bp)

    from . import projects
    app.register_blueprint(projects.bp)
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000)


