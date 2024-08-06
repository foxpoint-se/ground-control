import { Panel } from "./Panel";
import { LeakageStatus } from "./topics";

export const LeakageStatusPanel = ({
  leakageStatus,
}: {
  leakageStatus?: LeakageStatus;
}) => {
  let statusText = "unknown";
  if (leakageStatus == true) {
    statusText = "LEAK DETECTED";
  } else if (leakageStatus == false) {
    statusText = "ALL GOOD";
  }
  return (
    <Panel>
      <div className="label-text">Leakage status</div>
      <div
        className={`label-text font-bold ${
          leakageStatus ? "text-error animate-bounce" : ""
        }`}
      >
        {statusText}
      </div>
    </Panel>
  );
};
