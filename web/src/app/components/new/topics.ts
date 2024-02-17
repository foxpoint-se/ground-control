export type FloatMsg = {
  data: number;
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
