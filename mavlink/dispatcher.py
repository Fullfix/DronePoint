import time
import logging

from . import weather, mission

def get_orders_by_priority():
    pass


def is_order_ready_to_execute(order):
    if not weather.is_weather_ok():
        return False

    _mission = mission.make_mission(order)

    if not weather.is_weather_ok_for_mission(_mission):
        return False

    # Check intersections with all running missions
    # Check total mission length and time


def execute_order(order):
    pass


# Dispatcher runs globally for a system, one-threaded, one-proccessed

logging.debug('Start loop')

while True:
    logging.debug('Get orders by priority')
    orders = get_orders_by_priority()

    for order in orders:
        logging.debug('Is order %s ready to execute?', order)

        if is_order_ready_to_execute(order):
            logging.info('Execute order %s', order)
            execute_order(order)

    time.sleep(5)
