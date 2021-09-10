import requests
import json
import flask
from flask import request, jsonify, send_from_directory
from readerwriter import Runner


positions = []


def publish_position(position):
    url = 'http://localhost:3000/positions'
    try:
        requests.post(url, json=position, timeout=0.5)
    except requests.exceptions.ConnectionError:
        print('kunde inte posta', position, 'har du startat servern?')


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

curr_pos = {"lat": None, "lon": None, "heading": None}


def find_float(string, key):
    start = string.find(key)
    if start < 0:
        return None

    start += len(key)

    substring = string[start:]
    return float(substring)


app = flask.Flask(__name__)
app.config["DEBUG"] = True


def handle_receive_line(line):
    global curr_pos
    lat = find_float(line, lat_key)
    if lat:
        curr_pos["lat"] = lat
    lon = find_float(line, lon_key)
    if lon:
        curr_pos["lon"] = lon
    heading = find_float(line, heading_key)
    if heading:
        curr_pos["heading"] = heading

    if curr_pos["lat"] and curr_pos["lon"] and curr_pos["heading"]:
        publish_position(curr_pos)
        curr_pos = {"lat": None, "lon": None, "heading": None}


def handle_receive_line2(line):
    position = find_position(line)
    if position:
        publish_position(position)


runner = Runner(on_receive_line=handle_receive_line, use_sim=True)
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
