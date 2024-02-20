import { Panel } from "./Panel";

const LevelIndicator = ({ level }: { level: number }) => {
  return (
    <progress
      className="progress progress-primary"
      value={level}
      max="100"
    ></progress>
  );
};

export const BatteryStatusPanel = ({
  voltagePercent,
}: {
  voltagePercent?: number;
}) => {
  const statusText =
    voltagePercent === undefined
      ? "unknown"
      : `${Math.round(voltagePercent * 100)} %`;
  const level =
    voltagePercent === undefined ? 0 : Math.round(voltagePercent * 100);
  return (
    <Panel>
      <div className="label-text">Battery status</div>
      <div className="label-text font-bold">{statusText}</div>
      <LevelIndicator level={level} />
    </Panel>
  );
};
