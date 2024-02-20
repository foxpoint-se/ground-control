import { Coord2d, XYVectorIndicator } from "../XYVectorIndicator";
import { Panel } from "./Panel";

export const RudderStatus = ({ x, y }: Coord2d) => {
  return (
    <Panel>
      <div className="label-text">Rudder status</div>
      <div className="flex justify-center">
        <XYVectorIndicator vector={{ x, y }} color="black" />
      </div>
    </Panel>
  );
};
