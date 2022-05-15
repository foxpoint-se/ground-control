import flask
import os
import eventlet
import json
from flask_socketio import SocketIO, emit
from utils.serial_helpers2 import SerialReaderWriter

# from utils.serial_helpers import SerialReaderWriter
from utils.radio_helpers.client_side import ClientEelState
from utils.radio_helpers.eel_side import CommandMessage, from_json_to_state
from utils.radio_helpers.utils import to_json_filtered
from gp import GP, ButtonCodes
from utils.simplify import simplify_route

SERIAL_PORT = os.environ.get("GC_SERIAL_PORT", "/dev/ttyUSB0")


class GpConnectionState:
    def __init__(self) -> None:
        self.is_connected = False


state = ClientEelState()
gp_connection_state = GpConnectionState()

app = flask.Flask(__name__)

# Apparently important when a separate process wants to emit WS events. Read more:
# https://flask-socketio.readthedocs.io/en/latest/deployment.html?highlight=eventlet#emitting-from-an-external-process
eventlet.monkey_patch()

socketio = SocketIO(
    app,
    cors_allowed_origins="http://localhost:3000",
    async_mode="eventlet",
)


def emit_eel_state():
    state_dict = state.to_dict()
    socketio.emit("ALL_POSITIONS", {"positions": state_dict["positions"]})
    socketio.emit("IMU_UPDATE", {"imu": state_dict["imu"]})
    socketio.emit("NAV_UPDATE", {"nav": state_dict["nav"]})


@socketio.on("connect")
def on_connection():
    print("Websocket client connected.")
    emit("GP_CONNECTION_STATUS", {"isConnected": gp_connection_state.is_connected})
    emit_eel_state()


@socketio.on("disconnect")
def on_disconnect():
    print("Websocket client disconnected")


# TODO: remove
# def handle_receive_line2(line):
#     try:
#         data_to_state = from_json_to_state(line)
#         state.update_eel_state(data_to_state)

#         if data_to_state.g and data_to_state.g.c:
#             pos_update = {"lat": data_to_state.g.c.lt, "lon": data_to_state.g.c.ln}
#             socketio.emit("NEW_POSITION", {"position": pos_update})

#         state_dict = state.to_dict()
#         socketio.emit("IMU_UPDATE", {"imu": state_dict["imu"]})
#         socketio.emit("NAV_UPDATE", {"nav": state_dict["nav"]})

#     except Exception as err:
#         print("Line was not a json. Ignoring. Line:", line, err)


def handle_receive_line(line):
    msg_dict = None
    try:
        msg_dict = json.loads(line)
    except Exception as err:
        print("Line was not a json. Ignoring. Line:", line, err)

    if msg_dict:
        for topic, msg in msg_dict.items():
            socketio.emit(topic, msg)


def right_handler(value_right):
    cmd = CommandMessage(r=value_right)
    msg = to_json_filtered(cmd)
    reader_writer.send(msg)


def forward_handler(value_forward):
    cmd = CommandMessage(m=value_forward)
    msg = to_json_filtered(cmd)
    reader_writer.send(msg)


def nav_handler(value):
    enable_auto_mode = value == "AUTO"
    cmd = CommandMessage(a=enable_auto_mode)
    msg = to_json_filtered(cmd)
    reader_writer.send(msg)


@socketio.on("CLEAR_POSITIONS")
def handle_clear_positions():
    state.positions = []
    emit_eel_state()


@socketio.on("SIMPLIFY")
def handle_simplify():
    simplified = simplify_route(state.positions)
    state.positions = simplified
    emit_eel_state()


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
        elif command == "AUTO" or command == "MANUAL":
            nav_handler(command)
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
    gp_connection_state.is_connected = is_connected
    socketio.emit("GP_CONNECTION_STATUS", {"isConnected": is_connected})


# Workaround for avoiding initializing stuff twice, since Flask
# will do so otherwise, when `use_reloader=True` in debug mode.
if not app.debug or os.environ.get("WERKZEUG_RUN_MAIN") == "true":
    gamepad = GP(
        on_event=gp_event_handler,
        on_connection_change=handle_connection_change,
    )

    reader_writer = SerialReaderWriter(SERIAL_PORT, on_message=handle_receive_line)


if __name__ == "__main__":
    socketio.run(app)
