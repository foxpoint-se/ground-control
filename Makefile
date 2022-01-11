SHELL = /bin/bash

install-py:
	python -m pip install -r requirements.txt

list-serial-ports:
	python ./utils/list_serial_ports.py

list-devices:
	python ./utils/list_devices.py

server-sim:
	FLASK_ENV=production GC_SERIAL_PORT="/tmp/virtual_serial_connect" python server.py

server-sim-dev:
	FLASK_ENV=development GC_SERIAL_PORT="/tmp/virtual_serial_connect" python server.py

server:
	FLASK_ENV=production python server.py

server-dev:
	FLASK_ENV=development python server.py

web-dev:
	cd web && npm run dev
