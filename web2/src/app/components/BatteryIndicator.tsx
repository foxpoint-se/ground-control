import { Arm } from "./VerticalData";

export const BatteryIndicator = ({ level }: { level: number }) => {
  return (
    <div>
      {level === undefined ? (
        <div>No data</div>
      ) : (
        <div>
          <Arm level={level} />
        </div>
      )}
      <div className="ml-24">Battery</div>
    </div>
  );
};
