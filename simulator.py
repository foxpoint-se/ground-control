import threading
import time
import json
import math

lines = []
locs = [
    {'lat': 59.309455, 'lon': 17.978697},
    {'lat': 59.309658, 'lon': 17.979083},
    {'lat': 59.309910, 'lon': 17.979448},
    {'lat': 59.310315, 'lon': 17.979319},
    {'lat': 59.310627, 'lon': 17.978836},
    {'lat': 59.310726, 'lon': 17.978278},
    {'lat': 59.310704, 'lon': 17.977431},
    {'lat': 59.310682, 'lon': 17.976808},
    {'lat': 59.310583, 'lon': 17.976133},
    {'lat': 59.310518, 'lon': 17.975521},
    {'lat': 59.310359, 'lon': 17.975178},
    {'lat': 59.310238, 'lon': 17.974759},
    {'lat': 59.310036, 'lon': 17.974491},
    {'lat': 59.309751, 'lon': 17.974298},
    {'lat': 59.309450, 'lon': 17.974148},
    {'lat': 59.309132, 'lon': 17.974212},
    {'lat': 59.308908, 'lon': 17.974577},
    {'lat': 59.308924, 'lon': 17.975382},
    {'lat': 59.309138, 'lon': 17.976133},
    {'lat': 59.309329, 'lon': 17.976530},
    {'lat': 59.309532, 'lon': 17.977109},
]


def to_degrees(angle):
    return angle * (180 / math.pi)


def to_radians(angle):
    return angle * (math.pi / 180)


def get_heading(lat1, lon1, lat2, lon2):
    y = math.sin(to_radians(lon2 - lon1)) * math.cos(to_radians(lat2))
    x = math.cos(to_radians(lat1)) * math.sin(to_radians(lat2)) - math.sin(
        to_radians(lat1)) * math.cos(to_radians(lat2)) * math.cos(to_radians(lon2 - lon1))
    bearing = math.atan2(y, x)
    return to_degrees(bearing)


curr_index = 0


def get_pos():
    global curr_index
    index = curr_index
    next_index = (index + 1) % len(locs)
    pos = locs[index]

    if 'heading' not in pos:
        next_pos = locs[next_index]
        heading = get_heading(pos["lat"], pos["lon"],
                              next_pos["lat"], next_pos["lon"])
        pos["heading"] = heading

    curr_index = next_index
    return pos


def get_pos_json():
    return json.dumps(get_pos())


KEEP_POSITION_HISTORY = False

st_key = "ST,"
lat_key = "LA,"
lon_key = "LT,"
heading_key = "HE,"


class Serial:
    def __init__(self, port='COM1', baudrate=19200, timeout=1,
                 bytesize=8, parity='N', stopbits=1, xonxoff=0,
                 rtscts=0):
        self.name = port
        self.port = port
        self.timeout = timeout
        self.parity = parity
        self.baudrate = baudrate
        self.bytesize = bytesize
        self.stopbits = stopbits
        self.xonxoff = xonxoff
        self.rtscts = rtscts
        self._isOpen = True
        self._receivedData = ""
        self._data = "It was the best of times.\nIt was the worst of times.\n"
        self.line = None
        self.is_motor_on = True
        self._thread = threading.Thread(
            target=self.thread_function, daemon=True)
        self._thread.start()

    def thread_function2(self):
        while True:
            if self.is_motor_on:
                if not KEEP_POSITION_HISTORY:
                    lines = []
                pos = get_pos_json()
                b_pos = bytes("position: {}".format(pos), encoding='utf-8')
                lines.append(b_pos)
            time.sleep(2)

    def thread_function(self):
        while True:
            if self.is_motor_on:
                global lines
                if not KEEP_POSITION_HISTORY and len(lines) > 3:
                    lines = []

                pos = get_pos()
                lines.append(
                    bytes('{}{}'.format(lat_key, pos['lat']), encoding='utf-8'))
                lines.append(
                    bytes('{}{}'.format(lon_key, pos['lon']), encoding='utf-8'))
                lines.append(
                    bytes('{}{}'.format(heading_key, pos['heading']), encoding='utf-8'))

            time.sleep(2)

    # isOpen()
    # returns True if the port to the Arduino is open. False otherwise
    def isOpen(self):
        return self._isOpen

    # open()
    # opens the port
    def open(self):
        self._isOpen = True

    # close()
    # closes the port
    def close(self):
        self._isOpen = False

    # write()
    # writes a string of characters to the Arduino
    def write(self, string):
        string = string.decode('utf-8')
        print('Simulator got: "' + string + '"')
        if string == 'S':
            print('STOP MOTOR')
            self.is_motor_on = False
        elif string == 'G':
            print('START MOTOR')
            self.is_motor_on = True
        elif string == 'L':
            print('TURN LEFT')
        elif string == 'R':
            print('TURN RIGHT')

    # read()
    # reads n characters from the fake Arduino. Actually n characters
    # are read from the string _data and returned to the caller.
    def read(self, n=1):
        s = self._data[0:n]
        self._data = self._data[n:]
        #print( "read: now self._data = ", self._data )
        return s

    # readline()
    # reads characters from the fake Arduino until a \n is found.
    def readline(self):
        if len(lines) > 0:
            line = lines.pop(0)
            return line

        # returnIndex = self._data.index("\n")
        # if returnIndex != -1:
        #     s = self._data[0:returnIndex+1]
        #     self._data = self._data[returnIndex+1:]
        #     return s
        # else:
        #     return ""

    # __str__()
    # returns a string representation of the serial class
    def __str__(self):
        return "Serial<id=0xa81c10, open=%s>( port='%s', baudrate=%d," \
               % (str(self.isOpen), self.port, self.baudrate) \
            + " bytesize=%d, parity='%s', stopbits=%d, xonxoff=%d, rtscts=%d)"\
               % (self.bytesize, self.parity, self.stopbits, self.xonxoff,
                   self.rtscts)


# testSerialSimulator.py
# D. Thiebaut
# This program energizes the fakeSerial simulator using example code taken
# from http://pyserial.sourceforge.net/shortintro.html
#

# import the simulator module (it should be in the same directory as this program)
# import fakeSerial as serial

# Example 1  from http://pyserial.sourceforge.net/shortintro.html
def Example1():
    ser = serial.Serial(0)  # open first serial port
    print(ser.name)       # check which port was really used
    ser.write("hello")      # write a string
    ser.close()             # close port

# Example 2  from http://pyserial.sourceforge.net/shortintro.html


def Example2():
    ser = serial.Serial('/dev/ttyS1', 19200, timeout=1)
    x = ser.read()          # read one byte
    print("x = ", x)
    s = ser.read(10)        # read up to ten bytes (timeout)
    print("s = ", s)
    line = ser.readline()   # read a '\n' terminated line
    ser.close()
    print("line = ", line)

# Example 3  from http://pyserial.sourceforge.net/shortintro.html


def Example3():
    ser = serial.Serial()
    ser.baudrate = 19200
    ser.port = 0
    print(ser)

    ser.open()
    print(str(ser.isOpen()))

    ser.close()
    print(ser.isOpen())


# Example1()
# Example2()
# Example3()
