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

export interface PressureStatus {
  depth: number
}
