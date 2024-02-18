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
export const RUDDER_VERTICAL_CMD = "rudder_vertical/cmd";
// FloatMsg
export const RUDDER_HORIZONTAL_CMD = "rudder_horizontal/cmd";

export const GNSS_STATUS = "gnss/status";
export interface GnssStatus {
  lat: number;
  lon: number;
}
export const GNSS_STATUS_MSG_TYPE = "eel_interfaces/GnssStatus";

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
export interface NavStatus {
  meters_to_target: number;
  tolerance_in_meters: number;
  next_target: Coordinate[];
  auto_mode_enabled: boolean;
}

export interface BatteryStatus {
  voltage: number;
  current: number;
  power: number;
  supply_voltage: number;
  shunt_voltage: number;
  voltage_percent: number;
}
