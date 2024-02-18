import { Coord2d, XYVectorIndicator } from "../RudderStatus";
import { Panel } from "./Panel";

const degreesToRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

const getNeedleCoordinates = (degrees?: number): Coord2d => {
  if (!degrees) {
    return { x: 0, y: 0 };
  }
  // rotate backwards 90deg, since the unit circle starts at the X axis, but the compass doesn't
  const adjustedDegrees = (degrees - 90 + 360) % 360;
  const radians = degreesToRadians(adjustedDegrees);
  const x = Math.cos(radians);
  const y = Math.sin(radians);
  return { x, y };
};

type CalibrationProps = {
  accel?: number;
  gyro?: number;
  is_calibrated?: boolean;
  mag?: number;
  sys?: number;
};

type ImuStatusPanelProps = {
  heading?: number;
} & CalibrationProps;

export const ImuStatusPanel = ({ heading, ...rest }: ImuStatusPanelProps) => {
  const headingCoords = getNeedleCoordinates(heading);
  return (
    <Panel>
      <div className="label-text">IMU status</div>
      <div className="flex justify-center">
        <XYVectorIndicator vector={headingCoords} color="red" />
      </div>
      <div>
        <Table {...rest} />
      </div>
    </Panel>
  );
};

const Table = ({ accel, gyro, is_calibrated, mag, sys }: CalibrationProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <tbody>
          <tr>
            <th>Is calibrated</th>
            <td>
              {is_calibrated === undefined ? "" : is_calibrated ? "Yes" : "No"}
            </td>
          </tr>
          <tr>
            <th>System</th>
            <td>{sys}</td>
          </tr>
          <tr>
            <th>Gyro</th>
            <td>{gyro}</td>
          </tr>
          <tr>
            <th>Magnetometer</th>
            <td>{mag}</td>
          </tr>
          <tr>
            <th>Accelerometer</th>
            <td>{accel}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
