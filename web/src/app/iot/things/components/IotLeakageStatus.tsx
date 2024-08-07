import { LeakageStatus } from "@/app/components/topics";
import { useState } from "react";
import { useLeakageStatusSubscriber } from "./useSubscribeToTopic";
import { LeakageStatusPanel } from "@/app/components/LeakageStatusPanel";

export const IotLeakageStatus = ({ thingName }: { thingName: string }) => {
  const [leakageStatus, setLeakageStatus] = useState<LeakageStatus>();
  useLeakageStatusSubscriber(thingName, setLeakageStatus);
  return <LeakageStatusPanel leakageStatus={leakageStatus} />;
};
