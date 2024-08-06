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
    />
  );
};
