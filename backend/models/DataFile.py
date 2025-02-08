from backend.models.Collection import Collection
import pandas as pd

class DataFile(Collection):
    def __init__(self) -> None:
        super().__init__()
        self.collection_name = 'datafiles'

    def store_file(self, user_email, filename, file):
        df = pd.read_csv(file)
        data = df.to_dict(orient="records")
        file_data = {
            "belongs_to": user_email,
            "filename": filename,
            "data": data
        }

        self.create(file_data)


