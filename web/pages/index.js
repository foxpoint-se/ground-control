import Head from 'next/head'
import { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { Map } from '../components/Map'
import { SocketContextProvider, SocketContext } from '../components/socket'

const Container = styled.div`
  min-height: 100vh;
  height: 100vh;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
`

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
        <title>Ålen data</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Ålen data</h1>
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={currentCommand}
              onChange={(e) => {
                setCurrentCommand(e.target.value)
              }}
            ></input>
          </form>
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
