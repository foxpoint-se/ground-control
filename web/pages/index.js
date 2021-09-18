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

const CustomCommandForm = styled.form`
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

const KeyButton = ({ targetKey, label, onPress }) => {
  const keyPressed = useKeyPress(targetKey)

  useEffect(() => {
    if (keyPressed) {
      onPress()
    }
  }, [keyPressed])

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
  }

  const markers = []
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
              <CustomCommandForm onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={currentCommand}
                  onChange={(e) => {
                    setCurrentCommand(e.target.value)
                  }}
                  placeholder="Custom command"
                />
                <PrimaryButton onClick={handleSubmit}>Go!</PrimaryButton>
              </CustomCommandForm>
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
        <Map polylines={polylines} markers={markers} />
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
