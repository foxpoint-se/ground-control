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
        <tbody>
          <tr>
            <td>Navigation status </td>
            <td>{autoMode ? "Auto" : autoMode === false ? "Manual" : ""}</td>
          </tr>
          <tr>
            <td>Distance to target </td>
            <td>
              {distanceToTarget &&
                `${Math.round(distanceToTarget * 10) / 10} m`}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
