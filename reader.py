#!/usr/bin/env python3
import sys
import serial
import time
import requests
import json
from simulator import Serial

DEFAULT_BAUDRATE = 9600
# DEFAULT_BAUDRATE = 115200
# DEFAULT_PORT_NAME = 'COM7'
DEFAULT_PORT_NAME = 'COM5'
# DEFAULT_USE_SIM = True
DEFAULT_USE_SIM = False


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


st_key = "ST,"
lat_key = "LA,"
lon_key = "LT,"
heading_key = "HE,"


def find_lat(string):
    start = string.find(lat_key)
    if start < 0:
        return None

    start += len(lat_key)

    substring = string[start:]
    return float(substring)


def find_heading(string):
    start = string.find(heading_key)
    if start < 0:
        return None

    start += len(heading_key)

    substring = string[start:]
    return float(substring)


def find_lon(string):
    start = string.find(lon_key)
    if start < 0:
        return None

    start += len(lon_key)

    substring = string[start:]
    return float(substring)


curr_pos = {"lat": None, "lon": None, "heading": None}

# G --> go, dvs starta motor
# S --> stop, dvs stoppa motor
# L --> left, sväng vänster
# R --> right, sväng höger
# C --> center, centrera rodret


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
            # print(string)
            lat = find_lat(string)
            if lat:
                # print("LAT", lat)
                curr_pos["lat"] = lat
            lon = find_lon(string)
            if lon:
                curr_pos["lon"] = lon

            heading = find_heading(string)
            if heading:
                curr_pos["heading"] = heading

            if curr_pos["lat"] and curr_pos["lon"] and curr_pos["heading"]:
                # print('HEJ HEJ CURR POS', curr_pos)
                publish_position(curr_pos)
                curr_pos = {"lat": None, "lon": None, "heading": None}

            # position = find_position(string)
            # if position:
            #     publish_position(position)

    line = ""
    counter = 0
    while True:

        b = ser.read(1)
        s = b.decode("utf-8")
        # print(b)
        line += s
        # # print(line)
        # if s == '\r' or s is '\r' or s == '\n' or s is '\n' or s is 'Q' or s == 'Q':
        # if s == '\r' or s is '\r':
        if s == ",":
            counter += 1

        if counter == 5:
            print("Line: {}".format(line))
            counter = 0
            line = ""
        # if s == '\r' or s == 'Q':
        #     print('LINE', line)
        #     line = ""
