import { ImuStatus } from "@/app/components/topics";
import { useState } from "react";
import { useImuSubscriber } from "./useSubscribeToTopic";
import { ImuStatusPanel } from "@/app/components/ImuStatusPanel";

export const IotImuStatus = ({ thingName }: { thingName: string }) => {
  const [imuStatus, setImuStatus] = useState<ImuStatus>();
  useImuSubscriber(thingName, setImuStatus);
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
