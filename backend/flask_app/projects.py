from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from flask_app.models.Project import Project

bp = Blueprint('projects', __name__)

@bp.route('/project', methods=['POST'])
@bp.route('/project/<int:id>', methods=['GET'])
@jwt_required()
def handle_project(project_id=None):
    user_email = get_jwt_identity()
    project_db = Project()

    if request.method == 'POST':
        form_data = request.get_json()
        id = form_data['id']
        title = form_data['title']
        description = form_data['id']

        project_db.store_project(id, user_email, title, description)

        return jsonify({"message": "project successfully added"})

    if request.method == 'GET':
        project = project_db.get_project_by_id(project_id)
        return project

@bp.route('/projects', methods=['GET'])
@jwt_required()
def get_projects():
    user_email = get_jwt_identity()
    project_db = Project()

    projects = project_db.get_projects_belonging_to_user(user_email)
    print(projects)

    return jsonify(projects)

