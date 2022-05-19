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
  euler_heading: number
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
  data: number
}
