import { useContext, useEffect, useState } from "react";
import {
  BatteryStatus,
  DepthControlCmd,
  GnssStatus,
  ImuStatus,
  NavStatus,
  PidDepthMsg,
  PidPitchMsg,
  PressureStatus,
  TankStatus,
  RudderStatus,
  DepthControlStatus,
} from "../types";
import { SubscriberContext } from "../SubscriberProvider";
import { BatteryIndicator } from "../BatteryIndicator";
import { Controls } from "../Controls";
import { DataSheet } from "../DataSheet";
import { Compass } from "../Compass";
import { VerticalData } from "../VerticalData";
import { DepthAndPitchControls } from "../DepthAndPitchControls";
import { TankControls } from "../TankControls";
import { ClickableMap } from "../ClickableMap";
import { RudderStatusIndicator } from "../RudderStatus";

const tankCmdMsgType = "std_msgs/msg/Float32";
const tankStatusMsgType = "eel_interfaces/TankStatus";

const TOPICS = {
  frontTankCmd: {
    name: "tank_front/cmd",
    msgType: tankCmdMsgType,
  },
  frontTankStatus: {
    name: "tank_front/status",
    msgType: tankStatusMsgType,
  },
  rearTankCmd: {
    name: "tank_rear/cmd",
    msgType: tankCmdMsgType,
  },
  rearTankStatus: {
    name: "tank_rear/status",
    msgType: tankStatusMsgType,
  },
  pressureStatus: {
    name: "pressure/status",
    msgType: "eel_interfaces/PressureStatus",
  },
  batteryStatus: {
    name: "battery/status",
    msgType: "eel_interfaces/BatteryStatus",
  },
  horizontalCmd: {
    name: "rudder_horizontal/cmd",
    msgType: "std_msgs/msg/Float32",
  },
  verticalCmd: {
    name: "rudder_vertical/cmd",
    msgType: "std_msgs/msg/Float32",
  },
  rudderStatus: {
    name: "rudder/status",
    msgType: "geometry_msgs/msg/Vector3",
  },
  depthControlStatus: {
    name: "depth_control/status",
    msgType: "eel_interfaces/DepthControlStatus",
  },
};

export const Panel = () => {
  const [imuStatus, setImuStatus] = useState<ImuStatus>();
  const [gnssStatus, setGnssStatus] = useState<GnssStatus>();
  const [navStatus, setNavStatus] = useState<NavStatus>();
  const [frontTankStatus, setFrontTankStatus] = useState<TankStatus>();
  const [rearTankStatus, setRearTankStatus] = useState<TankStatus>();
  const [pressureStatus, setPressureStatus] = useState<PressureStatus>();
  const [batteryStatus, setBatteryStatus] = useState<BatteryStatus>();
  const [rudderStatus, setRudderStatus] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [depthControlStatus, setDepthControlStatus] =
    useState<DepthControlStatus>();

  const { subscribe, send } = useContext(SubscriberContext);
  useEffect(() => {
    if (subscribe) {
      subscribe("imu/status", "eel_interfaces/ImuStatus", (msg: ImuStatus) => {
        setImuStatus(msg);
      });
      subscribe(
        "gnss/status",
        "eel_interfaces/GnssStatus",
        (msg: GnssStatus) => {
          setGnssStatus(msg);
        }
      );
      subscribe(
        "nav/status",
        "eel_interfaces/NavigationStatus",
        (msg: NavStatus) => {
          setNavStatus(msg);
        }
      );
      subscribe(
        TOPICS.frontTankStatus.name,
        TOPICS.frontTankStatus.msgType,
        (msg: TankStatus) => {
          setFrontTankStatus(msg);
        }
      );
      subscribe(
        TOPICS.rearTankStatus.name,
        TOPICS.rearTankStatus.msgType,
        (msg: TankStatus) => {
          setRearTankStatus(msg);
        }
      );
      subscribe(
        TOPICS.pressureStatus.name,
        TOPICS.pressureStatus.msgType,
        (msg: PressureStatus) => {
          setPressureStatus(msg);
        }
      );
      subscribe(
        TOPICS.batteryStatus.name,
        TOPICS.batteryStatus.msgType,
        (msg: BatteryStatus) => {
          setBatteryStatus(msg);
        }
      );
      subscribe(
        TOPICS.rudderStatus.name,
        TOPICS.rudderStatus.msgType,
        (msg: RudderStatus) => setRudderStatus({ x: msg.x, y: msg.y })
      );
      subscribe(
        TOPICS.depthControlStatus.name,
        TOPICS.depthControlStatus.msgType,
        (msg: DepthControlStatus) => setDepthControlStatus(msg)
      );
    }
  }, [subscribe, send]);

  const targetMarkers = [];
  if (navStatus) {
    targetMarkers.push({
      tolerance: navStatus.tolerance_in_meters,
    });
  }

  const sendMotorCommand = (motorValue: number) => {
    const nextValue = Math.abs(motorValue) > 0.1 ? motorValue : 0.0;
    send && send("motor/cmd", "std_msgs/msg/Float32", { data: nextValue });
  };

  const sendHorizontalRudderCommand = (horizontalValue: number) => {
    const nextHorizontal =
      Math.abs(horizontalValue) > 0.1 ? horizontalValue : 0.0;
    send &&
      send(TOPICS.horizontalCmd.name, TOPICS.horizontalCmd.msgType, {
        data: nextHorizontal,
      });
  };

  const sendVerticalRudderCommand = (nextValue: number) => {
    // const nextVertical = Math.abs(nextValue) > 0.1 ? nextValue : 0.0;
    // send &&
    //   send(TOPICS.verticalCmd.name, TOPICS.verticalCmd.msgType, {
    //     data: nextVertical,
    //   });
  };

  const updateDepthTarget = (val: number) => {
    // NOTE: we don't need to update the state here, but without using the setter, we won't have the most recent state
    setDepthControlStatus((prev) => {
      const prevTarget = prev?.depth_target || 0;
      if (Math.abs(val) > 0) {
        const increment = val === -1 ? -0.1 : 0.1;
        const newVal = prevTarget + increment;
        sendDepthControlCommand({
          depth_target: newVal,
          depth_pid_type: "",
          pitch_pid_type: "",
          pitch_target: 0.0,
        });
      }
      return prev;
    });
  };

  const sendNavCommand = (automaticValue: boolean) => {
    send && send("nav/cmd", "std_msgs/msg/Bool", { data: automaticValue });
  };

  const sendFrontTankCommand = (level: number) => {
    send &&
      send(TOPICS.frontTankCmd.name, TOPICS.frontTankCmd.msgType, {
        data: level,
      });
  };

  const sendRearTankCommand = (level: number) => {
    send &&
      send(TOPICS.rearTankCmd.name, TOPICS.rearTankCmd.msgType, {
        data: level,
      });
  };

  const sendDepthControlCommand = (cmd: DepthControlCmd) => {
    send && send("depth_control/cmd", "eel_interfaces/DepthControlCmd", cmd);
  };

  const sendPidDepthCommand = (cmd: PidDepthMsg) => {
    send && send("pid_depth/cmd", "eel_interfaces/PidDepthCmd", cmd);
  };

  const sendPidPitchCommand = (cmd: PidPitchMsg) => {
    send && send("pid_pitch/cmd", "eel_interfaces/PidPitchCmd", cmd);
  };

  return (
    <div className="flex flex-col grow">
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex" }}>
          <div style={{ marginRight: 20 }}>
            <Controls
              onArrowUp={() => {
                sendMotorCommand(1.0);
              }}
              onArrowDown={() => {
                sendMotorCommand(0.0);
              }}
              onArrowLeft={() => {
                sendHorizontalRudderCommand(-1.0);
              }}
              onArrowRight={() => {
                sendHorizontalRudderCommand(1.0);
              }}
              onCenterClick={() => {
                sendHorizontalRudderCommand(0.0);
              }}
              onAutoClick={() => {
                sendNavCommand(true);
              }}
              onManualClick={() => {
                sendNavCommand(false);
              }}
              sendMotorCommand={sendMotorCommand}
              sendHorizontalRudderCommand={sendHorizontalRudderCommand}
              sendVerticalRudderCommand={sendVerticalRudderCommand}
              updateDepthTarget={updateDepthTarget}
            />
            <div className="mt-4">
              <BatteryIndicator level={batteryStatus?.voltage_percent || 0} />
            </div>
            <div className="mt-12">
              <RudderStatusIndicator vector={rudderStatus} />
            </div>
          </div>
          <div style={{ marginRight: 20 }}>
            <div style={{ marginBottom: 20 }}>
              <DataSheet
                autoMode={navStatus?.auto_mode_enabled}
                countPositions={0}
                distanceToTarget={navStatus?.meters_to_target}
                imuAccelerometerValue={imuStatus?.accel}
                imuGyroValue={imuStatus?.gyro}
                imuIsCalibrated={imuStatus?.is_calibrated}
                imuMagnetometerValue={imuStatus?.mag}
                imuSystemValue={imuStatus?.sys}
                lastUpdateReceived={undefined}
              />
            </div>
            <div>
              <Compass heading={imuStatus?.heading || 0} />
            </div>
          </div>
          <VerticalData
            depth={pressureStatus?.depth}
            depthVelocity={pressureStatus?.depth_velocity}
            pitch={imuStatus?.pitch || 0}
            pitchVelocity={imuStatus?.pitch_velocity || 0}
            frontTank={frontTankStatus?.current_level}
            rearTank={rearTankStatus?.current_level}
            frontTargetLevel={frontTankStatus?.target_level[0]}
            frontTargetStatus={frontTankStatus?.target_status}
            frontIsAutocorrecting={frontTankStatus?.is_autocorrecting}
            rearTargetLevel={rearTankStatus?.target_level[0]}
            rearTargetStatus={rearTankStatus?.target_status}
            rearIsAutocorrecting={rearTankStatus?.is_autocorrecting}
            depthTarget={depthControlStatus?.depth_target}
          />
        </div>
        <div>
          <DepthAndPitchControls onSubmit={sendDepthControlCommand} />
          <TankControls
            onChangeFront={(v) => sendFrontTankCommand(v)}
            onChangeRear={(v) => {
              sendRearTankCommand(v);
            }}
          />
        </div>
      </div>
      <ClickableMap
        vehicle={
          gnssStatus?.lat && gnssStatus?.lon
            ? {
                coordinate: { lat: gnssStatus.lat, lon: gnssStatus.lon },
                heading: imuStatus?.heading || 0,
              }
            : undefined
        }
        targetMarkers={
          navStatus?.next_target[0] && [
            {
              tolerance: navStatus.tolerance_in_meters,
              icon: "pin",
              lat: navStatus.next_target[0].lat,
              lon: navStatus.next_target[0].lon,
            },
          ]
        }
      />
    </div>
  );
};
