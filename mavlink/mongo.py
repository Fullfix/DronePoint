import os
import pymongo
from pymongo import MongoClient
from weather import is_weather_ok
from decouple import config

class MongoConnection:
    def __init__(self):
        self.mongo_url = config('DB_CONNECTION')
        self.mongo_db = 'test'
        self.pipeline = [{ '$match': { 'operationType': 'update' }}]
        client = MongoClient(self.mongo_url)
        self.db = client[self.mongo_db]
        print('CONNECTED TO DB')
    
    def get_dronepoint(self, _id):
        return self.db.dronepoints.find_one({ "_id": _id })
    
    def get_full_order(self, _id):
        order = self.db.orders.find_one({ "_id": _id })
        place_from = self.db.dronepoints.find_one({ "_id": order["placeFrom"] })
        place_to = self.db.dronepoints.find_one({ "_id": order["placeTo"] })
        return place_from, place_to, order["_id"]
    
    def get_order(self, _id):
        order = self.db.orders.find_one({ "state": "not-started", "_id": _id })
        place_from = self.db.dronepoints.find_one({ "_id": order["placeFrom"] })
        place_to = self.db.dronepoints.find_one({ "_id": order["placeTo"] })
        return place_from, place_to, order["_id"]
    
    def update_drone(self, sysid, data):
        self.db.drones.update_one({ "sysid": sysid }, { "$set": data })
    
    def update_order(self, _id, state):
        self.db.orders.update_one({ "_id": _id }, { "$set": { "state": state }})

    def take_cargo(self, _id):
        self.db.orders.update_one({ "_id": _id }, 
        { "$set": { "cargoTaken": True }})
    
    def get_from_shelf(self, dronepoint_id, order_id):
        shelf = self.db.dronepoints.find_one({ "_id": dronepoint_id })["shelf"]
        if order_id not in shelf:
            return print('No order found in shelf')
        index = shelf.index(order_id)
        self.db.dronepoints.update_one(
            { "_id": dronepoint_id },
            { "$set": { f"shelf.{index}": None }},
        )
    
    def put_in_shelf(self, dronepoint_id, order_id):
        shelf = self.db.dronepoints.find_one({ "_id": dronepoint_id })["shelf"]
        if None not in shelf:
            return print('No empty space found in shelf')
        index = shelf.index(None)
        self.db.dronepoints.update_one(
            { "_id": dronepoint_id },
            { "$set": { f"shelf.{index}": order_id }},
        )
    
    def get_priority_order(self):
        def order_filter(order):
            place_from, place_to, _ = self.get_order(order['_id'])
            # Check shelf
            if all(place_to['shelf']):
                return False
            # Check weather
            # if not is_weather_ok(place_from, place_to):
            #     print('Bad Weather')
            #     return False
            return True

        orders = list(self.db.orders.find(
            { "state": "not-started" }
        ).sort([("createdAt", pymongo.ASCENDING)]))
        orders = list(filter(order_filter, orders))
        print('Found orders')
        print(orders)
        if len(orders):
            return orders[0]

    def get_current_dronepoint(self):
        return self.db.drones.find_one()['currentDronepoint']
    
    def receive_actions(self):
        with self.db.drones.watch(self.pipeline) as stream:
            while stream.alive:
                update_change = stream.try_next()
                if update_change is None:
                    continue
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

    def receive_state(self):
        print('Start Watching states')
        with self.db.orders.watch(self.pipeline) as stream:
            while stream.alive:
                update_change = stream.try_next()
                if update_change is None:
                    continue
                info = update_change['updateDescription']['updatedFields']
                if 'state' in info.keys():
                    if info['state'] == 'inserting-cargo':
                        self.INSERT_ACTION_HANDLER(
                            update_change['documentKey']['_id'])
                    if info['state'] == 'giving-cargo':
                        self.GIVE_ACTION_HANDLER(
                            update_change['documentKey']['_id'])
                    if info['state'] == 'completed':
                        self.RETURN_ACTION_HANDLER(
                            update_change['documentKey']['_id'])
    
    def handle_action(self, action):
        pass