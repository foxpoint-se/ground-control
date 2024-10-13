import { ImuStatusPanel } from "@/app/components/ImuStatusPanel";
import { ImuOffset, ImuStatus } from "@/app/components/topics";
import { useState } from "react";
import ROSLIB from "roslib";
import { useImuOffsetSubscriber, useImuSubscriber } from "./rosBridge";

export const RosBridgeImuStatus = ({
  rosBridge,
}: {
  rosBridge: ROSLIB.Ros;
}) => {
  const [imuStatus, setImuStatus] = useState<ImuStatus>();
  const [imuOffset, setImuOffset] = useState<ImuOffset>();
  useImuSubscriber(rosBridge, setImuStatus);
  useImuOffsetSubscriber(rosBridge, setImuOffset);
  return (
    <ImuStatusPanel
      heading={imuStatus?.heading}
      accel={imuStatus?.accel}
      gyro={imuStatus?.gyro}
      is_calibrated={imuStatus?.is_calibrated}
      mag={imuStatus?.mag}
      sys={imuStatus?.sys}
      magOffset={imuOffset?.mag}
      gyrOffset={imuOffset?.gyr}
      accOffset={imuOffset?.acc}
    />
  );
};
