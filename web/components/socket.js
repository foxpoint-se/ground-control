import { createContext, useState, useEffect } from 'react'
import { io } from 'socket.io-client'

export const SocketContext = createContext()

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState()
  useEffect(() => {
    const currentSocket = io('http://localhost:5000', { transports: ['websocket'] })
    setSocket(currentSocket)
  }, [])

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
}
