import { NavStatusPanel } from "@/app/components/new/NavStatus";
import { NavStatus } from "@/app/components/new/topics";
import { useState } from "react";
import ROSLIB from "roslib";
import { useNavSubscriber } from "./rosBridge";

export const RosBridgeNavStatus = ({
  rosBridge,
}: {
  rosBridge: ROSLIB.Ros;
}) => {
  const [navStatus, setNavStatus] = useState<NavStatus>();
  useNavSubscriber(rosBridge, setNavStatus);
  return (
    <NavStatusPanel
      auto_mode_enabled={navStatus?.auto_mode_enabled}
      meters_to_target={navStatus?.meters_to_target}
    />
  );
};
