import { useEffect, useState } from "react";
import { GamepadListeners, Gamepad } from "@/app/components/Gamepad";
import {
  useMotorPublisher,
  useRudderXPublisher,
  useRudderYPublisher,
} from "./useSubscribeToTopic";

export const IotGamepad = ({
  isYAxisEnabled,
  thingName,
}: {
  isYAxisEnabled: boolean;
  thingName: string;
}) => {
  // NOTE: "copying" the prop to an inner state so we can use the state setter further down
  const [shouldPublishRudderY, setShouldPublishRudderY] =
    useState(isYAxisEnabled);
  useEffect(() => {
    setShouldPublishRudderY(() => isYAxisEnabled);
  }, [isYAxisEnabled]);

  const { publishMotorCmd } = useMotorPublisher(thingName);
  const { publishRudderXCmd } = useRudderXPublisher(thingName);
  const { publishRudderYCmd } = useRudderYPublisher(thingName);

  const gamepadListeners: GamepadListeners = {
    joystick: {
      left: {
        y: {
          onChange: async (newValue: number) => {
            publishMotorCmd({ data: newValue });
          },
        },
      },
      right: {
        x: {
          onChange: async (newValue: number) => {
            publishRudderXCmd({ data: newValue });
          },
        },
        y: {
          onChange: async (newValue: number) => {
            publishRudderYCmd({ data: newValue });
          },
        },
      },
    },
  };

  return <Gamepad listeners={gamepadListeners} />;
};
