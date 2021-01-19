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
    
    def get_order_query(self):
        return self.db.drones.find_one()['ordersQuery']
    
    def get_current_dronepoint(self):
        return self.db.drones.find_one()['currentDronepoint']
    
    def receive_actions(self):
        while True:
            stream = self.db.drones.watch(self.pipeline)
            for update_change in stream:
                # Check if action was updated
                info = update_change['updateDescription']['updatedFields']
                if 'ordersQuery' in info.keys():
                    print('Detected Action Update')
                    # Handle actions
                    print(info['ordersQuery'])
                    self.orders_query = info['ordersQuery']
                if 'currentDronepoint' in info.keys():
                    print('Detected current Dronepoint change')
                    print(info['currentDronepoint'])
                    self.current_dronepoint = info['currentDronepoint']
    
    def handle_action(self, action):
        pass