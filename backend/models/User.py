from backend.models.Collection import Collection
import bcrypt

class User(Collection):
    def __init__(self) -> None:
        super().__init__()
        self.collection_name = 'users'

    def hash_password(self, password):
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    def verify_password(self, password, hashed_password):
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

    def authenticate_user(self, email, password):
        user = self.get_user_by_email(email)
        hashed_password = self.hash_password(password)

        if user and self.verify_password(password, hashed_password):
            return user

        return None

    def create_user(self, firstname, lastname, username, password, email, phone_number):
        user_data = {
            "firstname": firstname,
            "lastname": lastname,
            "username": username,
            "password": self.hash_password(password),
            "email": email,
            "phone_number": phone_number
        }

        # check if user is already registered
        print(self.get_user_by_email(email))
        if self.get_user_by_email(email):
            return {"error": "email already registered"}, 409
        
        return self.create(user_data), 200

    def get_user_by_email(self, email):
        return self.find_by("email", email)

