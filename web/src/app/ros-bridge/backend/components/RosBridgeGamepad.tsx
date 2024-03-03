import ROSLIB from "roslib";
import { Gamepad, GamepadListeners } from "../../../components/Gamepad";
import {
  useMotorPublisher,
  useRudderXPublisher,
  useRudderYPublisher,
} from "./rosBridge";
import { useEffect, useState } from "react";

export const RosBridgeGamepad = ({
  rosBridge,
  isYAxisEnabled,
}: {
  rosBridge: ROSLIB.Ros;
  isYAxisEnabled: boolean;
}) => {
  // NOTE: "copying" the prop to an inner state so we can use the state setter further down
  const [shouldPublishRudderY, setShouldPublishRudderY] =
    useState(isYAxisEnabled);
  useEffect(() => {
    setShouldPublishRudderY(() => isYAxisEnabled);
  }, [isYAxisEnabled]);

  const { publishMotorCmd } = useMotorPublisher(rosBridge);
  const { publishRudderXCmd } = useRudderXPublisher(rosBridge);
  const { publishRudderYCmd } = useRudderYPublisher(rosBridge);
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
          onChange: (newValue: number) => {
            // NOTE: ugly hack to make sure that we get the correct state value
            setShouldPublishRudderY((prev) => {
              if (prev) {
                publishRudderYCmd({ data: newValue });
              }
              return prev;
            });
          },
        },
      },
    },
  };
  return <Gamepad listeners={gamepadListeners} />;
};
