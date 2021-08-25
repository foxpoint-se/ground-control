import Head from 'next/head'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { io } from 'socket.io-client'

const Container = styled.div`
  min-height: 100vh;
  height: 100vh;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
`

export default function Home() {
  const [positions, setPositions] = useState([])

  useEffect(() => {
    console.log('hej')
    const currentSocket = io()

    currentSocket.on('add_position', (payload) => {
      console.log('hahahah')
      setPositions((prevList) => [...prevList, payload])
    })
  }, [])

  return (
    <Container>
      <Head>
        <title>Ålen data</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Ålen data</h1>
        <ul>
          {positions.map((p, index) => (
            <li key={index}>{JSON.stringify(p)}</li>
          ))}
        </ul>
      </main>
    </Container>
  )
}
