import flask
import os
import eventlet
import json
from flask_socketio import SocketIO, emit
from utils.serial_helpers import SerialReaderWriter

from gp import GP, ButtonCodes
from utils.simplify import simplify_route

SERIAL_PORT = os.environ.get("GC_SERIAL_PORT", "/dev/ttyUSB0")


class GpConnectionState:
    def __init__(self) -> None:
        self.is_connected = False


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


# def emit_eel_state():
#     state_dict = state.to_dict()
#     socketio.emit("ALL_POSITIONS", {"positions": state_dict["positions"]})
#     socketio.emit("IMU_UPDATE", {"imu": state_dict["imu"]})
#     socketio.emit("NAV_UPDATE", {"nav": state_dict["nav"]})


@socketio.on("connect")
def on_connection():
    print("Websocket client connected.")
    emit("GP_CONNECTION_STATUS", {"isConnected": gp_connection_state.is_connected})
    # emit_eel_state()


@socketio.on("disconnect")
def on_disconnect():
    print("Websocket client disconnected")


def handle_receive_line(line):
    msg_dict = None
    try:
        msg_dict = json.loads(line)
    except Exception as err:
        print("Line was not a json. Ignoring. Line:", line, err)

    if msg_dict:
        for topic, msg in msg_dict.items():
            socketio.emit(topic, msg)


@socketio.on("CLEAR_POSITIONS")
def handle_clear_positions():
    pass
    # state.positions = []
    # emit_eel_state()


@socketio.on("SIMPLIFY")
def handle_simplify():
    pass
    # simplified = simplify_route(state.positions)
    # state.positions = simplified
    # emit_eel_state()


@socketio.on("SEND")
def handle_send(data):
    reader_writer.send(json.dumps(data))


def right_handler(value_right):
    msg = {"data": value_right}
    reader_writer.send({"rudder/cmd": msg})


def forward_handler(value_forward):
    msg = {"data": value_forward}
    reader_writer.send({"motor/cmd": msg})


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
