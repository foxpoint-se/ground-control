import Head from 'next/head'
import { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { Map } from '../components/Map'
import { SocketContextProvider, SocketContext } from '../components/socket'
import { useKeyPress } from '../components/useKeyPress'
import {
  getMovingAveragePosition,
  getMovingAveragePositions,
} from '../utils/getMovingAveragePosition'

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
`

const ToggleButton = styled(Button)`
  width: 160px;
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
  display: flex;
`

const NotificationWrapper = styled.div`
  position: absolute;
  top: 6px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
`

const Notification = styled.div`
  background-color: #f2fff2;
  border-radius: 4px;
  padding: 4px 24px;
  font-weight: 500;
  border: 2px solid #b5b5b5;
`

const NotificationLabel = styled.span`
  color: #8f8f8f;
`
const Message = styled.span``

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

const DataTable = styled.table`
  border: 2px solid #cecece;
  border-radius: 4px;

  tr:nth-child(2n + 1) {
    background-color: #ededed;
  }

  td {
    padding: 4px 2px;
  }

  td:nth-child(2) {
    min-width: 120px;
    text-align: right;
    font-weight: 500;
  }
`

const RouteList = styled.ul`
  list-style-type: none;
  padding-inline-start: 0;

  li:not(:last-child) {
    margin-bottom: 6px;
  }
`

const RoutePosition = styled.li`
  border-radius: 4px;
  padding: 4px 8px;
  font-weight: 500;
  border: 2px solid #b5b5b5;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const BelowMap = styled.div`
  margin-top: 20px;
  display: flex;
`

const ClickedRoute = styled.div`
  margin-left: 42px;
`
const RouteWrapper = styled.div`
  form {
    margin-top: 0;
  }
`

const RemoveButton = styled(Button)``

const KeyButton = ({ targetKey, label, onPress }) => {
  const keyPressed = useKeyPress(targetKey)

  // useEffect(() => {
  //   if (keyPressed) {
  //     onPress()
  //   }
  // }, [keyPressed])

  return (
    <CommandButton onClick={onPress} pressed={keyPressed}>
      {label}
    </CommandButton>
  )
}

let timeout

const Home = () => {
  const { socket } = useContext(SocketContext)
  const [positions, setPositions] = useState([])
  const [movingAverages, setMovingAverages] = useState([])
  const [currentCommand, setCurrentCommand] = useState('')
  const [showMovingAverage, setShowMovingAverage] = useState(true)
  const [lastMessage, setLastMessage] = useState(null)
  const [latLngInput, setLatLngInput] = useState('')
  const [routePositions, setRoutePositions] = useState([
    // { lat: 59.311068, lon: 17.98679 },
    // { lat: 59.311059, lon: 17.985079 },
    // { lat: 59.311433, lon: 17.985117 },
    // { lat: 59.311311, lon: 17.986748 },
    // { lat: 59.311795, lon: 17.987684 },

    // { lat: 59.31178062124511, lon: 17.98522531969866 },
    // { lat: 59.311706700101055, lon: 17.98623383028826 },
    // { lat: 59.31163551662524, lon: 17.987124323681204 },

    // { lat: 59.311026, lon: 17.986756 },
    // { lat: 59.31104, lon: 17.984958 },
    // { lat: 59.310873, lon: 17.983209 },
    // { lat: 59.31081, lon: 17.981679 },
    // { lat: 59.31079, lon: 17.98088 },
    // { lat: 59.31104, lon: 17.981057 },
    // { lat: 59.311196, lon: 17.98255 },
    // { lat: 59.311324, lon: 17.98417 },
    // { lat: 59.311437, lon: 17.985371 },
    // { lat: 59.3113, lon: 17.986847 },
    // { lat: 59.31176, lon: 17.987668 },

    { lat: 59.309092, lon: 17.978828 },
    { lat: 59.309294, lon: 17.978061 },
    { lat: 59.309569, lon: 17.977337 },
    { lat: 59.30983, lon: 17.976662 },
    { lat: 59.310199, lon: 17.975841 },
    { lat: 59.310559, lon: 17.975032 },
    { lat: 59.310928, lon: 17.974224 },
    { lat: 59.311298, lon: 17.973417 },
    { lat: 59.311674, lon: 17.972976 },
    { lat: 59.312075, lon: 17.972505 },
    { lat: 59.312386, lon: 17.972599 },
    { lat: 59.31269, lon: 17.972685 },
    { lat: 59.312858, lon: 17.973651 },
    { lat: 59.313017, lon: 17.974606 },
    { lat: 59.313135, lon: 17.975546 },
    { lat: 59.313236, lon: 17.976366 },
    { lat: 59.313164, lon: 17.976981 },
    { lat: 59.313094, lon: 17.977546 },
    { lat: 59.31293, lon: 17.977983 },
    { lat: 59.312767, lon: 17.978388 },
    { lat: 59.312429, lon: 17.97877 },
    { lat: 59.312088, lon: 17.979161 },
    { lat: 59.311649, lon: 17.979021 },
    { lat: 59.311245, lon: 17.978882 },
    { lat: 59.31087, lon: 17.978794 },
    { lat: 59.3105, lon: 17.97871 },
    { lat: 59.309999, lon: 17.97882 },
    { lat: 59.309504, lon: 17.978918 },
    { lat: 59.309161, lon: 17.979273 },
    { lat: 59.308595, lon: 17.97985 },
  ])
  const [clickedRoute, setClickedRoute] = useState([])

  useEffect(() => {
    if (socket) {
      socket.on('NEW_POSITION', (data) => {
        setPositions((prevList) => {
          const newList = [...prevList, data.position]
          const movingAveragePosition = getMovingAveragePosition(newList)
          setMovingAverages((prevAvgs) => [...prevAvgs, movingAveragePosition])
          return newList
        })
      })
      socket.on('ALL_POSITIONS', ({ positions }) => {
        setPositions(() => positions)
        const movingAveragePositions = getMovingAveragePositions(positions)
        setMovingAverages(() => movingAveragePositions)
      })

      socket.on('NEW_RESPONSE', ({ response }) => {
        console.log('Tvålen says:', response.message)
        setLastMessage(response.message)
        if (timeout) {
          clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
          setLastMessage(null)
        }, 5000)
      })
    }
  }, [socket])

  const handleSubmit = (e) => {
    e.preventDefault()
    sendCommand(currentCommand)
    setCurrentCommand('')
  }

  const sendCommand = (value) => {
    fetch(`/command?value=${value}`)
    // console.log('not sending', value)
  }

  const handleMapClick = (e) => {
    const clickedPos = { lat: e.latlng.lat, lon: e.latlng.lng }
    setClickedRoute((prevList) => [...prevList, clickedPos])
  }

  const handleAddSubmit = (e) => {
    e.preventDefault()
    if (latLngInput) {
      try {
        const parts = latLngInput.split(',')
        const numbers = parts.map((n) => {
          return parseFloat(n)
        })
        const latLon = { lat: numbers[0], lon: numbers[1] }
        if (typeof latLon.lat === 'number' && typeof latLon.lon === 'number') {
          setRoutePositions((prevList) => [...prevList, latLon])
          setLatLngInput('')
        } else {
          throw new Error()
        }
      } catch (error) {
        console.log(latLngInput, ' är felformaterat. Använd formatet', '59.311068, 17.98679')
      }
    }
  }

  let markers = []
  if (positions.length > 0) {
    markers.push({
      key: 'position',
      rotated: true,
      ...positions[positions.length - 1],
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

  if (routePositions.length > 0) {
    polylines.push({
      color: 'green',
      positions: routePositions,
      key: 'route',
    })

    const routeMarkers = routePositions.map(({ lat, lon }, index) => ({
      key: `${index}${lat}${lon}`,
      lat,
      lon,
    }))

    markers = [...routeMarkers, ...markers]
  }

  const lastPosition = positions.length > 0 && positions[positions.length - 1]

  const lastUpdateAt = lastPosition && new Date(lastPosition.receivedAt).toLocaleTimeString()
  const programState = lastPosition && lastPosition.programState
  const distanceToTarget = lastPosition && lastPosition.distanceToTarget
  const accelerometer = lastPosition && lastPosition.accelerometer
  const gyro = lastPosition && lastPosition.gyro
  const magnetometer = lastPosition && lastPosition.magnetometer
  const system = lastPosition && lastPosition.system

  return (
    <Container>
      <Head>
        <title>Ålen</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {lastMessage && (
        <NotificationWrapper>
          <Notification>
            <NotificationLabel>Tvålen says:</NotificationLabel> <Message>{lastMessage}</Message>
          </Notification>
        </NotificationWrapper>
      )}

      <main>
        <h1>Ålen</h1>
        <Stuff>
          <Control>
            <AAlenControl>
              <Buttons>
                <ButtonCol>
                  <KeyButton
                    label="&#5130;"
                    targetKey="ArrowLeft"
                    onPress={() => sendCommand('L')}
                  />
                </ButtonCol>
                <ButtonCol>
                  <KeyButton label="&#5123;" targetKey="ArrowUp" onPress={() => sendCommand('G')} />
                  <KeyButton
                    label="&#5121;"
                    targetKey="ArrowDown"
                    onPress={() => sendCommand('S')}
                  />
                </ButtonCol>
                <ButtonCol>
                  <KeyButton
                    label="&#5125;"
                    targetKey="ArrowRight"
                    onPress={() => sendCommand('R')}
                  />
                </ButtonCol>
                <MoreCommandButtons>
                  <KeyButton label="Center" targetKey="c" onPress={() => sendCommand('C')} />
                  <KeyButton label="Manual" targetKey="m" onPress={() => sendCommand('M')} />
                  <KeyButton label="Automatic" targetKey="a" onPress={() => sendCommand('A')} />
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
              <SecondaryButton
                onClick={() => {
                  fetch('/start')
                }}
              >
                Start serial read
              </SecondaryButton>
              <SecondaryButton
                onClick={() => {
                  fetch('/stop')
                }}
              >
                Stop serial read
              </SecondaryButton>
              <SecondaryButton
                onClick={() => {
                  if (confirm('Är du säker')) {
                    socket.emit('CLEAR_POSITIONS')
                  }
                }}
              >
                Clear
              </SecondaryButton>
            </DataControl>
            <DataControl>
              <ToggleButton
                onClick={() => {
                  setShowMovingAverage((prev) => !prev)
                }}
              >
                Moving average {showMovingAverage ? '✅' : '❌'}
              </ToggleButton>
            </DataControl>
          </Control>
          <Data>
            <DataTable>
              <tbody>
                <tr>
                  <td>Program state: </td>
                  <td>{programState}</td>
                </tr>
                <tr>
                  <td>Distance to target: </td>
                  <td>{distanceToTarget && `${Math.round(distanceToTarget * 10) / 10} m`}</td>
                </tr>
                <tr>
                  <td>Gyro: </td>
                  <td>{gyro}</td>
                </tr>
                <tr>
                  <td>Magnetometer: </td>
                  <td>{magnetometer}</td>
                </tr>
                <tr>
                  <td>Accelerometer: </td>
                  <td>{accelerometer}</td>
                </tr>
                <tr>
                  <td>System: </td>
                  <td>{system}</td>
                </tr>
                <tr>
                  <td>Last update received: </td>
                  <td>{lastUpdateAt}</td>
                </tr>
              </tbody>
            </DataTable>
          </Data>
        </Stuff>
        <Map polylines={polylines} markers={markers} onClick={handleMapClick} />
        <BelowMap>
          <RouteWrapper>
            <SimpleInputForm onSubmit={handleAddSubmit}>
              <input
                type="text"
                value={latLngInput}
                onChange={(e) => {
                  setLatLngInput(e.target.value)
                }}
                placeholder="59.34664, 17.92644"
              />
              <PrimaryButton onClick={handleAddSubmit}>Add to route</PrimaryButton>
            </SimpleInputForm>
            <RouteList>
              {routePositions.map(({ lat, lon }, index) => (
                <RoutePosition key={`${index}${lat}${lon}`}>
                  <span>
                    {index + 1}. {lat}, {lon}
                  </span>
                  <RemoveButton
                    onClick={() => {
                      setRoutePositions((prevList) => {
                        const newList = [...prevList]
                        newList.splice(index, 1)
                        return newList
                      })
                    }}
                  >
                    &#x2716;
                  </RemoveButton>
                </RoutePosition>
              ))}
            </RouteList>
          </RouteWrapper>
          <ClickedRoute>
            <DataTable>
              <tbody>
                {clickedRoute.length === 0 && (
                  <tr>
                    <td>Click map to create route</td>
                  </tr>
                )}
                {clickedRoute.length > 0 &&
                  clickedRoute.map(({ lat, lon }, index) => (
                    <tr key={`${index}${lat}${lon}`}>
                      <td>
                        {lat}, {lon}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </DataTable>
          </ClickedRoute>
        </BelowMap>
      </main>
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
