# Ground control

Application for connecting to the Eel over radio.

## Prerequisites

- Assuming Linux, but Mac will probably do as well.
- Python 3
- NodeJS

## Getting started

Get the code and install everything:

```
git clone <this repo>
cd path/to/project
make install
```

Now you can either start everything in dev mode, or in "production" mode. Let's go with dev mode first.

### Start in dev mode

Terminal 1:

```
make virtual-serial
```

Terminal 2:

```
source source_me.sh
make server-sim-dev
```

Terminal 3:

```
make web-dev
```

Visit http://localhost:3000

### Start in "production" mode

(Not really using production servers here, but this will do in the field, since it's only localhost.)

Terminal 1:

```
source source_me.sh
make server
```

Terminal 2:

```
make web-dev
```

Visit http://localhost:3000
