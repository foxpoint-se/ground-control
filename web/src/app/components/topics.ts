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

export type Assignment = {
  coordinate: Coordinate;
  target_depth: number;
  sync_after: boolean;
};

export const NAV_STATUS = "nav/status";
export interface NavStatus {
  meters_to_target: number;
  waypoints_left: Coordinate[];
  auto_mode_enabled: boolean;
  mission_total_meters: number;
  count_goals_left: number;
}

export const NAV_MISSION_CMD = "nav/load_mission";
export const NavigationMissionEelInterface =
  "eel_interfaces/msg/NavigationMission";
export type NavigationMission = {
  assignments: Assignment[];
};

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
export const DEPTH_CONTROL_CMD = "depth_control/cmd";
export interface DepthControlCmd {
  depth_target: number;
  pitch_target: number;
  depth_pid_type: string;
  pitch_pid_type: string;
}
export const FRONT_TANK_CMD = "tank_front/cmd";
export const REAR_TANK_CMD = "tank_rear/cmd";
export const FRONT_TANK_STATUS = "tank_front/status";
export const REAR_TANK_STATUS = "tank_rear/status";
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
export const PRESSURE_STATUS = "pressure/status";
export interface PressureStatus {
  depth: number;
  depth_velocity: number;
}

export type DepthControlStatus = {
  is_adjusting_depth: boolean;
  is_adjusting_pitch: boolean;
  depth_target: number;
};

export type SubmergedCoordinate = {
  depth: number;
  coordinate: Coordinate;
};

export type TracedRoute = {
  path: SubmergedCoordinate[];
  started_at: string;
  ended_at: string;
  duration_seconds: string;
  xy_distance_covered_meters: number;
  average_depth_meters: number;
};
export const ROUTE_TRACING_UPDATES = "route_tracing/updates";
export const TracedRouteEelInterface = "eel_interfaces/msg/TracedRoute";

// Leakage
export const LEAKAGE_STATUS = "leakage/status";
export type LeakageStatus = BoolMsg;
