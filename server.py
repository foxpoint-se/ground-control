import requests
import json
import flask
import os
from datetime import datetime
from flask import request, jsonify
from readerwriter import Runner


positions = []

STATE_MAP = {
    10: 'WAIT_FOR_GPS',
    20: 'PLAN_COURSE',
    40: 'NORMAL_OPERATIONS',
    50: 'TARGET_REACHED',
    60: 'RADIO_CTRL',
}


def publish_response(response):
    url = 'http://localhost:3000/responses'
    try:
        requests.post(url, json=response, timeout=0.5)
    except requests.exceptions.ConnectionError:
        print('kunde inte posta', response, 'har du startat servern?')

    except requests.exceptions.ReadTimeout:
        print('ReadTimeout, publish_response tajmade ut')


def publish_position(position):
    url = 'http://localhost:3000/positions'
    try:
        requests.post(url, json=position, timeout=0.5)
    except requests.exceptions.ConnectionError:
        print('kunde inte posta', position, 'har du startat servern?')

    except requests.exceptions.ReadTimeout:
        print('ReadTimeout, publish_position tajmade ut')


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

# SY,0 system
# GY,3 gyro
# MA,0 magnetometer
# AC,1 accelerometer

# skicka A, M


# ST,60
# LT,17.981509
# LA,59.307113
# HE,180.000000
# SE,0
# DT,99999.000000
# OK;bla bla bla
state_key = "ST,"
lat_key = "LA,"
lon_key = "LT,"
heading_key = "HE,"
distance_key = "DT,"
okay_key = "OK,"
system_key = "SY,"
gyro_key = "GY,"
magneto_key = "MA,"
accelerometer_key = "AC,"
gnss_key = "GNSS,"
imu_key = "IMU,"



curr_update = {
    "lat": None,
    "lon": None,
    "heading": None,
    "programState": None,
    "distanceToTarget": None,
    "receivedAt": None,
    "accelerometer": None,
    "magnetometer": None,
    "gyro": None,
    "system": None
}


def find_string(string, key):
    start = string.find(key)
    if start < 0:
        return None

    start += len(key)

    substring = string[start:]
    return substring


app = flask.Flask(__name__)
app.config["DEBUG"] = True


def handle_receive_line(line):
    global curr_update

    state = find_string(line, state_key)
    if state:
        curr_update["programState"] = STATE_MAP[int(state)]

    distance = find_string(line, distance_key)
    if distance:
        curr_update["distanceToTarget"] = float(distance)


    imu = find_string(line, imu_key)
    if imu:
        imu_obj = json.loads(imu)
        curr_update["heading"] = imu_obj["heading"]
        curr_update["accelerometer"] = imu_obj["accelerometer"]
        curr_update["magnetometer"] = imu_obj["magnetometer"]
        curr_update["gyro"] = imu_obj["gyro"]
        curr_update["system"] = imu_obj["system"]
        curr_update["is_calibrated"] = imu_obj["is_calibrated"]


    gnss = find_string(line, gnss_key)
    if gnss:
        gnss_obj = json.loads(gnss)
        curr_update["lat"] = gnss_obj["lat"]
        curr_update["lon"] = gnss_obj["lon"]

    message = find_string(line, okay_key)
    if message:
        response = {'ok': True, 'message': message}
        publish_response(response)

    if curr_update["lat"] and curr_update["lon"]:
        curr_update["receivedAt"] = str(datetime.utcnow()) + ' UTC'

        publish_position(curr_update)
        curr_update = {
            "lat": None,
            "lon": None,
            "heading": None,
            "programState": None,
            "distanceToTarget": None,
            "receivedAt": None,
            "accelerometer": None,
            "magnetometer": None,
            "gyro": None,
            "system": None
        }


def handle_receive_line2(line):
    position = find_position(line)
    if position:
        publish_position(position)

def handle_receive_line3(line):
    print(line)


env_serial_port = os.environ['GC_SERIAL_PORT']
if env_serial_port:
    runner = Runner(on_receive_line=handle_receive_line, port_name=env_serial_port, use_sim=False)
else:
    runner = Runner(on_receive_line=handle_receive_line, use_sim=False)


runner.start()


@app.route("/command", methods=["GET"])
def command():
    command = request.args.get('value')
    if command:
        runner.send(message=command)
    return jsonify({})


@app.route("/start", methods=["GET"])
def start():
    runner.start()
    return jsonify({})


@app.route("/stop", methods=["GET"])
def stop():
    runner.stop()
    return jsonify({})


app.run()
