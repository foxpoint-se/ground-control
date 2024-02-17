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

export const ImuStatusPanel = ({ heading }: { heading?: number }) => {
  const headingCoords = getNeedleCoordinates(heading);
  return (
    <Panel>
      <div className="rounded bg-slate-200 p-xs">
        <div className="label-text">IMU status</div>
        <div className="flex justify-center">
          <XYVectorIndicator vector={headingCoords} color="red" />
        </div>
      </div>
    </Panel>
  );
};
