import requests
import json
import flask
import os
from flask import request, jsonify
from utils.serial_helpers import SerialReaderWriter
from gp import GP, ButtonCodes


def post_request(url, data):
    try:
        requests.post(url, json=data, timeout=0.5)
    except requests.exceptions.ConnectionError:
        # web app isn't started
        pass

    except requests.exceptions.ReadTimeout:
        print("request timed out", url, data)


def publish_position(position):
    url = "http://localhost:3000/positions"
    post_request(url, position)


def publish_connection_status(is_connected):
    data = {"isConnected": is_connected}
    url = "http://localhost:3000/is_gp_connected"
    post_request(url, data)


app = flask.Flask(__name__)
app.config["DEBUG"] = True


def handle_receive_line(line):
    try:
        data = json.loads(line)
        publish_position(data)
    except Exception as err:
        print("Line was not a json. Ignoring. Line:", line, err)


env_serial_port = os.environ["GC_SERIAL_PORT"] or "/dev/ttyUSB0"
reader_writer = SerialReaderWriter(env_serial_port, on_message=handle_receive_line)


@app.route("/command", methods=["GET"])
def command():
    command = request.args.get("value")
    if command:
        if command == "LEFT":
            right_handler(-1)
        elif command == "RIGHT":
            right_handler(1)
        elif command == "FORWARD":
            forward_handler(1)
        elif command == "BACKWARD":
            forward_handler(-1)
        elif command == "CENTER":
            right_handler(0)
        elif command == "STOP":
            forward_handler(0)
        else:
            reader_writer.send(command)

    return jsonify({})


app.run()


# === gamepad ===


def right_handler(value_right):
    msg = str(value_right)
    line = "R: {}".format(msg)
    reader_writer.send(line)


def forward_handler(value_forward):
    msg = str(value_forward)
    line = "M: {}".format(msg)
    print("motor!", value_forward)
    reader_writer.send(line)


def gp_event_handler(event):
    if (
        event.button_code == ButtonCodes.RIGHT_X
        or event.button_code == ButtonCodes.CROSS_X
    ):
        right_handler(event.value)

    elif (
        event.button_code == ButtonCodes.LEFT_Y
        or event.button_code == ButtonCodes.CROSS_Y
    ):
        forward_handler(event.value)


def handle_connection_change(is_connected):
    publish_connection_status(is_connected)


gamepad = GP(
    debug=False,
    on_event=gp_event_handler,
    on_connection_change=handle_connection_change,
)
