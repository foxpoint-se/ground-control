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


## Gamepad

Think this is already installed??

```
sudo apt install python-dev
```


```
source env/bin/activate

python env/lib/python3.8/site-packages/evdev/evtest.py
```

Or:

```
python gp.py
```

### How to use `gp.py`

1. Setup python environment (only if you haven't already):
    ```
    python -m venv env
    ```
1. Activate python environment:
    ```
    source env/bin/activate
    ```
1. Install packages (only if you haven't already):
    ```
    python -m pip install -r requirements.txt
    ```
1. Start gamepad and connect over bluetooth.
1. Check that everything works:
    ```
    python gp.py
    ```
    You should see a lot of prints in the console.
1. Use it in your code:
    ```python
    from gp import GP, ButtonValues, ButtonCodes

    
    def B_handler(value):
        if value == ButtonValues.Press or value == ButtonValues.Hold:
            print('B press or hold')
        elif value == ButtonValues.Release:
            print('B release')

    def my_event_handler(event):
        if event.button_code == ButtonCodes.B:
            B_handler(event.value)
        else:
            print('some other button action')

    my_gamepad = GP(event_handler=my_event_handler)
    ```
