import { RudderStatus } from "@/app/components/new/RudderStatus";
import ROSLIB from "roslib";
import { useRudderStatusSubscriber } from "./rosBridge";
import { Vector3Msg } from "@/app/components/new/topics";
import { useState } from "react";

export const RosBridgeRudderStatus = ({
  rosBridge,
}: {
  rosBridge: ROSLIB.Ros;
}) => {
  const [rudderStatus, setRudderStatus] = useState<Vector3Msg>({
    x: 0,
    y: 0,
    z: 0,
  });
  useRudderStatusSubscriber(rosBridge, setRudderStatus);
  return <RudderStatus x={rudderStatus.x} y={rudderStatus.y} />;
};
