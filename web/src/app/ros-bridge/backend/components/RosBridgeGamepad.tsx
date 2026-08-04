import ROSLIB from "roslib";
import { Gamepad, GamepadListeners } from "../../../components/Gamepad";
import {
  useMotorPublisher,
  useRudderXPublisher,
  useRudderYPublisher,
} from "./rosBridge";
import { useEffect, useState } from "react";
import { useTeleopCommandStream } from "@/app/components/useTeleopCommandStream";

export const RosBridgeGamepad = ({
  rosBridge,
  isYAxisEnabled,
}: {
  rosBridge: ROSLIB.Ros;
  isYAxisEnabled: boolean;
}) => {
  const [shouldPublishRudderY, setShouldPublishRudderY] =
    useState(isYAxisEnabled);
  useEffect(() => {
    setShouldPublishRudderY(() => isYAxisEnabled);
  }, [isYAxisEnabled]);

  const { publishMotorCmd } = useMotorPublisher(rosBridge);
  const { publishRudderXCmd } = useRudderXPublisher(rosBridge);
  const { publishRudderYCmd } = useRudderYPublisher(rosBridge);

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
