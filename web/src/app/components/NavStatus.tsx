import { Panel } from "./Panel";

const roundToOneDecimal = (val: number) => {
  return Math.round(val * 10) / 10;
};

export const NavStatusPanel = ({
  auto_mode_enabled,
  meters_to_target,
  count_goals_left,
  count_waypoints_left,
  mission_total_meters,
}: NavStatusProps) => {
  return (
    <Panel>
      <div className="label-text mb-md">Navigation status</div>
      <Table
        auto_mode_enabled={auto_mode_enabled}
        meters_to_target={meters_to_target}
        count_goals_left={count_goals_left}
        count_waypoints_left={count_waypoints_left}
        mission_total_meters={mission_total_meters}
      />
    </Panel>
  );
};

type NavStatusProps = {
  auto_mode_enabled?: boolean;
  meters_to_target?: number;
  mission_total_meters?: number;
  count_waypoints_left?: number;
  count_goals_left?: number;
};

const Table = ({
  auto_mode_enabled,
  meters_to_target,
  count_goals_left,
  count_waypoints_left,
  mission_total_meters,
}: NavStatusProps) => {
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

  const goalsLeft =
    count_goals_left === undefined ? "unknown" : count_goals_left;
  const waypointsLeft =
    count_waypoints_left === undefined ? "unknown" : count_waypoints_left;
  const missionDistance =
    mission_total_meters === undefined
      ? "unknown"
      : `${roundToOneDecimal(mission_total_meters)} m`;

  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <tbody>
          <tr>
            <th>Navigation mode</th>
            <td className="w-[50%]">{autoMode}</td>
          </tr>
          <tr>
            <th>Distance to target</th>
            <td className="w-[50%]">{metersToTarget}</td>
          </tr>
          <tr>
            <th>Mission total meters</th>
            <td className="w-[50%]">{missionDistance}</td>
          </tr>
          <tr>
            <th>Waypoints left</th>
            <td className="w-[50%]">{waypointsLeft}</td>
          </tr>
          <tr>
            <th>Goals left</th>
            <td className="w-[50%]">{goalsLeft}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
