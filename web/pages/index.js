import Head from 'next/head'
import { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { Map } from '../components/Map'
import { SocketContextProvider, SocketContext } from '../components/socket'
import { useKeyPress } from '../components/useKeyPress'

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

const Buttons = styled.div`
  display: flex;
  align-items: center;
`

const ButtonCol = styled.div`
  display: flex;
  flex-direction: column;
`

const CommandButton = styled.button`
  padding: 10px 16px;

  ${({ keyPressed }) => keyPressed && 'background-color: lightgrey;'}
`

const KeyButton = ({ targetKey, label, onPress }) => {
  const keyPressed = useKeyPress(targetKey)

  useEffect(() => {
    if (keyPressed) {
      onPress()
    }
  }, [keyPressed])

  return (
    <CommandButton onClick={onPress} keyPressed={keyPressed}>
      {label}
    </CommandButton>
  )
}

const Home = () => {
  const { socket } = useContext(SocketContext)
  const [positions, setPositions] = useState([])
  const [currentCommand, setCurrentCommand] = useState('')

  useEffect(() => {
    if (socket) {
      socket.on('NEW_POSITION', ({ position }) => {
        setPositions((prevList) => [...prevList, position])
      })
      socket.on('ALL_POSITIONS', ({ positions }) => {
        setPositions(() => positions)
      })
    }
  }, [socket])

  const handleSubmit = () => {
    console.log(currentCommand)
    setCurrentCommand('')
  }

  return (
    <Container>
      <Head>
        <title>Ålen</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Ålen</h1>
        <div>
          <h2>Data control</h2>

          <button
            onClick={() => {
              fetch('/start')
            }}
          >
            Starta seriell läsning
          </button>
          <button
            onClick={() => {
              fetch('/stop')
            }}
          >
            Stoppa seriell läsning
          </button>
          <button
            onClick={() => {
              if (confirm('Är du säker')) {
                socket.emit('CLEAR_POSITIONS')
              }
            }}
          >
            Rensa
          </button>
        </div>
        <AAlenControl>
          <h2>Ålen control</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={currentCommand}
              onChange={(e) => {
                setCurrentCommand(e.target.value)
              }}
            ></input>
          </form>
          <Buttons>
            <ButtonCol>
              <KeyButton label="<" targetKey="ArrowLeft" onPress={() => {}} />
            </ButtonCol>
            <ButtonCol>
              <KeyButton label="^" targetKey="ArrowUp" onPress={() => {}} />
              <KeyButton label="v" targetKey="ArrowDown" onPress={() => {}} />
            </ButtonCol>
            <ButtonCol>
              <KeyButton label=">" targetKey="ArrowRight" onPress={() => {}} />
            </ButtonCol>
          </Buttons>
        </AAlenControl>
        <Map
          markerPosition={positions.length > 0 ? positions[positions.length - 1] : null}
          polylinePositions={positions}
        />
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
