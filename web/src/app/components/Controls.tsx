import { ReactNode, useState } from "react";
import { Gamepad } from "./Gamepad";

const Buttons = ({ children }: { children: ReactNode }) => {
  return <div className="flex items-center">{children}</div>;
};

interface ControlsProps {
  onArrowUp: () => void;
  onArrowDown: () => void;
  onArrowLeft: () => void;
  onArrowRight: () => void;
  onCenterClick: () => void;
  onAutoClick: () => void;
  onManualClick: () => void;
  sendMotorCommand: (val: number) => void;
  sendHorizontalRudderCommand: (val: number) => void;
  sendVerticalRudderCommand: (val: number) => void;
  updateDepthTarget: (val: number) => void;
}

export const Controls = ({
  sendMotorCommand,
  sendHorizontalRudderCommand,
  sendVerticalRudderCommand,
  updateDepthTarget,
}: ControlsProps) => {
  const [isGamepadConnected, setIsGamepadConnected] = useState(false);

  return (
    <div>
      <Buttons>
        <div className="ml-8">
          <Gamepad
            onConnectionChange={(isConnected) =>
              setIsGamepadConnected(isConnected)
            }
            sendMotorCommand={sendMotorCommand}
            sendHorizontalRudderCommand={sendHorizontalRudderCommand}
            sendVerticalRudderCommand={sendVerticalRudderCommand}
            updateDepthTarget={updateDepthTarget} // TODO: this one!
          />
        </div>
      </Buttons>
    </div>
  );
};
