# Ground control

Application for sending and receiving messages to and from the Eel, via `rosbridge_server` websockets.

## Getting started

Get the code and install everything:

```bash
git clone <this repo>
cd path/to/project
make setup
make install-ros-ws
```

In terminal 1, run:

```bash
make start-ros-ws
```

In terminal 2, run:

```bash
make dev
```

Visit http://localhost:3000 to see the application.

And http://localhost:3000/local for a visualization of the ROS state.

## Deploy

```bash
make deploy
```

### Legacy notes (should probably be discarded)

This can be run on your computer if the ROS instance is running on the same network.
Do not source virtual environment in this project, since ROS-bridge is using stuff outside that environment.
Not sure if we need to `sudo apt install python3-roslaunch`. The install command above might complain about it.
