from flask_app.models.Collection import Collection
import pandas as pd

class DataFile(Collection):
    def __init__(self) -> None:
        super().__init__()
        self.collection_name = 'datafiles'

    def store_file(self, project_id, title, description, final_report, summary, sub_reports):
        # data = clean_file.to_dict(orient="records")
        file_data = {
            "project_id": project_id,
            "title": title,
            "description": description,
            "final_report": final_report,
            "summary": summary,
            "sub_reports": sub_reports
        }

        return self.create(file_data)
    
    def get_datasets_by_project_id(self,project_id):
        return self.find_all({"project_id": project_id})


