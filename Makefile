install-py:
	python -m pip install -r requirements.txt

run-sim:
	GC_SERIAL_PORT="/tmp/virtual_serial_connect" flask run
