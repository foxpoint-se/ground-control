import { TankControls } from "@/app/components/new/TankControls";
import ROSLIB from "roslib";
import { useFrontTankPublisher, useRearTankPublisher } from "./rosBridge";

export const RosBridgeTankControls = ({
  rosBridge,
}: {
  rosBridge: ROSLIB.Ros;
}) => {
  const { publishFrontTankCmd } = useFrontTankPublisher(rosBridge);
  const { publishRearTankCmd } = useRearTankPublisher(rosBridge);
  return (
    <TankControls
      onPublishFront={(v: number) => {
        publishFrontTankCmd({ data: v });
      }}
      onPublishRear={(v: number) => {
        publishRearTankCmd({ data: v });
      }}
    />
  );
};
