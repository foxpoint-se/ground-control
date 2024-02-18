import "./data-table.css";

type DataSheetProps = {
  autoMode?: boolean;
  distanceToTarget?: number;
  lastUpdateReceived?: string;
  countPositions?: number;
};

export const DataSheet = ({
  autoMode,
  distanceToTarget,
  lastUpdateReceived,
  countPositions,
}: DataSheetProps) => {
  return (
    <div>
      <table>
        <tbody></tbody>
      </table>
    </div>
  );
};
