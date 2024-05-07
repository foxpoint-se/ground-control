import { DrivingControls } from "@/app/components/DrivingControls";
import {
  useMotorPublisher,
  useNavPublisher,
  useRudderXPublisher,
} from "./useSubscribeToTopic";

export const IotDrivingControls = ({
  thingName,
  isYAxisEnabled,
  onYAxisEnabledChange,
}: {
  thingName: string;
  isYAxisEnabled: boolean;
  onYAxisEnabledChange: (isEnabled: boolean) => void;
}) => {
  const { publishMotorCmd } = useMotorPublisher(thingName);
  const { publishRudderXCmd } = useRudderXPublisher(thingName);
  const { publishNavCmd } = useNavPublisher(thingName);
  return (
    <DrivingControls
      onForwards={() => {
        publishMotorCmd({ data: 1.0 });
      }}
      onBackwards={() => {
        publishMotorCmd({ data: -1.0 });
      }}
      onStop={() => {
        publishMotorCmd({ data: 0.0 });
      }}
      onLeft={() => {
        publishRudderXCmd({ data: -1.0 });
      }}
      onRight={() => {
        publishRudderXCmd({ data: 1.0 });
      }}
      onCenter={() => {
        publishRudderXCmd({ data: 0.0 });
      }}
      onAutomatic={() => {
        publishNavCmd({ data: true });
      }}
      onManual={() => {
        publishNavCmd({ data: false });
      }}
      isYAxisEnabled={isYAxisEnabled}
      onYAxisEnabledChange={onYAxisEnabledChange}
    />
  );
};
