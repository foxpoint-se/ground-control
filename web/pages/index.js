import Head from 'next/head'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { io } from 'socket.io-client'
import { Map } from '../components/Map'

const Container = styled.div`
  min-height: 100vh;
  height: 100vh;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
`

const Home = () => {
  const [positions, setPositions] = useState([])
  const [showMarker, setShowMarker] = useState(false)

  useEffect(() => {
    const currentSocket = io()

    currentSocket.on('NEW_POSITION', ({ position }) => {
      setPositions((prevList) => [...prevList, position])
    })

    currentSocket.on('ALL_POSITIONS', ({ positions }) => {
      setPositions(() => positions)
    })
  }, [])

  return (
    <Container>
      <Head>
        <title>Ålen data</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Ålen data {showMarker && 'visa'}</h1>
        <button
          onClick={() => {
            setShowMarker((prev) => !prev)
          }}
        >
          klicky
        </button>
        <Map
          markerPosition={positions.length > 0 ? positions[positions.length - 1] : null}
          polylinePositions={positions}
        />
        <ul>
          {positions.map((p, index) => (
            <li key={index}>{JSON.stringify(p)}</li>
          ))}
        </ul>
      </main>
    </Container>
  )
}

export default Home
