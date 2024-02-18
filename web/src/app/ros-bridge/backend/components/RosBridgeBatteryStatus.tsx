import { BatteryStatusPanel } from "@/app/components/new/BatteryStatusPanel";
import ROSLIB from "roslib";
import { useBatterySubscriber } from "./rosBridge";
import { useState } from "react";
import { BatteryStatus } from "@/app/components/new/topics";

export const RosBridgeBatteryStatus = ({
  rosBridge,
}: {
  rosBridge: ROSLIB.Ros;
}) => {
  const [batteryStatus, setBatteryStatus] = useState<BatteryStatus>();
  useBatterySubscriber(rosBridge, setBatteryStatus);
  return <BatteryStatusPanel voltagePercent={batteryStatus?.voltage_percent} />;
};
