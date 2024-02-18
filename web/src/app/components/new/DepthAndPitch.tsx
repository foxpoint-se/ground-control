import { DepthVisualization } from "./DepthVisualization";
import { Panel } from "./Panel";

type Props = {
  depth?: number;
  pitch?: number;
  depthVelocity?: number;
  pitchVelocity?: number;
  frontTank?: number;
  rearTank?: number;
  frontTargetLevel?: number;
  frontTargetStatus?: string;
  frontIsAutocorrecting?: boolean;
  rearTargetLevel?: number;
  rearTargetStatus?: string;
  rearIsAutocorrecting?: boolean;
  depthTarget?: number;
};

const round = (value: number) => Math.round(value * 100) / 100;

const Table = ({
  depth = 0.0,
  pitch = 0.0,
  depthVelocity = 0.0,
  pitchVelocity = 0.0,
  frontTank = 0.0,
  rearTank = 0.0,
  frontTargetLevel = undefined,
  frontTargetStatus = undefined,
  frontIsAutocorrecting = undefined,
  rearTargetLevel = undefined,
  rearTargetStatus = undefined,
  rearIsAutocorrecting = undefined,
  depthTarget = 0.0,
}: Props) => {
  return (
    <table className="table table-xs">
      <tbody>
        <tr>
          <td>Depth</td>
          <td>{depth && round(depth)}</td>
        </tr>
        <tr>
          <td>Depth target</td>
          <td>{depthTarget && round(depthTarget)}</td>
        </tr>
        <tr>
          <td>Depth velocity</td>
          <td>{depthVelocity && round(depthVelocity)}</td>
        </tr>
        <tr>
          <td>Pitch</td>
          <td>{pitch && round(pitch)}</td>
        </tr>
        <tr>
          <td>Pitch velocity</td>
          <td>{pitchVelocity && round(pitchVelocity)}</td>
        </tr>
        <tr>
          <td>Rear tank</td>
          <td>{rearTank && round(rearTank)}</td>
        </tr>
        <tr>
          <td>Rear target level</td>
          <td>{rearTargetLevel && round(rearTargetLevel)}</td>
        </tr>
        <tr>
          <td>Rear target status</td>
          <td>{rearTargetStatus}</td>
        </tr>
        <tr>
          <td>Rear is auto correcting</td>
          <td>
            {rearIsAutocorrecting === false
              ? "False"
              : rearIsAutocorrecting === true
              ? "True"
              : ""}
          </td>
        </tr>
        <tr>
          <td>Front tank</td>
          <td>{frontTank && round(frontTank)}</td>
        </tr>
        <tr>
          <td>Front target level</td>
          <td>{frontTargetLevel && round(frontTargetLevel)}</td>
        </tr>
        <tr>
          <td>Front target status</td>
          <td>{frontTargetStatus}</td>
        </tr>
        <tr>
          <td>Front is auto correcting</td>
          <td>
            {frontIsAutocorrecting === false
              ? "False"
              : frontIsAutocorrecting === true
              ? "True"
              : ""}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export const DepthAndPitch = (props: Props) => {
  const { depth = 0.0, pitch = 0.0, frontTank = 0.0, rearTank = 0.0 } = props;

  return (
    <Panel>
      <div className="label-text mb-md">Depth and pitch</div>
      <div className="grid grid-cols-2 gap-lg">
        <div className="col-span-1">
          <Table {...props} />
        </div>
        <div className="col-span-1 py-md">
          <DepthVisualization
            depth={depth}
            pitch={pitch}
            frontTank={frontTank}
            rearTank={rearTank}
          />
        </div>
      </div>
    </Panel>
  );
};
