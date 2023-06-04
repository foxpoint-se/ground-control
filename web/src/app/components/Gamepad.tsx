import { useEffect, useState } from "react";

type ProControllerHandlers = {
  onR3X?: (val: number) => void;
  onR3Y?: (val: number) => void;
  onL3X?: (val: number) => void;
  onL3Y?: (val: number) => void;
};

const isProController = (gamepad: Gamepad): boolean => {
  return gamepad.id.includes("Pro Controller");
};

const useGamepads = () => {
  const [gamepads, setGamepads] = useState<Gamepad[]>([]);

  const onConnect = (gamepadEvent: GamepadEvent) => {
    const gamepad = gamepadEvent.gamepad;
    setGamepads([...gamepads, gamepad]);
  };
  const onDisconnect = (gamepadEvent: GamepadEvent) => {
    const gamepad = gamepadEvent.gamepad;
    setGamepads(gamepads.filter((v) => v.id !== gamepad.id));
  };

  useEffect(() => {
    window.addEventListener("gamepadconnected", onConnect);
    window.addEventListener("gamepaddisconnected", onDisconnect, false);

    return () => {
      window.removeEventListener("gamepadconnected", onConnect);
      window.removeEventListener("gamepaddisconnected", onDisconnect);
    };
  }, []);

  return {
    gamepads,
  };
};

const useProControllerChanges = (handlers: ProControllerHandlers) => {
  const [r3X, setR3X] = useState(0);
  const [l3x, setL3x] = useState(0);

  const onr3y = (val: number) => {
    setR3X((prev) => {
      if (prev !== val) {
        const handler = handlers.onR3Y;
        if (handler) {
          handler(val);
        }
        return val;
      }
      return prev;
    });
  };

  const onl3x = (val: number) => {
    setL3x((prev) => {
      if (prev !== val) {
        const handler = handlers.onL3X;
        if (handler) {
          handler(val);
        }

        return val;
      }
      return prev;
    });
  };

  const changeHandlers: ProControllerHandlers = {
    onL3X: onl3x,
    onR3Y: onr3y,
  };

  return {
    changeHandlers,
  };
};

const useProController = (handlers: ProControllerHandlers) => {
  const [isConnected, setIsConnected] = useState(false);
  const { gamepads } = useGamepads();
  const proController = gamepads.find(isProController);
  const { changeHandlers } = useProControllerChanges(handlers);
  const axisHandlers: AxisHandlers = {
    0: changeHandlers.onL3X || console.log,
    3: changeHandlers.onR3Y || console.log,
  };

  useGamepadLoop(proController, axisHandlers, {}, 100);

  useEffect(() => {
    if (proController?.connected) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [proController]);

  return {
    isConnected,
  };
};

type AxisHandler = (value: number) => void;

type ButtonHandler = (pressed: boolean) => void;

type AxisHandlers = Record<number, AxisHandler>;

type ButtonHandlers = Record<number, ButtonHandler>;

const useGamepadLoop = (
  gamepad?: Gamepad,
  axisHandlers: AxisHandlers = {},
  buttonHandlers: ButtonHandlers = {},
  loopIntervalMs = 1_000
) => {
  let interval: NodeJS.Timer | undefined;

  const tryClearInterval = (interval: NodeJS.Timer | undefined) => {
    if (interval) {
      clearInterval(interval);
    }
  };

  const readGamepad = (gamepad: Gamepad) => {
    Object.entries(axisHandlers).forEach(([axisKey, handler]) => {
      if (handler) {
        const axisValue = gamepad.axes[Number(axisKey)] as number | undefined;
        if (axisValue !== undefined) {
          handler(axisValue);
        }
      }
    });
    Object.entries(buttonHandlers).forEach(([buttonKey, handler]) => {
      if (handler) {
        const button = gamepad.buttons[Number(buttonKey)] as
          | GamepadButton
          | undefined;
        if (button) {
          handler(button.pressed);
        }
      }
    });
  };

  useEffect(() => {
    if (gamepad?.connected) {
      interval = setInterval(() => {
        readGamepad(gamepad);
      }, loopIntervalMs);
    } else {
      tryClearInterval(interval);
    }
    return () => {
      tryClearInterval(interval);
    };
  }, [gamepad?.connected]);
};

export const Gamepad = ({
  sendMotorCommand,
  sendRudderCommand,
  onConnectionChange,
}: {
  sendMotorCommand: (val: number) => void;
  sendRudderCommand: (val: number) => void;
  onConnectionChange: (isConnected: boolean) => void;
}) => {
  const { isConnected } = useProController({
    onR3Y: (val) => {
      sendMotorCommand(-val); // controller gives negative values for UP
    },
    onL3X: (val) => {
      sendRudderCommand(val);
    },
  });

  useEffect(() => {
    onConnectionChange(isConnected);
  }, [isConnected]);

  return null;
};
