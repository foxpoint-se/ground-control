import { DataTable } from './styles'

export const DataSheet = ({
  autoMode,
  distanceToTarget,
  imuGyroValue,
  imuMagnetometerValue,
  imuAccelerometerValue,
  imuSystemValue,
  imuIsCalibrated,
  lastUpdateReceived,
  countPositions,
}) => {
  return (
    <div>
      <DataTable>
        <tbody>
          <tr>
            <td>Navigation status </td>
            <td>{autoMode ? 'Auto' : autoMode === false ? 'Manual' : ''}</td>
          </tr>
          <tr>
            <td>Distance to target </td>
            <td>{distanceToTarget && `${Math.round(distanceToTarget * 10) / 10} m`}</td>
          </tr>
          <tr>
            <td>Is calibrated </td>
            <td>{imuIsCalibrated ? 'True' : imuIsCalibrated === false ? 'False' : ''}</td>
          </tr>
          <tr>
            <td>Gyro </td>
            <td>{imuGyroValue}</td>
          </tr>
          <tr>
            <td>Magnetometer </td>
            <td>{imuMagnetometerValue}</td>
          </tr>
          <tr>
            <td>Accelerometer </td>
            <td>{imuAccelerometerValue}</td>
          </tr>
          <tr>
            <td>System </td>
            <td>{imuSystemValue}</td>
          </tr>
          <tr>
            <td>Last update received </td>
            <td>{lastUpdateReceived}</td>
          </tr>
          <tr>
            <td>Count positions</td>
            <td>{countPositions}</td>
          </tr>
        </tbody>
      </DataTable>
    </div>
  )
}
