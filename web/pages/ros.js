import { useEffect, useState } from 'react'
import ROSLIB from 'roslib'
import { DataSheet } from '../components/DataSheet'
import { Compass } from '../components/Compass'

const RosPage = () => {
  const [imuStatus, setImuStatus] = useState({})
  const [gnssStatus, setGnssStatus] = useState({})

  useEffect(() => {
    var ros = new ROSLIB.Ros({
      url: 'ws://localhost:9090',
    })

    ros.on('connection', function () {
      console.log('Connected to websocket server.')
    })

    ros.on('error', function (error) {
      console.log('Error connecting to websocket server: ', error)
    })

    ros.on('close', function () {
      console.log('Connection to websocket server closed.')
    })

    var listener = new ROSLIB.Topic({
      ros: ros,
      name: '/imu/status',
      messageType: 'eel_interfaces/ImuStatus',
    })

    const gnssListener = new ROSLIB.Topic({
      ros,
      name: '/gnss/status',
      messageType: 'eel_interfaces/GnssStatus',
    })

    listener.subscribe(function (message) {
      // console.log('Received message on ', listener.name, message)
      setImuStatus(message)
      // listener.unsubscribe()
    })
    gnssListener.subscribe(function (message) {
      setGnssStatus(message)
    })
  }, [])

  return (
    <div>
      <div>
        <h1>Här är internt ROS-state</h1>
        <div>Heading: {imuStatus.euler_heading}</div>
        <div>Lat: {gnssStatus.lat}</div>
        <div>Lon: {gnssStatus.lon}</div>
      </div>
      <div>
        <DataSheet />
      </div>
      <div>
        <Compass heading={imuStatus?.euler_heading} />
      </div>
    </div>
  )
}

export default RosPage
