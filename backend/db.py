import pymongo
from flask import Flask, current_app, g

def init_app(app: Flask):
    app.teardown_appcontext(close_db)

def get_db():
    if 'db' not in g:
        g.mongo_client = pymongo.MongoClient(current_app.config['mongo_db_url'])
        g.db = g.mongo_client['hackathon']
    return g.db

def close_db(e=None):
    db_client = g.pop('mongo_client', None)

    if db_client is not None:
        db_client.close()
