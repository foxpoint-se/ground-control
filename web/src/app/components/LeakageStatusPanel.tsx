import { Panel } from "./Panel";
import { LeakageStatus } from "./topics";

type StatusText = "unknown" | "LEAK DETECTED" | "ALL GOOD";

export const LeakageStatusPanel = ({
  leakageStatus,
}: {
  leakageStatus?: LeakageStatus;
}) => {
  let statusText: StatusText = "unknown";
  if (leakageStatus?.data == true) {
    statusText = "LEAK DETECTED";
  } else if (leakageStatus?.data == false) {
    statusText = "ALL GOOD";
  }
  return (
    <Panel>
      <div className="label-text">Leakage status</div>
      <div
        className={`label-text font-bold ${
          statusText === "LEAK DETECTED" ? "text-error animate-bounce" : ""
        }`}
      >
        {statusText}
      </div>
    </Panel>
  );
};
