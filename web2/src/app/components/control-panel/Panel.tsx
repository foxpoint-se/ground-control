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
} from "../types";
import { SubscriberContext } from "../SubscriberProvider";
import { BatteryIndicator } from "../BatteryIndicator";
import { Controls } from "../Controls";
import { DataSheet } from "../DataSheet";
import { Compass } from "../Compass";
import { VerticalData } from "../VerticalData";

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
};

export const Panel = () => {
  const [imuStatus, setImuStatus] = useState<ImuStatus>();
  const [gnssStatus, setGnssStatus] = useState<GnssStatus>();
  const [navStatus, setNavStatus] = useState<NavStatus>();
  const [frontTankStatus, setFrontTankStatus] = useState<TankStatus>();
  const [rearTankStatus, setRearTankStatus] = useState<TankStatus>();
  const [pressureStatus, setPressureStatus] = useState<PressureStatus>();
  const [batteryStatus, setBatteryStatus] = useState<BatteryStatus>();

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

  const sendRudderCommand = (rudderValue: number) => {
    const nextValue = Math.abs(rudderValue) > 0.1 ? rudderValue : 0.0;
    send && send("rudder/cmd", "std_msgs/msg/Float32", { data: nextValue });
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
    <div>
      <div>
        <BatteryIndicator level={batteryStatus?.voltage_percent || 0} />
      </div>
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
                sendRudderCommand(-1.0);
              }}
              onArrowRight={() => {
                sendRudderCommand(1.0);
              }}
              onCenterClick={() => {
                sendRudderCommand(0.0);
              }}
              onAutoClick={() => {
                sendNavCommand(true);
              }}
              onManualClick={() => {
                sendNavCommand(false);
              }}
              sendMotorCommand={sendMotorCommand}
              sendRudderCommand={sendRudderCommand}
            />
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
          />
        </div>
        {/* <div>
          <PidDebug onSubmit={sendPidDepthCommand} pitchOrDepth="depth" />
          <PidDebug onSubmit={sendPidPitchCommand} pitchOrDepth="pitch" />
          <DepthAndPitchControls onSubmit={sendDepthControlCommand} />
          <TankControls
            onChangeFront={(v) => sendFrontTankCommand(v)}
            onChangeRear={(v) => {
              sendRearTankCommand(v);
            }}
          />
        </div> */}
      </div>
      {/* <ClickableMap
        vehicle={
          gnssStatus?.lat &&
          gnssStatus?.lon && {
            coordinate: { lat: gnssStatus.lat, lon: gnssStatus.lon },
            heading: imuStatus?.heading || 0,
          }
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
      /> */}
    </div>
  );
};
