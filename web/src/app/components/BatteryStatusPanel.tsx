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
  voltageRatio,
}: {
  voltageRatio?: number;
}) => {
  const statusText =
    voltageRatio === undefined
      ? "unknown"
      : `${Math.round(voltageRatio * 100)} %`;
  const level =
    voltageRatio === undefined ? 0 : Math.round(voltageRatio * 100);
  return (
    <Panel>
      <div className="label-text">Battery status</div>
      <div className="label-text font-bold">{statusText}</div>
      <LevelIndicator level={level} />
    </Panel>
  );
};
