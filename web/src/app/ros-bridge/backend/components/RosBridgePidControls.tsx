import { PidControls } from "@/app/components/PidControls";
import ROSLIB from "roslib";
import { useDepthCmdPublisher } from "./rosBridge";

export const RosBridgePidControls = ({
  rosBridge,
}: {
  rosBridge: ROSLIB.Ros;
}) => {
  const { publishDepthCmd } = useDepthCmdPublisher(rosBridge);
  return <PidControls onPublishDepthCmd={publishDepthCmd} />;
};
