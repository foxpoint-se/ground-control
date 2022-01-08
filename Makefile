SHELL = /bin/bash

source_me:
	source source_me.sh

install-py: source_me
	python -m pip install -r requirements.txt

run-server-sim: source_me
	GC_SERIAL_PORT="/tmp/virtual_serial_connect" flask run

run-server: source_me
	flask run

list-serial-ports: source_me
	python ./utils/list_serial_ports.py

run-web:
	cd web && npm run dev
