from flask_app.models.Collection import Collection

class Project(Collection):
    def __init__(self) -> None:
        super().__init__()
        self.collection_name = 'projects'

    def store_project(self, id, user_email, title, description):
        project = {
            "id": id,
            "title": title,
            "description": description,
            "belongs_to": user_email,
        }

        new_project = self.create(project)

        return new_project
    
    def get_project_by_id(self, id):
        return self.find_by("id", id)

    def get_projects_belonging_to_user(self, user_email):
        return self.find_all({"belongs_to": user_email})


