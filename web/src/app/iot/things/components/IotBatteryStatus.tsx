import { BatteryStatusPanel } from "@/app/components/BatteryStatusPanel";
import { useState } from "react";
import { BatteryStatusMqtt } from "@/app/components/topics";
import { useBatterySubscriber } from "./useSubscribeToTopic";

export const IotBatteryStatus = ({ thingName }: { thingName: string }) => {
  const [batteryStatus, setBatteryStatus] = useState<BatteryStatusMqtt>();
  useBatterySubscriber(thingName, setBatteryStatus);
  return <BatteryStatusPanel voltagePercent={batteryStatus?.voltage_percent} />;
};
