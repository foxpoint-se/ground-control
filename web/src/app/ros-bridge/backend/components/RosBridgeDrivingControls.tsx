import { DrivingControls } from "@/app/components/DrivingControls";
import ROSLIB from "roslib";
import {
  useMotorPublisher,
  useNavPublisher,
  useRudderXPublisher,
} from "./rosBridge";

export const RosBridgeDrivingControls = ({
  rosBridge,
  isYAxisEnabled,
  onYAxisEnabledChange,
}: {
  rosBridge: ROSLIB.Ros;
  isYAxisEnabled: boolean;
  onYAxisEnabledChange: (val: boolean) => void;
}) => {
  const { publishMotorCmd } = useMotorPublisher(rosBridge);
  const { publishRudderXCmd } = useRudderXPublisher(rosBridge);
  const { publishNavCmd } = useNavPublisher(rosBridge);
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
