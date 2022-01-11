SHELL = /bin/bash

install-py:
	python -m pip install -r requirements.txt

run-server-sim:
	GC_SERIAL_PORT="/tmp/virtual_serial_connect" python server.py

run-server:
	flask run

list-serial-ports:
	python ./utils/list_serial_ports.py

list-devices:
	python ./utils/list_devices.py

run-web:
	cd web && npm run dev
