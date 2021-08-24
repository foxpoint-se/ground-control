#!/usr/bin/env python3
import serial


ser = serial.Serial('COM5', 9600, timeout=1)
# ser.open()
ser.write(bytes(b'korv'))
