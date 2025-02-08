from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from backend.models.User import User

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register', methods=['POST'])
def register():
    content = request.get_json()
    username = content['username']
    password = content['password']
    email  = content['email']
    firstname = content['firstname']
    lastname = content['lastname']
    phone_number = content['phone_number']

    user = User()
    response = user.create_user(firstname, lastname, username, password, email, phone_number)

    return jsonify(response)

@bp.route('/login', methods=["POST"])
def login():
    content = request.get_json()
    email = content['email']
    password = content['password']

    user = User()
    user = user.authenticate_user(email, password)

    access_token = create_access_token(identity=user['email'])
    return jsonify({"access_token": access_token}), 200

@bp.route('/test')
@jwt_required()
def test():
    user = get_jwt_identity()
    print(user)
    return jsonify(user)



