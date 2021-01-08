import os
from pymongo import MongoClient

class MongoConnection:
    def __init__(self):
        self.mongo_url = 'mongodb+srv://Nenovist:O2MWyXylQmQUKSdD@cluster0.mcawk.mongodb.net/test?authSource=admin&replicaSet=atlas-ja0ogq-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true'
        self.mongo_db = 'test'
        self.pipeline = [{ '$match': { 'operationType': 'update' }}]
        client = MongoClient(self.mongo_url)
        self.db = client[self.mongo_db]
    
    def update_drone(self, sysid, data):
        self.db.drones.update_one({ "sysid": sysid }, { "$set": data })
    
    def receive_actions(self):
        while True:
            stream = self.db.drones.watch(self.pipeline)
            for update_change in stream:
                # Check if action was updated
                info = update_change['updateDescription']['updatedFields']
                if 'action' in info.keys():
                    print('Detected Action Update')
                    # Handle actions
                    self.handle_action(info['action'])
                    self.db.drones.update_one({ "sysid": self.mavconn.target_system }, { "$set": {
                        "action": "",
                    }})
    
    def handle_action(self, action):
        pass