import Head from 'next/head'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { Container, Main } from '../components/styles'
import { ImuStatus } from './radio'
import ROSLIB from 'roslib'

const EelTopicsContext = createContext(null)

const EelTopicsProvider = ({ transportType, children }) => {
  // Workaround since useEffect is called twice (in dev mode?) so we want to be able
  // to disconnect from all connected sockets
  const [sockets, setSockets] = useState<Socket[]>([])
  const [rosConnections, setRosConnections] = useState<ROSLIB.Ros[]>([])
  console.log('Eel topics provider')

  useEffect(() => {
    console.log('useEffect', transportType, { sockets })
    if (transportType === 'radio') {
      if (sockets.length > 0) {
        console.log('sockets already exists. disconnecting')
        sockets.forEach((s) => {
          s.disconnect()
        })
        setSockets([])
      } else {
        const aSocket = io('http://localhost:5000', { transports: ['websocket'] })
        console.log({ aSocket })
        setSockets((prev) => [...prev, aSocket])
      }
    } else {
      if (sockets.length > 0) {
        console.log('sockets exists. disconnecting', { sockets })
        sockets.forEach((s) => {
          s.disconnect()
        })
        setSockets([])
      }
    }

    if (transportType === 'ros') {
      if (rosConnections.length > 0) {
        console.log('ros connections exist. disconnecting')
        rosConnections.forEach((r) => {
          r.close()
        })
        setRosConnections([])
      } else {
        const rosConn = new ROSLIB.Ros({ url: 'ws://localhost:9090' })
        rosConn.on('connection', function () {
          console.log('Connected to websocket server.')
        })

        rosConn.on('error', function (error) {
          console.log('Error connecting to websocket server: ', error)
        })

        rosConn.on('close', function () {
          console.log('Connection to websocket server closed.')
        })
        setRosConnections((prev) => [...prev, rosConn])
      }
    } else {
      if (rosConnections.length > 0) {
        console.log('ros connections exist ANOTHER. disconnecting')
        rosConnections.forEach((r) => {
          r.close()
        })
        setRosConnections([])
      }
    }

    return () => {
      console.log('CLEAN UP', transportType, { sockets })

      if (sockets.length > 0) {
        console.log('sockets exists. disconnecting')
        sockets.forEach((s) => {
          s.disconnect()
        })
        setSockets([])
      }
      if (rosConnections.length > 0) {
        console.log('ros connections exist ANOTHER AGAIN. disconnecting')
        rosConnections.forEach((r) => {
          r.close()
        })
        setRosConnections([])
      }
    }
    // }, [transportType === 'ros', transportType === 'radio', transportType === undefined])
  }, [transportType])

  const subscribe = useCallback(
    (topic, messageType, callback) => {
      console.log('subscribing to', topic, transportType, sockets, rosConnections)
      if (sockets.length > 0) {
        console.log('using sockets')
        const socket = sockets[0]
        socket.on(topic, callback)
      } else if (rosConnections.length > 0) {
        const rosConn = rosConnections[0]
        const listener = new ROSLIB.Topic({
          ros: rosConn,
          name: topic,
          messageType,
        })
        listener.subscribe(callback)
      }
    },
    [transportType],
  )

  // if (sockets.length > 0) {
  //   console.log('rendering with sockets')
  //   return <EelTopicsContext.Provider value={{ subscribe }}>{children}</EelTopicsContext.Provider>
  // }
  // if (rosConnections.length > 0) {
  //   return <EelTopicsContext.Provider value={{ subscribe }}>{children}</EelTopicsContext.Provider>
  // }
  // return <div>not valid transport type</div>

  return (
    <EelTopicsContext.Provider value={{ sockets, rosConnections }}>
      {children}
    </EelTopicsContext.Provider>
  )
}

const EelCallbacksContext = createContext(null)

const CallbacksProvider = ({ children }) => {
  const { sockets, rosConnections } = useContext(EelTopicsContext)
  console.log('inner provider', { sockets, rosConnections })
  // const subscribe2 = useCallback(() => {
  //   console.log('hej från useCallback')
  //   return (topic, messageType, callback) => {
  //     console.log('subscribing to', topic, sockets, rosConnections)
  //     if (sockets.length > 0) {
  //       console.log('using sockets')
  //       const socket = sockets[0]
  //       socket.on(topic, callback)
  //     } else if (rosConnections.length > 0) {
  //       const rosConn = rosConnections[0]
  //       const listener = new ROSLIB.Topic({
  //         ros: rosConn,
  //         name: topic,
  //         messageType,
  //       })
  //       listener.subscribe(callback)
  //     }
  //   }
  // }, [sockets, rosConnections])

  const subscribe = useCallback(
    (topic, messageType, callback) => {
      console.log('subscribing to', topic, sockets, rosConnections)
      if (sockets.length > 0) {
        console.log('using sockets')
        const socket = sockets[0]
        socket.on(topic, callback)
      } else if (rosConnections.length > 0) {
        const rosConn = rosConnections[0]
        const listener = new ROSLIB.Topic({
          ros: rosConn,
          name: topic,
          messageType,
        })
        listener.subscribe(callback)
      }
    },
    [sockets, rosConnections],
  )

  return (
    <EelCallbacksContext.Provider value={{ subscribe }}>{children}</EelCallbacksContext.Provider>
  )
}

const useEelTopics = () => {
  return useContext(EelTopicsContext)

  // console.log('useEelTopics', { subscribe })

  // return { subscribe, unsubscribe }
}

const Page = () => {
  const [imuStatus, setImuStatus] = useState<ImuStatus>()
  const { subscribe, unsubscribe } = useEelTopics()
  console.log('render Page', { subscribe })
  // useEffect(() => {
  subscribe('imu/status', 'eel_interfaces/ImuStatus', (msg: ImuStatus) => {
    console.log('got imu msg', msg)
    setImuStatus(msg)
  })
  // }, [])
  // if (subscribe) {
  // }
  // console.log('on Page', { subscribe, unsubscribe })
  return <div>{JSON.stringify(imuStatus)}</div>
}

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
        {/* {selectedSource === 'hc12' && (
          <Hc12Provider>
            <Page />
          </Hc12Provider>
        )} */}
        {/* {selectedSource && ( */}
        <EelTopicsProvider transportType={selectedSource}>
          <CallbacksProvider>
            <Page2 />
          </CallbacksProvider>
          {/* <Page /> */}
        </EelTopicsProvider>
        {/* )} */}
      </Main>
    </Container>
  )
}

const Page2 = () => {
  const { subscribe } = useContext(EelCallbacksContext)
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
