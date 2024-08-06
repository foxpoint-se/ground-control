export type FloatMsg = {
  data: number;
};
export type BoolMsg = {
  data: boolean;
};

export type Vector3Msg = {
  x: number;
  y: number;
  z: number;
};

export const MOTOR_CMD_TOPIC = "motor/cmd";
export type MotorCmdMsg = FloatMsg;

// FloatMsg
export const RUDDER_Y_CMD = "rudder/cmd_y";
// FloatMsg
export const RUDDER_X_CMD = "rudder/cmd_x";
export const IMU_STATUS = "imu/status";
export const NAV_CMD = "nav/cmd";

export const LOCALIZATION_STATUS = "localization/status";
export const GNSS_STATUS = "gnss/status";
export interface GnssStatus {
  lat: number;
  lon: number;
}
export const GNSS_STATUS_MSG_TYPE = "eel_interfaces/Coordinate";

export interface ImuStatus {
  is_calibrated: boolean;
  sys: number;
  gyro: number;
  accel: number;
  mag: number;
  heading: number;
  roll: number;
  pitch: number;
  pitch_velocity: number;
}

export interface Coordinate {
  lat: number;
  lon: number;
}

export const NAV_STATUS = "nav/status";
export interface NavStatus {
  meters_to_target: number;
  tolerance_in_meters: number;
  next_target: Coordinate[];
  auto_mode_enabled: boolean;
}

export const BATTERY_STATUS = "battery/status";
export interface BatteryStatusMqtt {
  voltage_percent: number;
}

export interface BatteryStatus extends BatteryStatusMqtt {
  voltage: number;
  current: number;
  power: number;
  supply_voltage: number;
  shunt_voltage: number;
}

export interface DepthControlCmd {
  depth_target: number;
  pitch_target: number;
  depth_pid_type: string;
  pitch_pid_type: string;
}

export interface TankStatus {
  current_level: number;
  target_level: number[];
  target_status:
    | "target_reached"
    | "ceiling_reached"
    | "floor_reached"
    | "no_target"
    | "adjusting";
  is_autocorrecting: boolean;
}

export interface PressureStatus {
  depth: number;
  depth_velocity: number;
}

export type DepthControlStatus = {
  is_adjusting_depth: boolean;
  is_adjusting_pitch: boolean;
  depth_target: number;
};

export type HistoryEvent = {
  recorded_at: number;
  depth: number;
  pitch: number;
  heading: number;
  coordinate: Coordinate;
};

export type EventList = {
  history_events: HistoryEvent[];
};

// Leakage
export const LEAKAGE_STATUS = "leakage/status";
export type LeakageStatus = boolean;
