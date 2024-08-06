import { TankControls } from "@/app/components/TankControls";
import {
  useFrontTankPublisher,
  useRearTankPublisher,
} from "./useSubscribeToTopic";

export const IotTankControls = ({ thingName }: { thingName: string }) => {
  const { publishFrontTankCmd } = useFrontTankPublisher(thingName);
  const { publishRearTankCmd } = useRearTankPublisher(thingName);

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
