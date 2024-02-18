import { PidControls } from "@/app/components/new/PidControls";
import ROSLIB from "roslib";

export const RosBridgePidControls = ({
  rosBridge,
}: {
  rosBridge: ROSLIB.Ros;
}) => {
  return <PidControls rosBridge={rosBridge} />;
};
