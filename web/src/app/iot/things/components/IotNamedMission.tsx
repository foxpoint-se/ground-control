import { useNamedMissionPublisher } from "./useSubscribeToTopic";
import { NamedMission } from "@/app/components/NamedMission";

export const IotNamedMission = ({ thingName }: { thingName: string }) => {
  const { publishNamedMissionCmd } = useNamedMissionPublisher(thingName);

  return <NamedMission onSendNamedMission={publishNamedMissionCmd} />;
};
