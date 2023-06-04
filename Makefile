SHELL = /bin/bash

.PHONY: help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help

install-py:		## setup venv and install py dependencies
	( \
		python3 -m venv .venv; \
       	source .venv/bin/activate; \
       	pip install wheel; \
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

fix-serial-permission:		## add user to correct groups
	sudo usermod -a -G tty ${USER}
	sudo usermod -a -G dialout ${USER}
	echo "Remember to logout and login, to make the changes take effect."

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

setup-web:
	cd web && yarn

build-web:
	cd web && yarn build

setup-deploy:
	cd deploy && yarn

setup: setup-web setup-deploy		## install and setup everything for development

cdk-deploy-web:
	cd deploy && yarn cdk deploy GcWebAppStack

deploy-web: setup build-web cdk-deploy-web		## deploy web app

# is this needed? --> `sudo apt install python3-roslaunch`
# maybe not, because of ROS2
install-ros-ws:		## install ROS websocket application
	sudo apt-get install ros-foxy-rosbridge-suite

start-ros-ws:		## start ROS websocket application
	( \
		deactivate; \
		cd ../eel; \
       	source source_me.sh; \
       	deactivate; \
       	ros2 launch rosbridge_server rosbridge_websocket_launch.xml; \
    )