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


app = flask.Flask(__name__)
app.config["DEBUG"] = True


def handle_receive_line(line):
    position = find_position(line)
    if position:
        publish_position(position)


runner = Runner(on_receive_line=handle_receive_line)


@app.route("/start", methods=["GET"])
def start():
    runner.start()
    return jsonify({})


@app.route("/stop", methods=["GET"])
def stop():
    runner.stop()
    return jsonify({})


app.run()
