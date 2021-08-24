#!/usr/bin/env python3
import serial
import time

baudrate = 115200
port_name = 'COM7'

print('starting to read baudrate', baudrate, 'port name', port_name)

ser = serial.Serial(port_name, baudrate, timeout=1)

time.sleep(2)

# for i in range(50):

while True:
    # decode("utf-8") ???
    line = ser.readline()   # read a byte
    if line:
        string = line.decode()  # convert the byte string to a unicode string
        print(string)
        # num = int(string)  # convert the unicode string to an int
        # print(num)

ser.close()
