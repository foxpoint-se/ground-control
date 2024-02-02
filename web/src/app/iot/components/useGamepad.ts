import { useEffect, useRef } from "react";

type ButtonCallback = () => void;
type ButtonAxis = (value: number) => void;
type ButtonCallbacks = Record<number, ButtonCallback | undefined>;
type AxisCallbacks = Record<number, ButtonAxis | undefined>;

export const useGamepad = (
  buttonCallbacks: ButtonCallbacks,
  axisCallbacks: AxisCallbacks
) => {
  const gamepadRef = useRef<Gamepad | null>(null);
  const requestIdRef = useRef<number | null>(null);

  const handleButtonPress = (buttonIndex: number) => {
    const callback = buttonCallbacks[buttonIndex];
    if (callback) {
      callback();
    }
  };

  const handleAxisChange = (axisIndex: number, value: number) => {
    const callback = axisCallbacks[axisIndex];
    if (callback) {
      callback(value);
    }
  };

  const handleGamepadEvents = () => {
    const gamepads = navigator.getGamepads();
    const gamepad = gamepads[0];

    if (gamepad) {
      gamepad.buttons.forEach((button, index) => {
        if (button.pressed) {
          handleButtonPress(index);
        }
      });

      gamepad.axes.forEach((value, index) => {
        handleAxisChange(index, value);
      });

      gamepadRef.current = gamepad;
    }

    requestIdRef.current = requestAnimationFrame(handleGamepadEvents);
  };

  const handleConnect = (e: GamepadEvent) => {
    console.log("Gamepad connected", e.gamepad.id);
    handleGamepadEvents();
  };
  const handleDisconnect = (e: GamepadEvent) => {
    console.log("Gamepad disconnected", e.gamepad.id);
  };

  useEffect(() => {
    window.addEventListener("gamepadconnected", handleConnect);

    window.addEventListener("gamepaddisconnected", handleDisconnect);

    return () => {
      window.removeEventListener("gamepadconnected", handleConnect);
      window.removeEventListener("gamepaddisconnected", handleDisconnect);
    };
  }, []);

  // TODO: check if this one is messing with hot reload not able to reattach to gamepad?
  useEffect(() => {
    return () => {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, []);

  return gamepadRef.current;
};
