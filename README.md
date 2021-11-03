## Getting started

Setup virtual environment:

```
py -m venv env
```

Activate it (assuming Git bash if you're on Windows):

```
source ./env/Scripts/activate // assuming Git bash on Windows
source ./env/bin/activate // assuming Ubuntu or similar
```

Verify that a local `python.exe` is listed with:

```
where python // windows
which python // ubuntu
```

(Run `deactivate` if you would like to leave the virtual environment.)

Install packages:

```
py -m pip install -r requirements.txt
```

Verify that it works:

```
export FLASK_APP=server
flask run
```

## Getting started web

```
cd web
npm install
npm run dev
```

## Random notes

`py -m venv env`

`./env/Scripts/activate` inte den

`source ./env/Scripts/activate`

`py -m pip install pyserial`

`py -m pip freeze`

`where python`

## Todo

- maybe put websocket server in flask server
- maybe export next app as static and deploy it into flask static files
- maybe use travis to build the damn thing and push it to heroku

## Ideas

- https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm
- https://stackoverflow.com/a/1134731
- least squares fit


## HC12 notes

On computer:

```
tail -f /dev/ttyUSB0
```

Or:
```
python read.py
```



On RPI:

```
python3

import serial

ser = serial.Serial("/dev/ttyS0", 9600, timeout=1)

ser.write(bytes("", encoding="utf-8"))
```

List serial ports:

```
(source env/bin/activate)

python list_serial_ports.py
```
