import { PidControls } from "@/app/components/PidControls";
import { usePitchDepthPublisher } from "./useSubscribeToTopic";

export const IotPitchDepthControls = ({ thingName }: { thingName: string }) => {
  const { publishPitchDepthCmd } = usePitchDepthPublisher(thingName);

  return <PidControls onPublishDepthCmd={publishPitchDepthCmd} />;
};
