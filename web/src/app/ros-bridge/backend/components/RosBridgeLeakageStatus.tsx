import ROSLIB from "roslib";
import { useLeakageStatusSubscriber } from "./rosBridge";
import { useState } from "react";
import { LeakageStatus } from "@/app/components/topics";
import { LeakageStatusPanel } from "@/app/components/LeakageStatusPanel";

export const RosBridgeLeakageStatus = ({
  rosBridge,
}: {
  rosBridge: ROSLIB.Ros;
}) => {
  const [leakageStatus, setLeakageStatus] = useState<LeakageStatus>();
  useLeakageStatusSubscriber(rosBridge, setLeakageStatus);
  return <LeakageStatusPanel leakageStatus={leakageStatus} />;
};
