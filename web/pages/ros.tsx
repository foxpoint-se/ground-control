import { useContext, useEffect, useState } from 'react'
import { DataSheet } from '../components/DataSheet'
import { Compass } from '../components/Compass'
import { ClickableMap } from '../components/ClickableMap'
import { Container, Main } from '../components/styles'
import { SubscriberContext, SubscriberProvider } from '../components/SubscriberProvider'
import { GnssStatus, ImuStatus, NavStatus } from '../components/types'
import { Controls } from '../components/Controls'
import { VerticalData } from '../components/VerticalData'

const Panel = () => {
  const [imuStatus, setImuStatus] = useState<ImuStatus>()
  const [gnssStatus, setGnssStatus] = useState<GnssStatus>()
  const [navStatus, setNavStatus] = useState<NavStatus>()

  const { subscribe, send } = useContext(SubscriberContext)
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
  }, [subscribe, send])

  const targetMarkers = []
  if (navStatus) {
    targetMarkers.push({
      tolerance: navStatus.tolerance_in_meters,
    })
  }

  const sendMotorCommand = (motorValue: number) => {
    send('motor/cmd', 'std_msgs/msg/Float32', { data: motorValue })
  }

  const sendRudderCommand = (rudderValue: number) => {
    send('rudder/cmd', 'std_msgs/msg/Float32', { data: rudderValue })
  }

  const sendNavCommand = (automaticValue: boolean) => {
    send('nav/cmd', 'std_msgs/msg/Bool', { data: automaticValue })
  }

  return (
    <Container>
      <Main>
        <div>
          <h1>ROS</h1>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ marginRight: 20 }}>
            <Controls
              onArrowUp={() => {
                sendMotorCommand(1.0)
              }}
              onArrowDown={() => {
                sendMotorCommand(0.0)
              }}
              onArrowLeft={() => {
                sendRudderCommand(-1.0)
              }}
              onArrowRight={() => {
                sendRudderCommand(1.0)
              }}
              onCenterClick={() => {
                sendRudderCommand(0.0)
              }}
              onAutoClick={() => {
                sendNavCommand(true)
              }}
              onManualClick={() => {
                sendNavCommand(false)
              }}
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
                lastUpdateReceived={null}
              />
            </div>
            <div>
              <Compass heading={imuStatus?.euler_heading} />
            </div>
          </div>
          <VerticalData depth={4.156466} pitch={-10.561561} frontTank={0} rearTank={0.98456} />
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