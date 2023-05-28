import { useContext, useEffect, useState } from 'react'
import { DataSheet } from '../components/DataSheet'
import { Compass } from '../components/Compass'
import { ClickableMap } from '../components/ClickableMap'
import { Container, Main } from '../components/styles'
import { SubscriberContext, SubscriberProvider } from '../components/SubscriberProvider'
import {
  BatteryStatus,
  DepthControlCmd,
  GnssStatus,
  ImuStatus,
  NavStatus,
  PidDepthMsg,
  PidPitchMsg,
  PressureStatus,
  TankStatus,
} from '../components/types'
import { Controls } from '../components/Controls'
import { VerticalData } from '../components/VerticalData'
import { TankControls } from '../components/TankControls'
import Head from 'next/head'
import { DepthAndPitchControls } from '../components/DepthAncPitchControls'
import { PidDebug } from '../components/PidDebug'
import { BatteryIndicator } from '../components/BatteryIndicator'
import { RosWsSelect } from '../components/RosWsSelect'

const tankCmdMsgType = 'std_msgs/msg/Float32'
const tankStatusMsgType = 'eel_interfaces/TankStatus'

const TOPICS = {
  frontTankCmd: {
    name: 'tank_front/cmd',
    msgType: tankCmdMsgType,
  },
  frontTankStatus: {
    name: 'tank_front/status',
    msgType: tankStatusMsgType,
  },
  rearTankCmd: {
    name: 'tank_rear/cmd',
    msgType: tankCmdMsgType,
  },
  rearTankStatus: {
    name: 'tank_rear/status',
    msgType: tankStatusMsgType,
  },
  pressureStatus: {
    name: 'pressure/status',
    msgType: 'eel_interfaces/PressureStatus',
  },
  batteryStatus: {
    name: 'battery/status',
    msgType: 'eel_interfaces/BatteryStatus',
  },
}

const Panel = () => {
  const [imuStatus, setImuStatus] = useState<ImuStatus>()
  const [gnssStatus, setGnssStatus] = useState<GnssStatus>()
  const [navStatus, setNavStatus] = useState<NavStatus>()
  const [frontTankStatus, setFrontTankStatus] = useState<TankStatus>()
  const [rearTankStatus, setRearTankStatus] = useState<TankStatus>()
  const [pressureStatus, setPressureStatus] = useState<PressureStatus>()
  const [batteryStatus, setBatteryStatus] = useState<BatteryStatus>()

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
    subscribe(TOPICS.frontTankStatus.name, TOPICS.frontTankStatus.msgType, (msg: TankStatus) => {
      setFrontTankStatus(msg)
    })
    subscribe(TOPICS.rearTankStatus.name, TOPICS.rearTankStatus.msgType, (msg: TankStatus) => {
      setRearTankStatus(msg)
    })
    subscribe(TOPICS.pressureStatus.name, TOPICS.pressureStatus.msgType, (msg: PressureStatus) => {
      setPressureStatus(msg)
    })
    subscribe(TOPICS.batteryStatus.name, TOPICS.batteryStatus.msgType, (msg: BatteryStatus) => {
      setBatteryStatus(msg)
    })
  }, [subscribe, send])

  const targetMarkers = []
  if (navStatus) {
    targetMarkers.push({
      tolerance: navStatus.tolerance_in_meters,
    })
  }

  const sendMotorCommand = (motorValue: number) => {
    const nextValue = Math.abs(motorValue) > 0.1 ? motorValue : 0.0
    send('motor/cmd', 'std_msgs/msg/Float32', { data: nextValue })
  }

  const sendRudderCommand = (rudderValue: number) => {
    const nextValue = Math.abs(rudderValue) > 0.1 ? rudderValue : 0.0
    send('rudder/cmd', 'std_msgs/msg/Float32', { data: nextValue })
  }

  const sendNavCommand = (automaticValue: boolean) => {
    send('nav/cmd', 'std_msgs/msg/Bool', { data: automaticValue })
  }

  const sendFrontTankCommand = (level: number) => {
    send(TOPICS.frontTankCmd.name, TOPICS.frontTankCmd.msgType, { data: level })
  }

  const sendRearTankCommand = (level: number) => {
    send(TOPICS.rearTankCmd.name, TOPICS.rearTankCmd.msgType, { data: level })
  }

  const sendDepthControlCommand = (cmd: DepthControlCmd) => {
    send('depth_control/cmd', 'eel_interfaces/DepthControlCmd', cmd)
  }

  const sendPidDepthCommand = (cmd: PidDepthMsg) => {
    send('pid_depth/cmd', 'eel_interfaces/PidDepthCmd', cmd)
  }

  const sendPidPitchCommand = (cmd: PidPitchMsg) => {
    send('pid_pitch/cmd', 'eel_interfaces/PidPitchCmd', cmd)
  }

  return (
    <Container>
      <Head>
        <title>ROS</title>
      </Head>
      <Main>
        <div>
          <h1>ROS</h1>
          <BatteryIndicator level={batteryStatus?.voltage_percent} />
        </div>
        <div style={{ display: 'flex' }}>
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
                sendMotorCommand={sendMotorCommand}
                sendRudderCommand={sendRudderCommand}
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
                <Compass heading={imuStatus?.heading} />
              </div>
            </div>
            <VerticalData
              depth={pressureStatus?.depth}
              depthVelocity={pressureStatus?.depth_velocity}
              pitch={imuStatus?.pitch || 0}
              pitchVelocity={imuStatus?.pitch_velocity || 0}
              frontTank={frontTankStatus?.current_level}
              rearTank={rearTankStatus?.current_level}
              frontTargetLevel={frontTankStatus?.target_level[0]}
              frontTargetStatus={frontTankStatus?.target_status}
              frontIsAutocorrecting={frontTankStatus?.is_autocorrecting}
              rearTargetLevel={rearTankStatus?.target_level[0]}
              rearTargetStatus={rearTankStatus?.target_status}
              rearIsAutocorrecting={rearTankStatus?.is_autocorrecting}
            />
          </div>
          <div>
            <PidDebug onSubmit={sendPidDepthCommand} pitchOrDepth="depth" />
            <PidDebug onSubmit={sendPidPitchCommand} pitchOrDepth="pitch" />
            <DepthAndPitchControls onSubmit={sendDepthControlCommand} />
            <TankControls
              onChangeFront={(v) => sendFrontTankCommand(v)}
              onChangeRear={(v) => {
                sendRearTankCommand(v)
              }}
            />
          </div>
        </div>
        <ClickableMap
          vehicle={
            gnssStatus?.lat &&
            gnssStatus?.lon && {
              coordinate: { lat: gnssStatus.lat, lon: gnssStatus.lon },
              heading: imuStatus?.heading || 0,
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

const RosPage2 = () => {
  return (
    <SubscriberProvider selectedSource="ros">
      <Panel />
    </SubscriberProvider>
  )
}

// type WsBackend = 'hej' | 'korv'

// const backends: WsBackend[] = ['hej', 'korv']

const RosPage = () => {
  return (
    <Container>
      <Main>
        <RosWsSelect
          backends={['hej', 'korv']}
          onChange={(val) => {
            console.log(val)
          }}
        />
      </Main>
    </Container>
  )
}

export default RosPage
