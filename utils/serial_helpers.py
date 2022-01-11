import atexit
import traceback
import sys
import serial
import threading
import time
from typing import Any, Callable
from serial.threaded import LineReader, ReaderThread


# class SerialReader(threading.Thread):
#     def __init__(self, on_message: Callable[[], str], serial: str):
#         super(SerialReader, self).__init__()
#         self.daemon = True
#         self.ser = serial
#         self.on_message = on_message
#         self.should_run = True
#         self.start()

#     def run(self):
#         self.readlines()

#     def pause(self):
#         self.should_run = False

#     def resume(self):
#         self.should_run = True

#     def readlines(self):
#         while True:
#             if self.should_run and self.on_message:
#                 try:
#                     pass
#                 except Exception as err:
#                     pass
#                 line = self.ser.readline()
#                 if line:
#                     message = line.decode("utf-8").strip()
#                     self.on_message(message)
#                 # time.sleep(0.01)


# class SerialReaderWriter2:
#     def __init__(
#         self,
#         port: str,
#         baudrate: int = 9600,
#         timeout: int = None,
#         on_message: Callable[[], str] = None,
#     ) -> None:
#         self.serial = serial.Serial(port=port, baudrate=baudrate, timeout=timeout)
#         if on_message:
#             self.reader = SerialReader(on_message, self.serial)

#     def send(self, message) -> str:
#         if message:
#             self.serial.write(bytes("{}\n".format(message), encoding="utf-8"))


class ReaderWrapper(LineReader):
    def __init__(self):
        super(ReaderWrapper, self).__init__()

    TERMINATOR = b"\n"

    def connection_made(self, transport):
        super(ReaderWrapper, self).connection_made(transport)
        sys.stdout.write("Port opened.\n")

    def handle_line(self, data):
        if self.on_message:
            self.on_message(data)
        else:
            sys.stdout.write("Unhandled message: {}\n".format(data))

    def connection_lost(self, exc):
        reason = None
        if exc:
            sys.stdout.write("{}\n".format(exc))
            reason = exc
        sys.stdout.write("Port closed.\n")
        if self.on_disconnected:
            self.on_disconnected(reason)


class SerialReaderWriter:
    def __init__(
        self,
        port: str = "/tmp/virtual_serial_connect",
        baudrate: int = 9600,
        timeout: int = 1,
        on_message: Callable[[str], None] = None,
        on_connected: Callable[[], None] = None,
        on_disconnected: Callable[[Exception], None] = None,
    ) -> None:
        self.ser = serial.serial_for_url(port, baudrate=baudrate, timeout=timeout)
        t = ReaderThread(self.ser, ReaderWrapper)
        t.start()
        transport, protocol = t.connect()
        if on_connected:
            on_connected()
        self.protocol = protocol
        self.protocol.on_message = on_message
        self.protocol.on_connected = on_connected
        self.protocol.on_disconnected = on_disconnected
        atexit.register(t.close)

    def send(self, message):
        if message:
            self.protocol.write_line(message)
