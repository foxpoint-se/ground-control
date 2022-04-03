SHELL = /bin/bash

.PHONY: help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help

install-py:		## setup venv and install py dependencies
	( \
		python3 -m venv .venv; \
       	source .venv/bin/activate; \
       	python -m pip install -r requirements.txt; \
    )

install-js:		## install js dependencies
	cd web && npm install

install: install-py install-js		## install both py and js

# Run to create a virtual serial communication instead of HC12 radio link.
# Send and listen to /tmp/virtual_serial_eel on Eel side, and
# /tmp/virtual_serial_connect on the other (where you run ground-control application)
virtual-serial:		## /tmp/virtual_serial_eel <-> /tmp/virtual_serial_connect
	socat -d -d pty,raw,echo=0,link=/tmp/virtual_serial_eel pty,raw,echo=0,link=/tmp/virtual_serial_connect

list-serial-ports:		## list open serial ports
	python ./utils/list_serial_ports.py

list-devices:		## list connected input devices
	python ./utils/list_devices.py

find-rpi-ip:		## find RPi IP
	python ./utils/find_rpi_ip.py

log-usb:		## live log of usb connections
	dmesg -wH

server-sim:		## start PROD server using virtual serial
	FLASK_ENV=production GC_SERIAL_PORT="/tmp/virtual_serial_connect" python server.py

server-sim-dev:		## start DEV server using virtual serial
	FLASK_ENV=development GC_SERIAL_PORT="/tmp/virtual_serial_connect" python server.py

server:		## start PROD server
	FLASK_ENV=production python server.py

server-dev:		## start DEV server
	FLASK_ENV=development python server.py

web-dev:		## start DEV Next app
	cd web && npm run dev
