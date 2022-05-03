import Head from 'next/head'
import { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { Map } from '../components/Map'
import { SocketContextProvider, SocketContext } from '../components/socket'
import { useKeyPress } from '../components/useKeyPress'
import { DataSheet } from '../components/DataSheet'
import { Compass } from '../components/Compass'
import {
  getMovingAveragePosition,
  getMovingAveragePositions,
} from '../utils/getMovingAveragePosition'
import { routes } from '../utils/routePlans'

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

const LabelSelect = styled.div`
  label {
    font-size: 12px;
    font-weight: 500;
    display: block;
    margin-bottom: 4px;
  }

  select {
    padding: 4px;
  }
`

const ClickRouteWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  margin-left: 16px;
`

const ClickRouteInfo = styled.div`
  margin-left: 16px;
  display: flex;
  align-items: center;
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

const Needle = ({ heading }) => {
  if (typeof heading !== 'number') return null

  return (
    <NeedleWrapper rotation={heading}>
      <NeedleTip />
      <InvisibleNeedlePart />
    </NeedleWrapper>
  )
}

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

const Home = () => {
  const { socket } = useContext(SocketContext)
  const [positions, setPositions] = useState([])
  const [movingAverages, setMovingAverages] = useState([])
  const [currentCommand, setCurrentCommand] = useState('')
  const [showMovingAverage, setShowMovingAverage] = useState(false)
  const [keyPressEnabled, setKeyPressEnabled] = useState(false)
  const [lastUpdateReceived, setLastUpdateReceived] = useState('')
  const [gpIsConnected, setGpIsConnected] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [clickRouteEnabled, setClickRouteEnabled] = useState(false)
  const [clickedRoute, setClickedRoute] = useState([])
  const [imuStatus, setImuStatus] = useState({})
  const [navStatus, setNavStatus] = useState({})

  useEffect(() => {
    if (socket) {
      socket.on('NEW_POSITION', (data) => {
        setPositions((prevList) => {
          const newList = [...prevList, data.position]
          const movingAveragePosition = getMovingAveragePosition(newList)
          setMovingAverages((prevAvgs) => [...prevAvgs, movingAveragePosition])
          setLastUpdateReceived(() => new Date().toLocaleTimeString())
          return newList
        })
      })
      socket.on('ALL_POSITIONS', ({ positions }) => {
        setPositions(() => positions)
        const movingAveragePositions = getMovingAveragePositions(positions)
        setMovingAverages(() => movingAveragePositions)
      })

      socket.on('IMU_UPDATE', ({ imu }) => {
        setImuStatus(imu)
      })

      socket.on('NAV_UPDATE', ({ nav }) => {
        setNavStatus(nav)
      })

      socket.on('GP_CONNECTION_STATUS', ({ isConnected }) => {
        setGpIsConnected(() => isConnected)
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

  const handleMapClick = (e) => {
    if (clickRouteEnabled) {
      const clickedPos = { lat: e.latlng.lat, lon: e.latlng.lng }
      setClickedRoute((prevList) => [...prevList, clickedPos])
    }
  }

  let markers = []
  if (positions.length > 0) {
    const currentPosition = positions[positions.length - 1]
    markers.push({
      key: 'position',
      rotated: true,
      heading: imuStatus.heading,
      ...currentPosition,
    })
  }
  const polylines = [{ positions, key: 'positions' }]

  if (showMovingAverage) {
    polylines.push({
      color: 'red',
      positions: movingAverages,
      key: 'moving averages',
    })

    if (movingAverages.length > 0) {
      markers.push({
        key: 'moving average',
        ...movingAverages[movingAverages.length - 1],
      })
    }
  }

  if (selectedRoute) {
    polylines.push({
      color: 'green',
      positions: selectedRoute.path,
      key: 'selected-route',
    })

    const routeMarkers = selectedRoute.path.map(({ lat, lon }, index) => ({
      key: `${index}${lat}${lon}`,
      lat,
      lon,
    }))

    markers = [...routeMarkers, ...markers]
  }

  if (clickedRoute.length > 0) {
    polylines.push({
      color: '#828282',
      positions: clickedRoute,
      key: 'clicked-route',
    })

    const clickedMarkers = clickedRoute.map(({ lat, lon }, index) => ({
      key: `${index}${lat}${lon}`,
      lat,
      lon,
    }))

    markers = [...clickedMarkers, ...markers]
  }

  return (
    <Container>
      <Head>
        <title>Ålen</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
                    <InfoIcon isConnected={gpIsConnected} />
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
              autoMode={navStatus?.autoMode}
              distanceToTarget={navStatus?.distance}
              imuGyroValue={imuStatus?.gyro}
              imuMagnetometerValue={imuStatus?.magnetometer}
              imuAccelerometerValue={imuStatus?.accelerometer}
              imuSystemValue={imuStatus?.system}
              imuIsCalibrated={imuStatus?.isCalibrated}
              lastUpdateReceived={lastUpdateReceived}
              countPositions={positions.length}
            />
            <CompassWrapper>
              <Compass heading={imuStatus.heading} />
            </CompassWrapper>
          </Data>
        </Stuff>
        <Flex style={{ marginBottom: 12 }}>
          <DataControl>
            <LabelSelect>
              <label htmlFor="route-select">Select route</label>
              <select
                id="route-select"
                value={selectedRoute?.name || ''}
                onChange={(e) => {
                  setSelectedRoute(routes.find((r) => r.name === e.target.value))
                }}
              >
                <option value="">(None)</option>
                {routes.map(({ name, path }) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </LabelSelect>
          </DataControl>
          <ClickRouteWrapper>
            <Button
              onClick={() => {
                setClickRouteEnabled((prev) => !prev)
              }}
            >
              Click route {clickRouteEnabled ? '✅' : '❌'}
            </Button>
            {clickRouteEnabled && (
              <ClickRouteInfo>
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(clickedRoute))
                  }}
                >
                  Copy {clickedRoute.length} positions to clipboard
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    if (confirm('Are you sure?')) {
                      setClickedRoute(() => [])
                    }
                  }}
                >
                  Clear
                </Button>
              </ClickRouteInfo>
            )}
          </ClickRouteWrapper>
        </Flex>
        <Map
          polylines={polylines}
          markers={markers}
          targetMarkers={navStatus?.coordinate?.lat ? [navStatus] : []}
          onClick={handleMapClick}
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
