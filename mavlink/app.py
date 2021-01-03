#!/usr/bin/env python3

from flask import Flask
app = Flask(__name__)


@app.route('/api/place_order')
def place_order():
    return 'ok'


@app.route('/api/get_order')
def get_order():
    return 'ok'
