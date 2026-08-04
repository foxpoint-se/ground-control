import { useEffect, useState } from "react";
import { GamepadListeners, Gamepad } from "@/app/components/Gamepad";
import {
  useMotorPublisher,
  useRudderXPublisher,
  useRudderYPublisher,
} from "./useSubscribeToTopic";
import { useTeleopCommandStream } from "@/app/components/useTeleopCommandStream";

export const IotGamepad = ({
  isYAxisEnabled,
  thingName,
}: {
  isYAxisEnabled: boolean;
  thingName: string;
}) => {
  const [shouldPublishRudderY, setShouldPublishRudderY] =
    useState(isYAxisEnabled);
  useEffect(() => {
    setShouldPublishRudderY(() => isYAxisEnabled);
  }, [isYAxisEnabled]);

  const { publishMotorCmd } = useMotorPublisher(thingName);
  const { publishRudderXCmd } = useRudderXPublisher(thingName);
  const { publishRudderYCmd } = useRudderYPublisher(thingName);

  const { setMotor, setRudderX, setRudderY, start, stop } =
    useTeleopCommandStream({
      publishMotor: (value) => publishMotorCmd({ data: value }),
      publishRudderX: (value) => publishRudderXCmd({ data: value }),
      publishRudderY: (value) => publishRudderYCmd({ data: value }),
      streamRudderY: shouldPublishRudderY,
    });

  const gamepadListeners: GamepadListeners = {
    onConnect: start,
    onDisconnect: stop,
    joystick: {
      left: {
        y: {
          onChange: (newValue: number) => {
            setMotor(newValue);
          },
        },
      },
      right: {
        x: {
          onChange: (newValue: number) => {
            setRudderX(newValue);
          },
        },
        y: {
          onChange: (newValue: number) => {
            setRudderY(newValue);
          },
        },
      },
    },
  };

  return <Gamepad listeners={gamepadListeners} />;
};
