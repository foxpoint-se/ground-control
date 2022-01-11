import requests
import json
import flask
import os
import eventlet
from flask_socketio import SocketIO, emit
from utils.serial_helpers import SerialReaderWriter
from gp import GP, ButtonCodes


class State:
    def __init__(self) -> None:
        self.updates = []
        self.gp_connection_status = False


state = State()

app = flask.Flask(__name__)
app.config["DEBUG"] = True

# Apparently important when a separate process wants to emit events.
# Read more: https://flask-socketio.readthedocs.io/en/latest/deployment.html?highlight=eventlet#emitting-from-an-external-process
eventlet.monkey_patch()

socketio = SocketIO(
    app,
    cors_allowed_origins="http://localhost:3000",
    async_mode="eventlet",
)


@socketio.on("connect")
def on_connection():
    print("Websocket client connected.")
    emit("ALL_POSITIONS", {"positions": state.updates})
    emit("GP_CONNECTION_STATUS", {"isConnected": state.gp_connection_status})


@socketio.on("disconnect")
def test_disconnect():
    print("Websocket client disconnected")


def post_request(url, data):
    try:
        requests.post(url, json=data, timeout=0.5)
    except requests.exceptions.ConnectionError:
        # web app isn't started
        pass

    except requests.exceptions.ReadTimeout:
        print("request timed out", url, data)


def handle_receive_line(line):
    try:
        data = json.loads(line)
        state.updates.append(data)
        socketio.emit("NEW_POSITION", {"position": data})
    except Exception as err:
        print("Line was not a json. Ignoring. Line:", line, err)


# TODO: ändra timeout
env_serial_port = os.environ.get("GC_SERIAL_PORT", "/dev/ttyUSB0")
reader_writer = SerialReaderWriter(
    env_serial_port, on_message=handle_receive_line, timeout=5
)


def right_handler(value_right):
    msg = str(value_right)
    line = "R: {}".format(msg)
    reader_writer.send(line)


def forward_handler(value_forward):
    msg = str(value_forward)
    line = "M: {}".format(msg)
    reader_writer.send(line)


@socketio.on("CLEAR_POSITIONS")
def handle_clear_positions():
    state.updates = []
    emit("ALL_POSITIONS", {"positions": state.updates})


@socketio.on("COMMAND")
def handle_command(data):
    command = data.get("command")
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
    socketio.emit("GP_CONNECTION_STATUS", {"isConnected": is_connected})


gamepad = GP(
    debug=False,
    on_event=gp_event_handler,
    on_connection_change=handle_connection_change,
)

if __name__ == "__main__":
    socketio.run(app)
