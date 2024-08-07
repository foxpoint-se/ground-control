import { DepthVisualization } from "@/app/components/DepthVisualization";
import { Panel } from "@/app/components/Panel";
import { ImuStatus, PressureStatus, TankStatus } from "@/app/components/topics";
import { useState } from "react";
import {
  useFrontTankSubscriber,
  useImuSubscriber,
  usePressureSubscriber,
  useRearTankSubscriber,
} from "./useSubscribeToTopic";

export const IotTankStatus = ({ thingName }: { thingName: string }) => {
  const [frontStatus, setFrontStatus] = useState<TankStatus>();
  const [rearStatus, setRearStatus] = useState<TankStatus>();
  const [pressureStatus, setPressureStatus] = useState<PressureStatus>();
  const [imuStatus, setImuStatus] = useState<ImuStatus>();

  useFrontTankSubscriber(thingName, setFrontStatus);
  useRearTankSubscriber(thingName, setRearStatus);
  usePressureSubscriber(thingName, setPressureStatus);
  useImuSubscriber(thingName, setImuStatus);

  return (
    <Panel>
      <div className="label-text mb-md">Depth and pitch</div>
      <DepthVisualization
        depth={pressureStatus?.depth}
        frontTank={frontStatus?.current_level}
        pitch={imuStatus?.pitch}
        rearTank={rearStatus?.current_level}
      />
    </Panel>
  );
};
