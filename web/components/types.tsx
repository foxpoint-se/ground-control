export interface Coordinate {
  lat: number
  lon: number
}

export interface ImuStatus {
  is_calibrated: boolean
  sys: number
  gyro: number
  accel: number
  mag: number
  heading: number
  roll: number
  pitch: number
  pitch_velocity: number
}

export interface GnssStatus {
  lat: number
  lon: number
}

export interface NavStatus {
  meters_to_target: number
  tolerance_in_meters: number
  next_target: Coordinate[]
  auto_mode_enabled: boolean
}

export interface TankStatus {
  current_level: number
  target_level: number[]
  target_status: 'target_reached' | 'ceiling_reached' | 'floor_reached' | 'no_target' | 'adjusting'
  is_autocorrecting: boolean
}

export interface BatteryStatus {
  voltage: number
  current: number
  power: number
  supply_voltage: number
  shunt_voltage: number
  voltage_percent: number
}

export interface PressureStatus {
  depth: number
  depth_velocity: number
}

export interface DepthControlCmd {
  depth_target: number
  pitch_target: number
  depth_pid_type: string
  pitch_pid_type: string
}

export type PidDepthMsg = {
  p_value: number
  i_value: number
  d_value: number
  depth_target: number
}

export type PidPitchMsg = {
  p_value: number
  i_value: number
  d_value: number
  pitch_target: number
}
