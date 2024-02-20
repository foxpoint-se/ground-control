import { useEffect, useRef } from "react";

type ButtonCallback = () => void;
export type ButtonAxis = (value: number) => void;
type ButtonCallbacks = Record<number, ButtonCallback | undefined>;
type AxisCallbacks = Record<number, ButtonAxis | undefined>;

type GamepadProps = {
  buttonCallbacks: ButtonCallbacks;
  axisCallbacks: AxisCallbacks;
  onConnect?: (gamepadId: string) => void;
  onDisconnect?: () => void;
};

export const useGamepad = (props: GamepadProps) => {
  const { buttonCallbacks, axisCallbacks, onConnect, onDisconnect } = props;
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

  const handleConnect = (connectEvent: { gamepad: { id: string } }) => {
    console.log("Gamepad connected", connectEvent.gamepad.id);
    handleGamepadEvents();
    if (onConnect) {
      onConnect(connectEvent.gamepad.id);
    }
  };
  const handleDisconnect = (disconnectEvent: { gamepad: { id: string } }) => {
    console.log("Gamepad disconnected", disconnectEvent.gamepad.id);
    if (onDisconnect) {
      onDisconnect();
    }
  };

  useEffect(() => {
    const currentGamepads = window.navigator.getGamepads();
    currentGamepads.forEach((gamepad) => {
      if (gamepad) {
        handleConnect({ gamepad });
      }
    });

    window.addEventListener("gamepadconnected", handleConnect);
    window.addEventListener("gamepaddisconnected", handleDisconnect);

    return () => {
      window.removeEventListener("gamepadconnected", handleConnect);
      window.removeEventListener("gamepaddisconnected", handleDisconnect);
      currentGamepads.forEach((gamepad) => {
        if (gamepad) {
          handleDisconnect({ gamepad });
        }
      });
    };
  }, []);

  useEffect(() => {
    return () => {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, []);

  return gamepadRef.current;
};
