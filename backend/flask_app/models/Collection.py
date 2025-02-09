from pymongo.synchronous import collection
from ..db import get_db

class Collection:
    def __init__(self) -> None:
        self.collection_name = None

    def get_collection(self):
        if not self.collection_name:
            raise ValueError("collection name not set")

        db = get_db()
        return db[self.collection_name]

    def create(self, data):
        collection = self.get_collection()
        result = collection.insert_one(data)

        return {
                "message": "Document added succesfully",
                "id": str(result.inserted_id)
        }

    def find_by(self, key, value):
        collection = self.get_collection()
        result = collection.find_one({key: value}, {"_id": 0})
        return result if result else None
