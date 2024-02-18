import { ImuStatusPanel } from "@/app/components/new/ImuStatusPanel";
import { ImuStatus } from "@/app/components/new/topics";
import { useState } from "react";
import ROSLIB from "roslib";
import { useImuSubscriber } from "./rosBridge";

export const RosBridgeImuStatus = ({
  rosBridge,
}: {
  rosBridge: ROSLIB.Ros;
}) => {
  const [imuStatus, setImuStatus] = useState<ImuStatus>();
  useImuSubscriber(rosBridge, setImuStatus);
  return (
    <ImuStatusPanel
      heading={imuStatus?.heading}
      accel={imuStatus?.accel}
      gyro={imuStatus?.gyro}
      is_calibrated={imuStatus?.is_calibrated}
      mag={imuStatus?.mag}
      sys={imuStatus?.sys}
    />
  );
};