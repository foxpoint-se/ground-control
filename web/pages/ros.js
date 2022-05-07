import { useEffect, useState } from 'react'
import ROSLIB from 'roslib'
import { DataSheet } from '../components/DataSheet'
import { Compass } from '../components/Compass'
import { ClickableMap } from '../components/ClickableMap'
import { Container, Main } from '../components/styles'

const RosPage = () => {
  const [imuStatus, setImuStatus] = useState({})
  const [gnssStatus, setGnssStatus] = useState({})
  const [navStatus, setNavStatus] = useState()

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

    const navListener = new ROSLIB.Topic({
      ros,
      name: '/nav/status',
      messageType: 'eel_interfaces/NavigationStatus',
    })

    listener.subscribe(function (message) {
      // console.log('Received message on ', listener.name, message)
      setImuStatus(message)
      // listener.unsubscribe()
    })
    gnssListener.subscribe(function (message) {
      setGnssStatus(message)
    })
    navListener.subscribe(function (message) {
      // if (!navStatus) {
      setNavStatus(message)
      // }
    })
  }, [])

  // console.log({ imuStatus, gnssStatus })

  // TODO: types
  //   auto_mode_enabled: false
  // meters_to_target: 101.11756896972656
  // next_target: [{…}]
  // tolerance_in_meters: 5

  //   gnssStatus: Message
  // lat: 59.31022644042969
  // lon: 17.97468376159668

  // imuStatus: Message
  // accel: 3
  // euler_heading: 353.8733215332031
  // gyro: 3
  // is_calibrated: true
  // mag: 3
  // sys: 3

  const targetMarkers = []
  if (navStatus) {
    targetMarkers.push({
      tolerance: navStatus.tolerance_in_meters,
    })
  }

  return (
    <Container>
      <Main>
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
        <ClickableMap
          vehicle={
            gnssStatus?.lat &&
            gnssStatus?.lon && {
              coordinate: { lat: gnssStatus.lat, lon: gnssStatus.lon },
              heading: imuStatus?.euler_heading || 0,
            }
          }
          targetMarkers={
            navStatus?.next_target[0] && [
              {
                tolerance: navStatus.tolerance_in_meters,
                icon: 'pin',
                lat: navStatus.next_target[0].lat,
                lon: navStatus.next_target[0].lon,
              },
            ]
          }
        />
      </Main>
    </Container>
  )
}

export default RosPage
