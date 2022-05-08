import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import { Container, Main } from '../components/styles'
import { ImuStatus } from './radio'
import { SubscriberContext, SubscriberProvider } from '../components/SubscriberProvider'

type SourceType = 'radio' | 'ros' | undefined

const Select = () => {
  const [selectedSource, setSelectedSource] = useState<SourceType>()
  return (
    <Container>
      <Head>
        <title>Select source</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main>
        <h1>Select source</h1>
        <div>
          <select
            value={selectedSource}
            onChange={(e) => {
              setSelectedSource(e.target.value as SourceType)
            }}
          >
            <option value={undefined}></option>
            <option value="radio">HC12</option>
            <option value="ros">ROS</option>
          </select>
        </div>
        <div>{selectedSource ? selectedSource : 'no source'}</div>
        <SubscriberProvider selectedSource={selectedSource}>
          <Page2 />
        </SubscriberProvider>
      </Main>
    </Container>
  )
}

const Page2 = () => {
  const { subscribe } = useContext(SubscriberContext)
  console.log('Page2', { subscribe })
  useEffect(() => {
    subscribe('imu/status', 'eel_interfaces/ImuStatus', (msg: ImuStatus) => {
      console.log('got imu msg', msg)
      // setImuStatus(msg)
    })
  }, [subscribe])
  return <div>korkokrroko</div>
}

export default Select
