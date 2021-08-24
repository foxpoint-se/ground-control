#!/usr/bin/env python3
import sys
import serial
import time
from simulator import Serial

DEFAULT_BAUDRATE = 115200
DEFAULT_PORT_NAME = 'COM7'
DEFAULT_USE_SIM = True


def list_get(list, index, default=None):
    try:
        return list[index]
    except IndexError:
        return default


if __name__ == "__main__":
    baudrate = int(list_get(sys.argv, 3, DEFAULT_BAUDRATE))
    port_name = str(list_get(sys.argv, 2, DEFAULT_PORT_NAME))
    use_sim = bool(list_get(sys.argv, 1, DEFAULT_USE_SIM))
    print('starting with settings: use_sim: ', use_sim,
          'port_name:', port_name, 'baudrate:',  baudrate)

    if use_sim:
        ser = Serial(port_name, baudrate=baudrate, timeout=2)
    else:
        ser = serial.Serial(port_name, baudrate, timeout=2)

    time.sleep(2)

    while True:
        line = ser.readline()
        if line:
            string = line.decode('utf-8')
            print(string)
