import Head from 'next/head'
import { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { DataSheet } from '../components/DataSheet'
import { Compass } from '../components/Compass'
import { ClickableMap } from '../components/ClickableMap'
import { Coordinate, GnssStatus, ImuStatus, NavStatus } from '../components/types'
import { SubscriberContext, SubscriberProvider } from '../components/SubscriberProvider'
import { Controls } from '../components/Controls'

const Container = styled.div`
  min-height: 100vh;
  height: 100vh;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
`

const Stuff = styled.div`
  display: flex;

  margin-bottom: 20px;
`

const Data = styled.div`
  margin-left: 42px;
`

const Main = styled.main`
  min-height: 100%;
  display: flex;
  flex-direction: column;
`

const CompassWrapper = styled.div`
  display: flex;
  margin-top: 12px;
  justify-content: flex-end;
`

const RadioPanel = () => {
  const { subscribe, send } = useContext(SubscriberContext)
  const [positions, setPositions] = useState<Coordinate[]>([])
  const [lastUpdateReceived, setLastUpdateReceived] = useState('')
  const [gpIsConnected, setGpIsConnected] = useState(false)
  const [imuStatus, setImuStatus] = useState<ImuStatus>()
  const [navStatus, setNavStatus] = useState<NavStatus>()
  const [gnssStatus, setGnssStatus] = useState<GnssStatus>()

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
      <Head>
        <title>Radio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main>
        <h1>Radio</h1>
        <Stuff>
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

          <Data>
            <DataSheet
              autoMode={navStatus?.auto_mode_enabled}
              distanceToTarget={navStatus?.meters_to_target}
              imuGyroValue={imuStatus?.gyro}
              imuMagnetometerValue={imuStatus?.mag}
              imuAccelerometerValue={imuStatus?.accel}
              imuSystemValue={imuStatus?.sys}
              imuIsCalibrated={imuStatus?.is_calibrated}
              lastUpdateReceived={lastUpdateReceived}
              countPositions={positions.length}
            />
            <CompassWrapper>
              <Compass heading={imuStatus?.heading} />
            </CompassWrapper>
          </Data>
        </Stuff>
        <ClickableMap
          vehiclePath={positions}
          vehicle={
            gnssStatus?.lat &&
            gnssStatus?.lon && {
              coordinate: gnssStatus,
              heading: imuStatus?.heading,
            }
          }
          targetMarkers={
            navStatus?.next_target.length > 0
              ? [
                  {
                    icon: 'pin',
                    lat: navStatus.next_target[0].lat,
                    lon: navStatus.next_target[0].lon,
                    tolerance: navStatus.tolerance_in_meters,
                  },
                ]
              : []
          }
        />
      </Main>
    </Container>
  )
}

const RadioPage = () => {
  return (
    <SubscriberProvider selectedSource="radio">
      <RadioPanel />
    </SubscriberProvider>
  )
}

export default RadioPage
