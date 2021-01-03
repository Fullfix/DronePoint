import os
from pymongo import MongoClient


mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/')
mongo_db = os.environ.get('MONGO_DB', 'dronepoint')
client = MongoClient(mongo_url)

db = client[mongo_db]
