import { Panel } from "./Panel";

const roundToOneDecimal = (val: number) => {
  return Math.round(val * 10) / 10;
};

export const NavStatusPanel = ({
  auto_mode_enabled,
  meters_to_target,
}: NavStatusProps) => {
  return (
    <Panel>
      <div className="label-text mb-md">Navigation status</div>
      <Table
        auto_mode_enabled={auto_mode_enabled}
        meters_to_target={meters_to_target}
      />
    </Panel>
  );
};

type NavStatusProps = {
  auto_mode_enabled?: boolean;
  meters_to_target?: number;
};

const Table = ({ auto_mode_enabled, meters_to_target }: NavStatusProps) => {
  const autoMode =
    auto_mode_enabled === undefined
      ? "unknown"
      : auto_mode_enabled
      ? "AUTO"
      : "MANUAL";
  const metersToTarget =
    meters_to_target === undefined
      ? "unknown"
      : `${roundToOneDecimal(meters_to_target)} m`;

  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <tbody>
          <tr>
            <th>Navigation mode</th>
            <td>{autoMode}</td>
          </tr>
          <tr>
            <th>Distance to target</th>
            <td>{metersToTarget}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
