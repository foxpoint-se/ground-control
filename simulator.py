import threading
import time

lines = []


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
        self._thread = threading.Thread(
            target=self.thread_function, daemon=True)
        self._thread.start()

    def thread_function(self):
        while True:
            lines.append(bytes(b'hej'))
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
        print('Arduino got: "' + string + '"')
        self._receivedData += string

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
