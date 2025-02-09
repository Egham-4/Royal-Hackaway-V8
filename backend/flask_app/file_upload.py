from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from flask_app.models.DataFile import DataFile

bp = Blueprint('file_upload', __name__)

ALLOWED_EXTENSTIONS = ['csv']
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSTIONS

@bp.route('/fileupload', methods=['POST'])
def file_upload():
    # user_email = get_jwt_identity()
    user_email = 'hamza@rafi.com'

    if 'file' not in request.files:
        return jsonify({"error": "no file provided"}), 400

    file = request.files['file']

    # file is empty
    if file.filename == '':
        return jsonify({"error": "no file"}), 400

    if file and allowed_file(file.filename):
        datafile = DataFile()
        datafile.store_file(user_email, file.filename, file)
        print("success")

        return jsonify({"message": "file successfully added"})

    return jsonify({"error": "something went wrong"})


