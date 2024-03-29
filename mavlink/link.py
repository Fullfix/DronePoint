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
from graph import get_path
import math


logging.basicConfig(level=logging.INFO)
wp = mavwp.MAVWPLoader()


class MavlinkListener:
    def __init__(self):
        self.url = os.environ.get('MAVLINK_ENDPOINT', 'udpin:0.0.0.0:14540')
        self.mavconn = mavutil.mavlink_connection(self.url, source_system=255)
        print('Mavlink initialized. Waiting for connection')
        self.mavconn.wait_heartbeat()
        print('Connected to Mavlink')

        # Initialize latest variables
        self.latest_pos = [-1, -1]
        self.latest_landing = -1
        self.latest_alt = -1
        self.current_dronepoint = None
        self.armed = False
        self.delivering = False

        # Modes
        self.CUSTOM_MODE_LOADING_DRONE = 5 
        self.CUSTOM_MODE_UNLOADING_DRONE = 6
        self.CUSTOM_MODE_GETTING_FROM_USER = 7
        self.CUSTOM_MODE_UNLOADING_TO_USER = 8
        self.CUSTOM_MODE_CHANGING_BATTERY = 9
    
    def set_home(self, homelocation, altitude):
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
    
    def dronepoint_action(self, mode):
        try:
            # self.mavconn.mav.command_long_send(
            #     self.mavconn.target_system, 
            #     self.mavconn.target_component, 
            #     mavlink.MAV_CMD_DO_SET_MODE, 
            #     1, 
            #     mavlink.MAV_MODE_FLAG_CUSTOM_MODE_ENABLED, 
            #     mode, 
            #     3, 0, 0, 0, 0)
            print('Dronepoint action executed successfully')
        except BaseException as e:
            print(e)
    
    def take_cargo_action(self):
        self.dronepoint_action(self.CUSTOM_MODE_LOADING_DRONE)
        time.sleep(3)
    
    def put_cargo_action(self):
        self.dronepoint_action(self.CUSTOM_MODE_UNLOADING_DRONE)
        time.sleep(3)
    
    def give_cargo_action(self):
        self.dronepoint_action(self.CUSTOM_MODE_UNLOADING_TO_USER)
        time.sleep(3)
    
    def get_cargo_action(self):
        self.dronepoint_action(self.CUSTOM_MODE_GETTING_FROM_USER)
        time.sleep(3)
    
    def mission_exec(self, dpfrom, destination):
        print('Initiating Mission')
        wp.clear()
        # Takeoff
        frame = mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT

        # p = mavlink.MAVLink_mission_item_message(
        #     self.mavconn.target_system,
        #     self.mavconn.target_component,
        #     0,
        #     mavlink.MAV_FRAME_MISSION,
        #     mavlink.MAV_CMD_DO_CHANGE_SPEED,
        #     0,
        #     1,
        #     0, 30, 0, 0,
        #     0,
        #     0,
        #     0,
        # )
        # wp.add(p)

        path = get_path(dpfrom["name"], destination["name"])[1:]
        print(path[0])
        print(path[1])


        p = mavlink.MAVLink_mission_item_message(
            self.mavconn.target_system,
            self.mavconn.target_component,
            0,
            frame,
            mavlink.MAV_CMD_NAV_TAKEOFF,
            0,
            1,
            15, 0, 0, math.nan,
            path[0][0],
            path[0][1],
            20,
        )
        wp.add(p)
        # print('PATH')
        # print(dpfrom["name"], destination["name"])
        # print(get_path(dpfrom["name"], destination["name"]))
        # Waypoint
        for point in path:
            p = mavlink.MAVLink_mission_item_message(
                self.mavconn.target_system,
                self.mavconn.target_component,
                1,
                frame,
                mavlink.MAV_CMD_NAV_WAYPOINT,
                0,
                1,
                0, 10, 0, math.nan,
                point[0],
                point[1],
                20,
            )
            wp.add(p)
        # Land
        p = mavlink.MAVLink_mission_item_message(
            self.mavconn.target_system,
            self.mavconn.target_component,
            2,
            frame,
            mavlink.MAV_CMD_NAV_LAND,
            0,
            1,
            0, 0, 0, math.nan,
            path[-1][0],
            path[-1][1],
            0,
        )
        wp.add(p)

        # self.set_home(self.latest_pos, self.latest_alt)
        # msg = self.mavconn.recv_match(type=['COMMAND_ACK'], blocking=True)
        # print('Received message')
        # print(msg)

        # Send waypoints
        self.mavconn.waypoint_clear_all_send()
        self.mavconn.waypoint_count_send(wp.count())

        for i in range(wp.count()):
            msg = self.mavconn.recv_match(type=['MISSION_REQUEST'], blocking=True)
            print(msg)
            self.mavconn.mav.send(wp.wp(msg.seq))
            print(f'Sending waypoint {msg.seq}')
        # msg = self.mavconn.recv_match(type=['MISSION_ACK'])
        # print('Received mission')
        # print(msg)

        # Start Mission
        self.mavconn.set_mode_auto()
        print('Started Mission')

    def mission_goto(self, destination):
        print('Initiating Mission')
        wp.clear()


        # # Speed
        # p = mavlink.MAVLink_mission_item_message(
        #     self.mavconn.target_system,
        #     self.mavconn.target_component,
        #     0,
        #     mavlink.MAV_FRAME_MISSION,
        #     mavlink.MAV_CMD_DO_CHANGE_SPEED,
        #     0,
        #     1,
        #     0, 100, 0, 0,
        #     0,
        #     0,
        #     0,
        # )
        # wp.add(p)

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
            15, 0, 0, math.nan,
            self.latest_pos[0],
            self.latest_pos[1],
            20,
        )
        wp.add(p)
        # Waypoint
        p = mavlink.MAVLink_mission_item_message(
            self.mavconn.target_system,
            self.mavconn.target_component,
            1,
            frame,
            mavlink.MAV_CMD_NAV_WAYPOINT,
            0,
            1,
            0, 10, 0, math.nan,
            destination[0],
            destination[1],
            20,
        )
        wp.add(p)
        # Land
        p = mavlink.MAVLink_mission_item_message(
            self.mavconn.target_system,
            self.mavconn.target_component,
            2,
            frame,
            mavlink.MAV_CMD_NAV_LAND,
            0,
            1,
            0, 0, 0, math.nan,
            destination[0],
            destination[1],
            0,
        )
        wp.add(p)

        # Message
        # self.set_home(self.latest_pos, self.latest_alt)
        # self.set_home(destination, self.latest_alt)
        # msg = self.mavconn.recv_match(type=['COMMAND_ACK'], blocking=True)
        # print('Received message')
        # print(msg)

        # Send waypoints
        self.mavconn.waypoint_clear_all_send()
        self.mavconn.waypoint_count_send(wp.count())

        for i in range(wp.count()):
            msg = self.mavconn.recv_match(type=['MISSION_REQUEST'], blocking=True)
            print(msg)
            self.mavconn.mav.send(wp.wp(msg.seq))
            print(f'Sending waypoint {msg.seq}')
        # msg = self.mavconn.recv_match(type=['MISSION_ACK'])
        # print('Received mission')
        # print(msg)

        # Start Mission
        time.sleep(1)
        self.mavconn.set_mode_auto()
        print('Started Mission')
    
    def receive_messages(self):
        print('Start Watching Messages')
        while True:
            msg = self.mavconn.recv_match(blocking=True)
            msg_dict = msg.to_dict()
            msg_dict['msgid'] = msg.get_msgId()
            msg_dict['sysid'] = msg.get_srcSystem()
            msg_dict['compid'] = msg.get_srcComponent()
            del msg_dict['mavpackettype']
            # Convert NaN to None
            for key in msg_dict:
                if isinstance(msg_dict[key], float) and math.isnan(msg_dict[key]):
                    msg_dict[key] = None
            self.handle_message(msg_dict)
            
    def handle_message(self, msg):
        pass