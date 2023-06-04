import { SubscriberProvider } from "../SubscriberProvider";
import { Panel } from "./Panel";

type ControlPanelProps = {
  transportType: "ros" | "radio";
  wsBackendUrl: string;
};

export const ControlPanel = ({
  transportType,
  wsBackendUrl,
}: ControlPanelProps) => {
  if (transportType === "radio") {
    return <div>Not implemented</div>;
  }
  return (
    <SubscriberProvider selectedSource="ros" wsBackendUrl={wsBackendUrl}>
      <Panel />
    </SubscriberProvider>
  );
};
