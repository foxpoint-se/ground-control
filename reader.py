#!/usr/bin/env python3
import sys
import serial
import time
import requests
import json
from simulator import Serial

DEFAULT_BAUDRATE = 115200
DEFAULT_PORT_NAME = 'COM7'
DEFAULT_USE_SIM = True


def list_get(list, index, default=None):
    try:
        return list[index]
    except IndexError:
        return default


def publish_position(position):
    url = 'http://localhost:3000/positions'
    requests.post(url, json=position)


# format
# position: {"lat": 10, "lon": 10}
position_key = "position:"


def find_position(string):
    start = string.find(position_key)
    if start < 0:
        return None

    start += len(position_key)
    end = string.find("}")
    if end < 0:
        return None

    substring = string[start:end+1]
    try:
        body = json.loads(substring)
        keys = body.keys()
        if "lat" in keys and "lon" in keys:
            return body
    except json.decoder.JSONDecodeError as e:
        print('failed to parse position', e)
        return None


if __name__ == "__main__":
    baudrate = int(list_get(sys.argv, 3, DEFAULT_BAUDRATE))
    port_name = str(list_get(sys.argv, 2, DEFAULT_PORT_NAME))
    use_sim = bool(list_get(sys.argv, 1, DEFAULT_USE_SIM))
    print('starting with settings: use_sim: ', use_sim,
          'port_name:', port_name, 'baudrate:',  baudrate)

    if use_sim:
        ser = Serial(port_name, baudrate=baudrate, timeout=2)
    else:
        ser = serial.Serial(port_name, baudrate, timeout=2)

    time.sleep(2)

    while True:
        line = ser.readline()
        if line:
            string = line.decode('utf-8')
            print(string)
            position = find_position(string)
            if position:
                publish_position(position)
