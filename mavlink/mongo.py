import os
from pymongo import MongoClient

class MongoConnection:
    def __init__(self):
        self.mongo_url = 'mongodb+srv://Nenovist:O2MWyXylQmQUKSdD@cluster0.mcawk.mongodb.net/test?authSource=admin&replicaSet=atlas-ja0ogq-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true'
        self.mongo_db = 'test'
        self.pipeline = [{ '$match': { 'operationType': 'update' }}]
        client = MongoClient(self.mongo_url)
        self.db = client[self.mongo_db]
    
    def get_order(self, _id):
        order = self.db.orders.find_one({ "state": "not-started", "_id": _id })
        place_from = self.db.dronepoints.find_one({ "_id": order["placeFrom"] })
        place_to = self.db.dronepoints.find_one({ "_id": order["placeTo"] })
        return place_from, place_to, order["_id"],
    
    def update_drone(self, sysid, data):
        self.db.drones.update_one({ "sysid": sysid }, { "$set": data })
    
    def update_order(self, _id, state):
        self.db.orders.update_one({ "_id": _id }, { "$set": { "state": state }})
    
    def receive_actions(self):
        while True:
            stream = self.db.drones.watch(self.pipeline)
            for update_change in stream:
                # Check if action was updated
                info = update_change['updateDescription']['updatedFields']
                if 'action' in info.keys():
                    print('Detected Action Update')
                    # Handle actions
                    self.handle_action(info['action'], info)
                    self.db.drones.update_one({ "sysid": self.mavconn.target_system }, { "$set": {
                        "action": "",
                        "order": None,
                    }})
    
    def handle_action(self, action):
        pass