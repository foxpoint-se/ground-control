import { NavStatusPanel } from "@/app/components/NavStatus";
import { NavStatus } from "@/app/components/topics";
import { useState } from "react";
import { useNavStatusSubscriber } from "./useSubscribeToTopic";

export const IotNavStatus = ({ thingName }: { thingName: string }) => {
  const [navStatus, setNavStatus] = useState<NavStatus>();
  useNavStatusSubscriber(thingName, setNavStatus);
  return (
    <NavStatusPanel
      auto_mode_enabled={navStatus?.auto_mode_enabled}
      meters_to_target={navStatus?.meters_to_target}
      count_goals_left={navStatus?.count_goals_left}
      count_waypoints_left={navStatus?.waypoints_left?.length}
      mission_total_meters={navStatus?.mission_total_meters}
    />
  );
};
