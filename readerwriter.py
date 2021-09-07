import threading
import time
import serial
from simulator import Serial

should_read = False


class ReaderWriter:
    def __init__(self):
        self._thread = threading.Thread(
            target=self.thread_function, daemon=True)
        self._thread.start()
        self._should_read = False

    def thread_function(self):
        while True:
            # if self._should_read:
            if should_read:
                print('hej')
                time.sleep(2)

    def start_reading(self):
        self._should_read = True
        should_read = True

    def stop_reading(self):
        self._should_read = False
        should_read = False


exitFlag = 0


class myThread (threading.Thread):
    def __init__(self, threadID, name, counter):
        threading.Thread.__init__(self)
        self.threadID = threadID
        self.name = name
        self.counter = counter
        self.should_count = False

    def run(self):
        print("Starting " + self.name)
        # print_time(self.name, 5, self.counter)
        print_hej(self.name, self.should_count)
        # print("Exiting " + self.name)


def print_time(threadName, counter, delay):
    while counter:
        if exitFlag:
            threadName.exit()
        time.sleep(delay)
        print("%s: %s" % (threadName, time.ctime(time.time())))
        counter -= 1


def print_hej(thread_name, should_count):
    while True:
        if should_count:
            print('hej från', thread_name)


def do_stuff(instance):
    while instance.should_run:
        print("%s: %s" % (instance.name, time.ctime(time.time())))
        time.sleep(2)


class MyThread(threading.Thread):
    def __init__(self, number, on_receive_message):
        super(MyThread, self).__init__()
        self.number = number
        self.daemon = True
        self.should_run = False
        self.on_receive_message = on_receive_message

    def run(self):
        print("Starting ", self.name, self.number)
        self.should_run = True
        self.do_stuff()

    def stop(self):
        print('stop')
        self.should_run = False

    def do_stuff(self):
        while self.should_run:
            # print("%s: %s" % (instance.name, time.ctime(time.time())))
            self.on_receive_message('sablar')
            time.sleep(2)


class Stuff:
    def __init__(self):
        self.reader = MyThread(1, self.handle_receive_message)

    def handle_receive_message(self, message):
        print('KORV:', message)

    def start(self):
        self.reader.start()

    def stop(self):
        self.reader.stop()


def default_on_readline(line):
    print(line)


class Reader(threading.Thread):
    # def __init__(self, on_readline=default_on_readline, use_sim=True, baudrate=9600, port_name='COM5'):
    def __init__(self, on_readline=default_on_readline, serial=None):
        super(Reader, self).__init__()
        self.daemon = True
        self.should_run = False
        self.ser = serial
        # self.ser = self.create_ser(use_sim, baudrate, port_name)
        self.on_readline = on_readline

    # def create_ser(self, use_sim, baudrate, port_name):
    #     if use_sim:
    #         return Serial(port_name, baudrate=baudrate, timeout=2)
    #     else:
    #         return serial.Serial(port_name, baudrate, timeout=2)

    def run(self):
        print("Starting")
        self.should_run = True
        self.readlines()

    def stop(self):
        self.should_run = False

    def readlines(self):
        while self.should_run:
            line = self.ser.readline()
            if line:
                string = line.decode('utf-8')
                self.on_readline(string)
                # print(string)
                # position = find_position(string)
                # if position:
                #     publish_position(position)

        # while self.should_run:
        #     self.on_readline('sablar')
        #     time.sleep(2)


class Runner:
    def __init__(self, use_sim=True, baudrate=9600, port_name='COM5', on_receive_line=lambda l: print('UNHANDLED MESSAGE', l)):
        # self.junk = []
        self.ser = self.create_ser(use_sim, baudrate, port_name)
        self.reader = Reader(
            on_readline=self.handle_receive_message, serial=self.ser)
        self.on_receive_line = on_receive_line
        print('initialized Runner')

    def create_ser(self, use_sim, baudrate, port_name):
        if use_sim:
            return Serial(port_name, baudrate=baudrate, timeout=2)
        else:
            return serial.Serial(port_name, baudrate, timeout=2)

    def handle_receive_message(self, message):
        # print('KORV:', message)
        # self.junk.append(message)
        self.on_receive_line(message)

    def start(self):
        self.reader.start()

    def stop(self):
        self.reader.stop()

    def send(self, message='prutt'):
        self.ser.write(bytes(message, encoding='utf-8'))
