from abc import abstractmethod
import serial
import time
from typing import Callable
import threading

SLEEP_TIME = 0.01


class SerialReaderWriter:
    def __init__(
        self,
        port: str,
        baudrate: int = 19200,
        timeout: int = 1,
        on_message: Callable[[str], None] = None,
    ):
        self._ser = serial.serial_for_url(port, baudrate=baudrate, timeout=timeout)
        self._on_message = on_message
        self._ser.flush()
        self._ser.reset_input_buffer()
        self._ser.reset_output_buffer()
        self.thread = threading.Thread(target=self._loop, daemon=True)
        self.thread.start()

    def send(self, message):
        self._write_one_message(message)

    # TODO: remove or use? it could be interesting to see if there's ever anything in in_waiting or out_waiting
    # def _flush_if_necessary(self):
    #     in_waiting = self._ser.in_waiting
    #     out_waiting = self._ser.out_waiting
    #     if in_waiting > 0 or out_waiting > 0:
    #         print("in_waiting", in_waiting, "out_waiting", out_waiting)
    #         self._ser.flush()

    def _write_one_message(self, message):
        msg_line = "{}\n".format(message)
        self._ser.write(bytes(msg_line, "utf-8"))
        self._ser.flush()
        # TODO: remove or use?
        # self._flush_if_necessary()

    def _loop(self):
        while True:
            msg = self._ser.readline()
            if msg:
                self._on_message(msg.decode("utf-8").strip())

            self._ser.flush()
            # TODO: remove or use?
            # self._flush_if_necessary()
            time.sleep(SLEEP_TIME)


class AutoConnectingRunner:
    def __init__(
        self,
        # do_work: Callable[[], None] = None,
        # is_connected: Callable[[], bool] = None,
        # try_connect: Callable[[], bool] = None,
        # on_connection_change: Callable[[bool], None] = None,
    ) -> None:
        # self.do_work = do_work
        # self.is_connected = is_connected
        # self.try_connect = try_connect
        # self.on_connection_change = on_connection_change
        self.thread = threading.Thread(target=self._loop, daemon=True)
        self.thread.start()

    @abstractmethod
    def do_work_once(self):
        raise NotImplementedError()

    @abstractmethod
    def is_connected(self):
        raise NotImplementedError()

    @abstractmethod
    def try_connect(self):
        raise NotImplementedError()

    @abstractmethod
    def on_connection_change(self, is_connected):
        raise NotImplementedError()

    def broadcast_connection_status(self):
        self.on_connection_change(self.is_connected())

    def _loop(self):
        self.broadcast_connection_status()
        while True:
            if self.is_connected():
                try:
                    self.do_work_once()
                except Exception as err:
                    self.broadcast_connection_status()
            else:
                if not self.try_connect():
                    time.sleep(2)
                else:
                    self.broadcast_connection_status()


class Serris(AutoConnectingRunner):
    def __init__(
        self,
        port: str,
        baudrate: int = 19200,
        timeout: int = 1,
        on_message: Callable[[str], None] = None,
        **kwargs,
    ) -> None:
        # super(Serris, self).__init__(**kwargs)
        super(Serris, self).__init__()
        self._is_connected = False
        self._ser = None
        self.port = port
        self.baudrate = baudrate
        self.timeout = timeout
        self._on_message = on_message

    def do_work_once(self):
        self.try_get_message()

    def is_connected(self):
        # return self._ser is not None
        return self._is_connected

    def try_connect(self):
        try:
            self._ser = serial.serial_for_url(
                self.port, baudrate=self.baudrate, timeout=self.timeout
            )
            self._ser.flush()
            self._ser.reset_input_buffer()
            self._ser.reset_output_buffer()
            self._is_connected = True
            return True
        except Exception as err:
            self._ser = None
            self._is_connected = False
            return False

    def on_connection_change(self, is_connected):
        print("is connected", is_connected)

    def send(self, message):
        self._write_one_message(message)

    def _write_one_message(self, message):
        msg_line = "{}\n".format(message)
        self._ser.write(bytes(msg_line, "utf-8"))
        self._ser.flush()

    def try_get_message(self):
        msg = self._ser.readline()
        if msg:
            self._on_message(msg.decode("utf-8").strip())

        self._ser.flush()
        time.sleep(SLEEP_TIME)


# serris = Serris("", on_message=None)

# serialis = AutoConnectingRunner(
#     do_work=serris.try_get_message,
#     is_connected=serris.is_connected,
#     try_connect=serris.try_connect,
#     on_connection_change=serris.on_connection_change,
# )


class ConnectingSerialReaderWriter:
    def __init__(
        self,
        port: str,
        baudrate: int = 19200,
        timeout: int = 1,
        on_message: Callable[[str], None] = None,
        on_connection_change: Callable[[bool], None] = None,
    ) -> None:
        self.port = port
        self.baudrate = baudrate
        self.timeout = timeout
        self._ser = None
        self.try_init_serial(port, baudrate=baudrate, timeout=timeout)
        self._on_message = on_message
        self._on_connection_change = on_connection_change

        self.thread = threading.Thread(target=self._loop, daemon=True)
        self.thread.start()

    def try_init_serial(self, port, baudrate, timeout):
        try:
            self._ser = serial.serial_for_url(port, baudrate=baudrate, timeout=timeout)
            self._ser.flush()
            self._ser.reset_input_buffer()
            self._ser.reset_output_buffer()
            return True
        except Exception as err:
            return False

    def send(self, message):
        self._write_one_message(message)

    def _write_one_message(self, message):
        msg_line = "{}\n".format(message)
        self._ser.write(bytes(msg_line, "utf-8"))
        self._ser.flush()

    def broadcast_connection_status(self):
        is_connected = self.is_connected()
        if is_connected:
            print("Serial port", self.port, "is connected")
        else:
            print("Serial", self.port, "is disconnected. Trying to connect repeatedly")
        if self._on_connection_change:
            self._on_connection_change(self.is_connected())

    def is_connected(self):
        return self._ser is not None

    def _loop(self):
        self.broadcast_connection_status()
        while True:
            if self.is_connected():
                try:
                    msg = self._ser.readline()
                    if msg:
                        self._on_message(msg.decode("utf-8").strip())

                    self._ser.flush()
                    time.sleep(SLEEP_TIME)
                except Exception as err:
                    print("KORV", err)
                    self._ser = None
                    self.broadcast_connection_status()

            else:
                if not self.try_init_serial(self.port, self.baudrate, self.timeout):
                    time.sleep(2)
                else:
                    self.broadcast_connection_status()
