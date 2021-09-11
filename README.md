## Getting started

Setup virtual environment:

```
py -m venv env
```

Activate it (assuming Git bash if you're on Windows):

```
source ./env/Scripts/activate
```

Verify that a local `python.exe` is listed with:

```
where python
```

(Run `deactivate` if you would like to leave the virtual environment.)

Install packages:

```
py -m pip install -r requirements.txt
```

Verify that it works:

```
python reader.py
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

## Ides

- https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm
- https://stackoverflow.com/a/1134731
- least squares fit
