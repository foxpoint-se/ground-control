import { Arm } from "./VerticalData";

export const BatteryIndicator = ({ level }: { level: number }) => {
  return (
    <div>
      <div>Battery</div>
      <div>
        {level === undefined ? (
          <div>No data</div>
        ) : (
          <div>
            <Arm level={level} />
          </div>
        )}
      </div>
    </div>
  );
};
