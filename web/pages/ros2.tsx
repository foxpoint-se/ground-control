import { useContext, useEffect, useState } from 'react'
import { DataSheet } from '../components/DataSheet'
import { Compass } from '../components/Compass'
import { ClickableMap } from '../components/ClickableMap'
import { Container, Main } from '../components/styles'
import { SubscriberContext, SubscriberProvider } from '../components/SubscriberProvider'
import { GnssStatus, ImuStatus, NavStatus } from '../components/types'

const Panel = () => {
  const [imuStatus, setImuStatus] = useState<ImuStatus>()
  const [gnssStatus, setGnssStatus] = useState<GnssStatus>()
  const [navStatus, setNavStatus] = useState<NavStatus>()

  const { subscribe } = useContext(SubscriberContext)
  useEffect(() => {
    subscribe('imu/status', 'eel_interfaces/ImuStatus', (msg: ImuStatus) => {
      setImuStatus(msg)
    })
    subscribe('gnss/status', 'eel_interfaces/GnssStatus', (msg: GnssStatus) => {
      setGnssStatus(msg)
    })
    subscribe('nav/status', 'eel_interfaces/NavigationStatus', (msg: NavStatus) => {
      setNavStatus(msg)
    })
  }, [subscribe])

  const targetMarkers = []
  if (navStatus) {
    targetMarkers.push({
      tolerance: navStatus.tolerance_in_meters,
    })
  }

  return (
    <Container>
      <Main>
        <div>
          <h1>Här är internt ROS-state</h1>
          <div>{JSON.stringify(imuStatus)}</div>
          <div>{JSON.stringify(navStatus)}</div>
          <div>{JSON.stringify(gnssStatus)}</div>
          <div>Heading: {imuStatus?.euler_heading}</div>
          <div>Lat: {gnssStatus?.lat}</div>
          <div>Lon: {gnssStatus?.lon}</div>
        </div>
        <div>
          <DataSheet
            autoMode={navStatus?.auto_mode_enabled}
            countPositions={0}
            distanceToTarget={navStatus?.meters_to_target}
            imuAccelerometerValue={imuStatus?.accel}
            imuGyroValue={imuStatus?.gyro}
            imuIsCalibrated={imuStatus?.is_calibrated}
            imuMagnetometerValue={imuStatus?.mag}
            imuSystemValue={imuStatus?.sys}
            lastUpdateReceived={null}
          />
        </div>
        <div>
          <Compass heading={imuStatus?.euler_heading} />
        </div>
        <ClickableMap
          vehicle={
            gnssStatus?.lat &&
            gnssStatus?.lon && {
              coordinate: { lat: gnssStatus.lat, lon: gnssStatus.lon },
              heading: imuStatus?.euler_heading || 0,
            }
          }
          targetMarkers={
            navStatus?.next_target[0] && [
              {
                tolerance: navStatus.tolerance_in_meters,
                icon: 'pin',
                lat: navStatus.next_target[0].lat,
                lon: navStatus.next_target[0].lon,
              },
            ]
          }
        />
      </Main>
    </Container>
  )
}

const RosPage = () => {
  return (
    <SubscriberProvider selectedSource="ros">
      <Panel />
    </SubscriberProvider>
  )
}

export default RosPage
