#!/usr/bin/env python3

# https://github.com/CopterExpress/mavlink-websocket/blob/master/mavlink-websocket/mavlink-websocket.py

import os
import logging
import time
import threading

from pymongo import MongoClient
from pymavlink import mavutil, mavwp
from pymavlink.mavutil import mavlink
import math


logging.basicConfig(level=logging.INFO)
wp = mavwp.MAVWPLoader()


class MavlinkListener():
    def __init__(self):
        # Mavlink Connection
        self.url = os.environ.get('MAVLINK_ENDPOINT', 'udpin:0.0.0.0:14540')
        self.mavconn = mavutil.mavlink_connection(self.url, source_system=255)
        print('Mavlink initialized. Waiting for connection')
        self.mavconn.wait_heartbeat()
        print('Connected to Mavlink')

        # Mongo Connection
        self.mongo_url = 'mongodb+srv://Nenovist:O2MWyXylQmQUKSdD@cluster0.mcawk.mongodb.net/test?authSource=admin&replicaSet=atlas-ja0ogq-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true'
        self.mongo_db = 'test'
        self.pipeline = [{ '$match': { 'operationType': 'update' }}]
        client = MongoClient(self.mongo_url)
        self.db = client[self.mongo_db]
        print('Connected to Mongo')

        # Initialize latest variables
        self.latest_pos = [-1, -1]
        self.latest_landing = -1
    
    def GLOBAL_POSITION_INT_HANDLER(self, msg_dict):
        # Get GPS Position
        pos = [msg_dict['lat'] / 10000000, msg_dict['lon'] / 10000000]

        # Check if Difference is big enough
        pos_difference = [abs(pos[i] - self.latest_pos[i]) * 10000000 for i in range(len(pos))]
        if pos_difference[0] > 5 or pos_difference[1] > 5:
            # Update Mongo
            self.db.drones.update_one({ "sysid": msg_dict['sysid'] }, { "$set": {
                "pos": pos
            }})
            print(f'Updated Position to {pos}')
            # Update Lasest pos
            self.latest_pos = pos[:]
    
    def EXTENDED_SYS_STATE_HANDLER(self, msg_dict):
        # Get landed state
        landed_state = msg_dict['landed_state']
        # Check if different from previous
        if landed_state != self.latest_landing:
            # Update Mongo
            self.db.drones.update_one({ "sysid": msg_dict['sysid'] }, { "$set": {
                "landed_state": landed_state
            }})
            # Update Latest landing
            self.latest_landing = landed_state
            print(f"Updated Landed State to {landed_state}")
    
    def TAKEOFF_ACTION_HANDLER(self):
        # Clear Action in Mongo
        self.db.drones.update_one({ "sysid": self.mavconn.target_system }, { "$set": {
            "action": "",
        }})
        # Arm Drone
        self.mavconn.mav.command_long_send(
            self.mavconn.target_system,
            self.mavconn.target_component,
            mavlink.MAV_CMD_COMPONENT_ARM_DISARM,
            0,
            1, 0, 0, 0, 0, 0, 0
        )
        # Send Takeoff Action
        self.mavconn.mav.command_long_send(
            self.mavconn.target_system,
            self.mavconn.target_component,
            mavlink.MAV_CMD_NAV_TAKEOFF,
            1, 
            -1, 0, 0, math.nan, math.nan, math.nan, 500,
        )
        print('Takeoff Action Completed')
    
    def SET_HOME(self, homelocation, altitude):
        print('Setting Home')
        self.mavconn.mav.command_long_send(
            self.mavconn.target_system, self.mavconn.target_component,
            mavutil.mavlink.MAV_CMD_DO_SET_HOME,
            1, # set position
            0, # param1
            0, # param2
            0, # param3
            0, # param4
            homelocation[0], # lat
            homelocation[1], # lon
            altitude)
    
    def MISSION_ACTION_HANDLER(self):
        print('Initing Mission')

        # Takeoff
        frame = mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT
        p = mavlink.MAVLink_mission_item_message(
            self.mavconn.target_system,
            self.mavconn.target_component,
            0,
            frame,
            mavlink.MAV_CMD_NAV_TAKEOFF,
            0,
            1,
            15, 0, 0, 0,
            47.397742,
            8.5455939,
            20,
        )
        wp.add(p)
        print('Created Waypoints')

        # Waypoint
        p = mavlink.MAVLink_mission_item_message(
            self.mavconn.target_system,
            self.mavconn.target_component,
            1,
            frame,
            mavlink.MAV_CMD_NAV_WAYPOINT,
            0,
            1,
            0, 10, 0, 0,
            47.398742,
            8.5455939,
            20,
        )
        wp.add(p)
        p = mavlink.MAVLink_mission_item_message(
            self.mavconn.target_system,
            self.mavconn.target_component,
            2,
            frame,
            mavlink.MAV_CMD_NAV_LAND,
            0,
            1,
            0, 0, 0, 0,
            47.398742,
            8.5455939,
            0,
        )
        wp.add(p)


        # Message
        self.SET_HOME([47.397742, 8.5455939], 489)
        msg = self.mavconn.recv_match(type=['COMMAND_ACK'], blocking=True)
        print('Received message')
        print(msg)

        # send waypoints
        self.mavconn.waypoint_clear_all_send()
        self.mavconn.waypoint_count_send(wp.count())

        for i in range(wp.count()):
            msg = self.mavconn.recv_match(type=['MISSION_REQUEST'], blocking=True)
            print(msg)
            self.mavconn.mav.send(wp.wp(msg.seq))
            print(f'Sending waypoint {msg.seq}')
        msg = self.mavconn.recv_match(type=['MISSION_ACK'], blocking=True)
        print('Received mission')
        print(msg)
        # self.mavconn.mav.command_long_send(
        #     self.mavconn.target_system,
        #     self.mavconn.target_component,
        #     mavlink.MAV_CMD_MISSION_START,
        #     1,
        #     0, 0, 0, 0, 0, 0, 0,
        # )
        time.sleep(1)
        self.mavconn.set_mode_auto()
        print('Started Mission')


    def handle_message(self, msg):
        # Prepare msg_dict
        msg_dict = msg.to_dict()
        msg_dict['msgid'] = msg.get_msgId()
        msg_dict['sysid'] = msg.get_srcSystem()
        msg_dict['compid'] = msg.get_srcComponent()
        del msg_dict['mavpackettype']

        # Convert NaN to None
        for key in msg_dict:
            if isinstance(msg_dict[key], float) and math.isnan(msg_dict[key]):
                msg_dict[key] = None

        # Handle message types
        if msg_dict['msgid'] == mavlink.MAVLINK_MSG_ID_GLOBAL_POSITION_INT:
            self.GLOBAL_POSITION_INT_HANDLER(msg_dict)
        elif msg_dict['msgid'] == mavlink.MAVLINK_MSG_ID_EXTENDED_SYS_STATE:
            self.EXTENDED_SYS_STATE_HANDLER(msg_dict)
    
    def handle_stream(self, stream):
        for update_change in stream:
            # Check if action was updated
            info = update_change['updateDescription']['updatedFields']
            if 'action' in info.keys():
                print('Detected Action Update')
                # Handle actions
                if info['action'] == 'takeoff':
                    self.TAKEOFF_ACTION_HANDLER()
    
    def receive_messages(self):
        print('Start Watching Messages')
        while True:
            msg = self.mavconn.recv_match(blocking=True)
            self.handle_message(msg)

    def receive_actions(self):
        print('Start Watching Actions')
        while True:
            stream = self.db.drones.watch(self.pipeline)
            self.handle_stream(stream)
    
    def listen(self):
        thread_msg = threading.Thread(target=self.receive_messages)
        thread_act = threading.Thread(target=self.receive_actions)
        thread_msg.start()
        thread_act.start()
        self.MISSION_ACTION_HANDLER()

listener = MavlinkListener()
listener.listen()