from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from backend.models.User import User

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register', methods=['POST'])
@cross_origin()
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

    return jsonify(response[0]), response[1]

@bp.route('/login', methods=["POST"])
@cross_origin()
def login():
    content = request.get_json()
    email = content['email']
    password = content['password']

    user = User()
    user = user.authenticate_user(email, password)

    if user != None:
        access_token = create_access_token(identity=user['email'])
        # remove password from data
        del user['password']
        print(user)
        print(type(user))
        return jsonify({"access_token": access_token, "user": user}), 200

    return jsonify({"error": "Invalid credentials"}), 401

@bp.route('/test')
@jwt_required()
def test():
    user = get_jwt_identity()
    print(user)
    return jsonify(user)



