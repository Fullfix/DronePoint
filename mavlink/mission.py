# https://www.colorado.edu/recuv/2015/05/25/mavlink-protocol-waypoints

from pymavlink import mavwp


def make_mission(order):
    """Generates MAVLink mission of the order"""
    wp = mavwp.MAVWPLoader()


def check_intersections(mission1, mission2):
    pass
