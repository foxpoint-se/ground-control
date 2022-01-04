import threading
import time
import serial
from simulator import Serial


class Reader(threading.Thread):
    def __init__(self, on_readline=lambda l: print('UNHANDLED MESSAGE', l), serial=None):
        super(Reader, self).__init__()
        self.daemon = True
        self.should_run = False
        self.ser = serial
        self.on_readline = on_readline
        self.should_run = False

    def run(self):
        self.readlines()

    def pause(self):
        self.should_run = False

    def resume(self):
        self.should_run = True

    def stop(self):
        self.should_run = False

    def readlines(self):
        while True:
            if self.should_run:
                line = self.ser.readline()
                if line:
                    string = line.decode('utf-8')
                    self.on_readline(string)
                time.sleep(0.01)


class Runner:
    def __init__(self, use_sim=True, baudrate=9600, port_name='/dev/ttyUSB0', on_receive_line=None):
        self.ser = self.create_ser(use_sim, baudrate, port_name)
        self.on_receive_line = on_receive_line
        self.reader = Reader(
            on_readline=on_receive_line, serial=self.ser)
        self.on_receive_line = on_receive_line
        self.reader.start()

    def create_ser(self, use_sim, baudrate, port_name):
        if use_sim:
            return Serial(port_name, baudrate=baudrate, timeout=2)
        else:
            # should perhaps have timeout=0 for non-blocking
            # but do we need a timeout, to be able to get the whole message?
            return serial.Serial(port_name, baudrate)

    def start(self):
        self.reader.resume()

    def stop(self):
        self.reader.pause()

    def send(self, message=None):
        if message:
            self.ser.write(bytes(message, encoding='utf-8'))
