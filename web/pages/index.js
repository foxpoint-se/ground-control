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

const AAlenControl = styled.div`
  margin-bottom: 20px;
`

const DataControl = styled.div`
  margin-bottom: 20px;

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

const Home = () => {
  const { socket } = useContext(SocketContext)
  const [positions, setPositions] = useState([])
  const [movingAverages, setMovingAverages] = useState([])
  const [currentCommand, setCurrentCommand] = useState('')
  const [showMovingAverage, setShowMovingAverage] = useState(true)

  useEffect(() => {
    if (socket) {
      socket.on('NEW_POSITION', ({ position }) => {
        setPositions((prevList) => {
          const newList = [...prevList, position]
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

  return (
    <Container>
      <Head>
        <title>Ålen</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Ålen</h1>
        <AAlenControl>
          <Buttons>
            <ButtonCol>
              <KeyButton label="&#5130;" targetKey="ArrowLeft" onPress={() => sendCommand('L')} />
            </ButtonCol>
            <ButtonCol>
              <KeyButton label="&#5123;" targetKey="ArrowUp" onPress={() => sendCommand('G')} />
              <KeyButton label="&#5121;" targetKey="ArrowDown" onPress={() => sendCommand('S')} />
            </ButtonCol>
            <ButtonCol>
              <KeyButton label="&#5125;" targetKey="ArrowRight" onPress={() => sendCommand('R')} />
            </ButtonCol>
            <MoreCommandButtons>
              <KeyButton label="Center" targetKey="c" onPress={() => sendCommand('C')} />
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
