#!/usr/bin/env python3

# https://github.com/CopterExpress/mavlink-websocket/blob/master/mavlink-websocket/mavlink-websocket.py

import os
import logging
import time
import threading

from pymongo import MongoClient
from pymavlink import mavutil, mavwp
from pymavlink.mavutil import mavlink
from mongo import MongoConnection
from link import MavlinkListener
import math


logging.basicConfig(level=logging.INFO)
wp = mavwp.MAVWPLoader()


class DroneHandler(MongoConnection, MavlinkListener):
    def __init__(self):
        MavlinkListener.__init__(self)
        MongoConnection.__init__(self)
    
    def GLOBAL_POSITION_INT_HANDLER(self, msg_dict):
        # Get GPS Position
        pos = [msg_dict['lat'] / 10000000, msg_dict['lon'] / 10000000]

        # Check if Difference is big enough
        pos_difference = [abs(pos[i] - self.latest_pos[i]) * 10000000 for i in range(len(pos))]
        alt = msg_dict['alt'] / 1000
        alt_difference = abs(self.latest_alt - alt)
        if pos_difference[0] > 5 or pos_difference[1] > 5 or alt_difference >= 1:
            # Update Mongo
            self.update_drone(msg_dict['sysid'], { "pos": pos })
            print(f'Updated Position to {pos}; alt to {alt}')
            # Update Lasest pos
            self.latest_pos = pos[:]
            self.latest_alt = alt
    
    def HEARTBEAT_HANDLER(self, msg_dict):
        self.armed =  msg_dict["system_status"] == 4
    
    def EXTENDED_SYS_STATE_HANDLER(self, msg_dict):
        # Get landed state
        landed_state = msg_dict['landed_state']
        # Check if different from previous
        if landed_state != self.latest_landing:
            # Update Mongo
            self.update_drone(msg_dict['sysid'], { "landed_state": landed_state })
            # Update Latest landing
            self.latest_landing = landed_state
            print(f"Updated Landed State to {landed_state}")
    
    def TAKEOFF_ACTION_HANDLER(self):
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

    def deliver_order(self, _id):
        place_from, place_to, order = self.get_order(_id)
        print(f'Starting Order from {place_from["pos"]} to {place_to["pos"]}')
        self.delivering = True
        self.update_order(order, "in-progress")
        self.mission_goto(place_from["pos"])
        time.sleep(5)
        while True:
            print(f'Check Armed: {self.armed}')
            if not self.armed:
                break
            time.sleep(5)
        self.mission_goto(place_to["pos"])
        print("First Point Reached")
        time.sleep(10)
        while True:
            print(f'Check Armed: {self.armed}')
            if not self.armed:
                break
            time.sleep(5)
        print('Completed Order')
        self.update_order(order, "completed")
        self.update_drone(self.mavconn.target_system, { "ordersQuery": self.orders_query[1:] })
        self.delivering = False


    def handle_message(self, msg_dict):
        if msg_dict['msgid'] == mavlink.MAVLINK_MSG_ID_GLOBAL_POSITION_INT:
            self.GLOBAL_POSITION_INT_HANDLER(msg_dict)
        elif msg_dict['msgid'] == mavlink.MAVLINK_MSG_ID_EXTENDED_SYS_STATE:
            self.EXTENDED_SYS_STATE_HANDLER(msg_dict)
        elif msg_dict['msgid'] == mavlink.MAVLINK_MSG_ID_HEARTBEAT:
            self.HEARTBEAT_HANDLER(msg_dict)

    def execute_query(self):
        self.orders_query = self.get_order_query()
        print('Initialized Query')
        print(self.orders_query)
        while True:
            if not self.delivering and len(self.orders_query):
                print('Started New Order')
                self.deliver_order(self.orders_query[0])
            time.sleep(10)

    
    # def handle_action(self, action, info):
    #     if action == 'order':
    #         print('Order Action Received')
    #         self.deliver_order(info["order"])
    
    def listen(self):

        thread_msg = threading.Thread(target=self.receive_messages)
        thread_act = threading.Thread(target=self.receive_actions)
        thread_query = threading.Thread(target=self.execute_query)
        thread_msg.start()
        thread_act.start()
        thread_query.start()

listener = DroneHandler()
listener.listen()