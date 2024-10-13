import { ImuOffset, ImuStatus } from "@/app/components/topics";
import { useState } from "react";
import { useImuOffsetSubscriber, useImuSubscriber } from "./useSubscribeToTopic";
import { ImuStatusPanel } from "@/app/components/ImuStatusPanel";

export const IotImuStatus = ({ thingName }: { thingName: string }) => {
  const [imuStatus, setImuStatus] = useState<ImuStatus>();
  const [imuOffset, setImuOffset] = useState<ImuOffset>();
  useImuSubscriber(thingName, setImuStatus);
  useImuOffsetSubscriber(thingName, setImuOffset);
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
