import ROSLIB from "roslib";
import { useNamedMissionPublisher } from "./rosBridge";

import { NamedMission } from "@/app/components/NamedMission";

export const RosBridgeNamedMission = ({
  rosBridge,
}: {
  rosBridge: ROSLIB.Ros;
}) => {
  const { publishNamedMission } = useNamedMissionPublisher(rosBridge);

  return <NamedMission onSendNamedMission={publishNamedMission} />;
};
