# Ground control

Application for connecting to the Eel over radio.

## Prerequisites

- Assuming Linux, but Mac will probably do as well.
- Python 3
- NodeJS 12 or higher
- NPM

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

### ROS bridge

Go to /ros for a visualization of the ROS state.

Need to run a ROS-bridge websocket server:

```
source /opt/ros/foxy/setup.bash
ros2 launch rosbridge_server rosbridge_websocket_launch.xml
sudo apt-get install ros-foxy-rosbridge-suite
```

This can be run on your computer if the ROS instance is running on the same network.
Do not source virtual environment in this project, since ROS-bridge is using stuff outside that environment.
Not sure if we need to `sudo apt install python3-roslaunch`. The install command above might complain about it.
