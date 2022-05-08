import Head from 'next/head'
import { useState, useEffect, useContext, SetStateAction } from 'react'
import styled from 'styled-components'
import { SocketContextProvider, SocketContext } from '../components/socket'
import { useKeyPress } from '../components/useKeyPress'
import { DataSheet } from '../components/DataSheet'
import { Compass } from '../components/Compass'
import {
  getMovingAveragePosition,
  getMovingAveragePositions,
} from '../utils/getMovingAveragePosition'
import { ClickableMap } from '../components/ClickableMap'
import { Coordinate } from '../components/ClickableMap/LeafletMap'

const Container = styled.div`
  min-height: 100vh;
  height: 100vh;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
`

const AAlenControl = styled.div``

const DataControl = styled.div`
  button:not(:last-child) {
    margin-right: 4px;
  }
`

const Button = styled.button`
  font-weight: 500;
  padding: 4px 8px;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  border: 1px ​solid #3c3c3c;
  background-color: #f8e9e9;
  min-height: 30px;
  padding-left: 20px;
  padding-right: 20px;
  :hover {
    background-color: #f9f1f1;
  }

  :active {
    background-color: #eadfdf;
  }

  ${({ pressed }) => pressed && 'background-color: #eadfdf;'}
`
const PrimaryButton = styled(Button)`
  background-color: #639563;
  color: white;

  :hover {
    background-color: #75a275;
  }

  :active {
    background-color: #5a855a;
  }

  ${({ pressed }) => pressed && 'background-color: #5a855a;'}
`
const SecondaryButton = styled(Button)`
  background-color: #3f3f91;
  color: white;
  :hover {
    background-color: #5555a0;
  }

  :active {
    background-color: #353575;
  }

  ${({ pressed }) => pressed && 'background-color: #353575;'}
`

const Buttons = styled.div`
  display: flex;
  align-items: center;
`

const ButtonCol = styled.div`
  display: flex;
  flex-direction: column;
`

const CommandButton = styled(Button)`
  padding: 10px 16px;
  margin: 2px;
  min-width: 50px;

  :first-child {
    margin-left: 0;
  }
`

const SimpleInputForm = styled.form`
  margin-top: 20px;

  input[type='text'] {
    width: 300px;
    margin-right: 4px;
  }

  input,
  button {
    font-size: 14px;
    padding: 6px;
  }
`

const MoreCommandButtons = styled.div`
  margin-left: 20px;
`

const Flex = styled.div`
  display: flex;
`

const Stuff = styled.div`
  display: flex;

  margin-bottom: 20px;
`

const Control = styled.div`
  > div {
    :not(:last-child) {
      margin-bottom: 20px;
    }
  }
`
const Data = styled.div`
  margin-left: 42px;
`

const GPStatus = styled.div`
  background-color: ${({ isConnected }) => (isConnected ? '#e8f8fd' : '#ededed')};
  padding: 12px;
  display: inline-block;
  margin-top: 16px;
  border-radius: 4px;
  border: 1px double #dedede;
  color: ${({ isConnected }) => (isConnected ? '#505078' : '#6f6f6f')};
  display: flex;
  align-items: center;
`

const Circle = styled.div`
  border-radius: 50%;
  height: 24px;
  width: 24px;
  border: 1px solid;
  border-color: ${({ isConnected }) => (isConnected ? '#505078' : '#6f6f6f')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-right: 8px;
`

// const LabelSelect = styled.div`
//   label {
//     font-size: 12px;
//     font-weight: 500;
//     display: block;
//     margin-bottom: 4px;
//   }

//   select {
//     padding: 4px;
//   }
// `

// const ClickRouteWrapper = styled.div`
//   display: flex;
//   align-items: flex-end;
//   margin-left: 16px;
// `

// const ClickRouteInfo = styled.div`
//   margin-left: 16px;
//   display: flex;
//   align-items: center;
// `

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

// const Needle = ({ heading }) => {
//   if (typeof heading !== 'number') return null

//   return (
//     <NeedleWrapper rotation={heading}>
//       <NeedleTip />
//       <InvisibleNeedlePart />
//     </NeedleWrapper>
//   )
// }

const InfoIcon = () => <Circle>ℹ</Circle>

const KeyButton = ({ targetKey, label, onPress, keyPressEnabled }) => {
  const keyPressed = useKeyPress(targetKey)

  useEffect(() => {
    if (keyPressEnabled && keyPressed) {
      onPress()
    }
  }, [keyPressEnabled, keyPressed])

  return (
    <CommandButton onClick={onPress} pressed={keyPressEnabled && keyPressed}>
      {label}
    </CommandButton>
  )
}

// float32 meters_to_target
// float32 tolerance_in_meters
// Coordinate[] next_target
// bool auto_mode_enabled
interface NavStatus {
  meters_to_target: number
  tolerance_in_meters: number
  next_target: Coordinate[]
  auto_mode_enabled: boolean
}

// bool is_calibrated
// int8 sys
// int8 gyro
// int8 accel
// int8 mag
// float32 euler_heading
export interface ImuStatus {
  is_calibrated: boolean
  sys: number
  gyro: number
  accel: number
  mag: number
  euler_heading: number
}

interface GnssStatus {
  lat: number
  lon: number
}

const Home = () => {
  const { socket } = useContext(SocketContext)
  const [positions, setPositions] = useState<Coordinate[]>([])
  const [movingAverages, setMovingAverages] = useState([])
  const [currentCommand, setCurrentCommand] = useState('')
  const [showMovingAverage, setShowMovingAverage] = useState(false)
  const [keyPressEnabled, setKeyPressEnabled] = useState(false)
  const [lastUpdateReceived, setLastUpdateReceived] = useState('')
  const [gpIsConnected, setGpIsConnected] = useState(false)
  const [imuStatus, setImuStatus] = useState<ImuStatus>()
  const [navStatus, setNavStatus] = useState<NavStatus>()
  const [gnssStatus, setGnssStatus] = useState<GnssStatus>()

  useEffect(() => {
    if (socket) {
      // socket.on('NEW_POSITION', (data) => {
      //   setPositions((prevList) => {
      //     const newList = [...prevList, data.position]
      //     const movingAveragePosition = getMovingAveragePosition(newList)
      //     setMovingAverages((prevAvgs) => [...prevAvgs, movingAveragePosition])
      //     setLastUpdateReceived(() => new Date().toLocaleTimeString())
      //     return newList
      //   })
      // })
      // socket.on('ALL_POSITIONS', ({ positions }) => {
      //   setPositions(() => positions)
      //   const movingAveragePositions = getMovingAveragePositions(positions)
      //   setMovingAverages(() => movingAveragePositions)
      // })

      // socket.on('IMU_UPDATE', ({ imu }) => {
      //   setImuStatus(imu)
      // })

      // socket.on('NAV_UPDATE', ({ nav }) => {
      //   setNavStatus(nav)
      // })

      socket.on('GP_CONNECTION_STATUS', ({ isConnected }) => {
        setGpIsConnected(() => isConnected)
      })
      // socket.on('imu/status', (msg) => {
      //   // console.log('imu/status', msg)
      // })
      socket.on('nav/status', (msg: NavStatus) => {
        // console.log('imu/status', msg)
        setNavStatus(msg)
      })
      socket.on('imu/status', (msg: ImuStatus) => {
        // console.log('imu/status', msg)
        setImuStatus(msg)
      })
      socket.on('gnss/status', (msg: GnssStatus) => {
        // TODO: Do this for all updates, but in that case add throttling
        // See this: https://dmitripavlutin.com/react-throttle-debounce/
        setLastUpdateReceived(new Date().toLocaleTimeString())
        setGnssStatus(msg)

        // TODO: In the case of real-time ROS updates, throttle this as well.
        // To avoid having huge amount of positions for polylines.
        // Could also do something smart with having the most recent ones as they are,
        // and when that list reaches length X, it could be simplified.
        setPositions((prevList) => {
          const newList = [...prevList, msg]
          const movingAveragePosition = getMovingAveragePosition(newList)
          setMovingAverages((prevAvgs) => [...prevAvgs, movingAveragePosition])
          return newList
        })
      })
    }
  }, [socket])

  const handleSubmit = (e) => {
    e.preventDefault()
    sendCommand(currentCommand)
    setCurrentCommand('')
  }

  const sendCommand = (value) => {
    socket.emit('COMMAND', { command: value })
  }

  return (
    <Container>
      <Head>
        <title>Ålen</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>{JSON.stringify(navStatus)}</div>
      <div>{JSON.stringify(imuStatus)}</div>
      <div>{JSON.stringify(gnssStatus)}</div>
      <Main>
        <h1>Ålen</h1>
        <Stuff>
          <Control>
            <AAlenControl>
              <Buttons>
                <ButtonCol>
                  <KeyButton
                    label="&#5130;"
                    targetKey="ArrowLeft"
                    onPress={() => sendCommand('LEFT')}
                    keyPressEnabled={keyPressEnabled}
                  />
                </ButtonCol>
                <ButtonCol>
                  <KeyButton
                    label="&#5123;"
                    targetKey="ArrowUp"
                    onPress={() => sendCommand('FORWARD')}
                    keyPressEnabled={keyPressEnabled}
                  />
                  <KeyButton
                    label="Center"
                    targetKey="c"
                    onPress={() => sendCommand('CENTER')}
                    keyPressEnabled={keyPressEnabled}
                  />
                  <KeyButton
                    label="&#5121;"
                    targetKey="ArrowDown"
                    onPress={() => sendCommand('STOP')}
                    keyPressEnabled={keyPressEnabled}
                  />
                </ButtonCol>
                <ButtonCol>
                  <KeyButton
                    label="&#5125;"
                    targetKey="ArrowRight"
                    onPress={() => sendCommand('RIGHT')}
                    keyPressEnabled={keyPressEnabled}
                  />
                </ButtonCol>
                <MoreCommandButtons>
                  <Flex>
                    <KeyButton
                      label="Manual"
                      targetKey="m"
                      onPress={() => sendCommand('MANUAL')}
                      keyPressEnabled={keyPressEnabled}
                    />
                    <KeyButton
                      label="Automatic"
                      targetKey="a"
                      onPress={() => sendCommand('AUTO')}
                      keyPressEnabled={keyPressEnabled}
                    />
                  </Flex>
                  <div style={{ marginTop: 8 }}>
                    <Button
                      onClick={() => {
                        setKeyPressEnabled((prev) => !prev)
                      }}
                    >
                      KeyPress commands {keyPressEnabled ? '✅' : '❌'}
                    </Button>
                  </div>
                  <GPStatus isConnected={gpIsConnected}>
                    <InfoIcon />
                    <div>{gpIsConnected ? 'Gamepad is connected' : 'Gamepad is not connected'}</div>
                  </GPStatus>
                </MoreCommandButtons>
              </Buttons>
              <SimpleInputForm onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={currentCommand}
                  onChange={(e) => {
                    setCurrentCommand(e.target.value)
                  }}
                  placeholder="Custom command"
                />
                <PrimaryButton onClick={handleSubmit}>Go!</PrimaryButton>
              </SimpleInputForm>
            </AAlenControl>
            <DataControl>
              <Button
                onClick={() => {
                  setShowMovingAverage((prev) => !prev)
                }}
              >
                Moving average {showMovingAverage ? '✅' : '❌'}
              </Button>
              <SecondaryButton
                onClick={() => {
                  if (confirm('Are you sure you want to clear?')) {
                    socket.emit('CLEAR_POSITIONS')
                  }
                }}
              >
                Clear
              </SecondaryButton>
              <PrimaryButton
                onClick={() => {
                  if (confirm('Are you sure you want to simplify?')) {
                    socket.emit('SIMPLIFY')
                  }
                }}
              >
                Simplify
              </PrimaryButton>
            </DataControl>
          </Control>
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
              <Compass heading={imuStatus?.euler_heading} />
            </CompassWrapper>
          </Data>
        </Stuff>
        <ClickableMap
          vehiclePath={positions}
          movingAverages={showMovingAverage ? movingAverages : []}
          vehicle={
            gnssStatus?.lat &&
            gnssStatus?.lon && {
              coordinate: gnssStatus,
              heading: imuStatus?.euler_heading,
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

const Index = () => {
  return (
    <SocketContextProvider>
      <Home />
    </SocketContextProvider>
  )
}

export default Index
