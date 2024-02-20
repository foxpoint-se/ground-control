import ROSLIB from "roslib";
import { Gamepad, GamepadListeners } from "../../../components/Gamepad";
import {
  useMotorPublisher,
  useRudderXPublisher,
  useRudderYPublisher,
} from "./rosBridge";

export const RosBridgeGamepad = ({ rosBridge }: { rosBridge: ROSLIB.Ros }) => {
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
          onChange: async (newValue: number) => {
            publishRudderYCmd({ data: newValue });
          },
        },
      },
    },
  };
  return <Gamepad listeners={gamepadListeners} />;
};
