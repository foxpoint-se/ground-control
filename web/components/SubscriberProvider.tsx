import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
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
  }, [transportType])

  return (
    <EelTopicsContext.Provider value={{ sockets, rosConnections }}>
      {children}
    </EelTopicsContext.Provider>
  )
}

export const SubscriberContext = createContext<{ subscribe: Subscribe; send: Send }>(null)

type Subscribe = (topic: string, messageType: string, callback: (msg: any) => void) => void
type Send = (topic: string, messageType: string, message: any) => void

const CallbacksProvider = ({ children }) => {
  const { sockets, rosConnections } = useContext(EelTopicsContext)
  console.log('inner provider', { sockets, rosConnections })

  const subscribe = useCallback<Subscribe>(
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

  const send = useCallback<Send>(
    (topic, messageType, message) => {
      if (rosConnections.length > 0) {
        const rosConn = rosConnections[0]

        const publisher = new ROSLIB.Topic({
          ros: rosConn,
          name: topic,
          messageType: messageType,
        })

        const msg = new ROSLIB.Message(message)
        publisher.publish(msg)
      }
    },
    [sockets, rosConnections],
  )

  return (
    <SubscriberContext.Provider value={{ subscribe, send }}>{children}</SubscriberContext.Provider>
  )
}

export const SubscriberProvider = ({ children, selectedSource }) => {
  return (
    <EelTopicsProvider transportType={selectedSource}>
      <CallbacksProvider>{children}</CallbacksProvider>
    </EelTopicsProvider>
  )
}
