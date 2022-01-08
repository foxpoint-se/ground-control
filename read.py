#!/usr/bin/env python3
import serial
import time

baudrate = 9600
# port_name = 'COM5'
# port_name = '/dev/ttyUSB0'
# port_name = '/dev/pts/11'
port_name = '/tmp/virtual_serial_connect'
# port_name = '/dev/ttyS0'

print('starting to read baudrate', baudrate, 'port name', port_name)

ser = serial.Serial(port_name, baudrate, timeout=1)

time.sleep(2)

# for i in range(50):

while True:
    # decode("utf-8") ???
    line = ser.readline()   # read a byte
    if line:
        string = line.decode().strip()  # convert the byte string to a unicode string
        print(string)
        time.sleep(0.01)
        # num = int(string)  # convert the unicode string to an int
        # print(num)

ser.close()
