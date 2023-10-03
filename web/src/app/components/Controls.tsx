import { ReactNode, useEffect, useState } from "react";
import { Gamepad } from "./Gamepad";
import { useKeyPress } from "./useKeyPress";

const Buttons = ({ children }: { children: ReactNode }) => {
  return <div className="flex items-center">{children}</div>;
};

const ButtonCol = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col">{children}</div>;
};

const CommandButton = ({
  children,
  onClick,
  pressed,
}: {
  children: ReactNode;
  onClick: () => void;
  pressed?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={`btn py-3 px-4 m-1 min-w-24 first:ml-0 ${
        pressed ? "active" : ""
      }`}
    >
      {children}
    </button>
  );
};

const GPStatus = ({
  children,
  isConnected,
}: {
  children: ReactNode;
  isConnected: boolean;
}) => {
  return (
    <div
      className="flex items-center p-2 mt-3 rounded border"
      style={{
        backgroundColor: isConnected ? "#e8f8fd" : "#ededed",
        color: isConnected ? "#505078" : "#6f6f6f",
      }}
    >
      {children}
    </div>
  );
};

const InfoIcon = () => <Circle>ℹ</Circle>;

const Circle = ({ children }: { children: ReactNode }) => {
  return (
    <div className="rounded-full h-8 w-8 border border-neutral-300 flex items-center justify-center text-md mr-4 shrink-0">
      {children}
    </div>
  );
};

const KeyButton = ({
  targetKey,
  label,
  onPress,
  keyPressEnabled,
}: {
  targetKey: string;
  label: string;
  onPress: () => void;
  keyPressEnabled?: boolean;
}) => {
  const keyPressed = useKeyPress(targetKey);

  useEffect(() => {
    if (keyPressEnabled && keyPressed) {
      onPress();
    }
  }, [keyPressEnabled, keyPressed]);

  return (
    <CommandButton onClick={onPress} pressed={keyPressEnabled && keyPressed}>
      {label}
    </CommandButton>
  );
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
  onArrowUp,
  onArrowDown,
  onArrowLeft,
  onArrowRight,
  onCenterClick,
  onAutoClick,
  onManualClick,
  sendMotorCommand,
  sendHorizontalRudderCommand,
  sendVerticalRudderCommand,
  updateDepthTarget,
}: ControlsProps) => {
  const [keyPressEnabled, setKeyPressEnabled] = useState(false);
  const [isGamepadConnected, setIsGamepadConnected] = useState(false);

  return (
    <div>
      <Buttons>
        <ButtonCol>
          <KeyButton
            label="&#5130;"
            targetKey="ArrowLeft"
            onPress={onArrowLeft}
            keyPressEnabled={keyPressEnabled}
          />
        </ButtonCol>
        <ButtonCol>
          <KeyButton
            label="&#5123;"
            targetKey="ArrowUp"
            onPress={onArrowUp}
            keyPressEnabled={keyPressEnabled}
          />
          <KeyButton
            label="Center"
            targetKey="c"
            onPress={onCenterClick}
            keyPressEnabled={keyPressEnabled}
          />
          <KeyButton
            label="&#5121;"
            targetKey="ArrowDown"
            onPress={onArrowDown}
            keyPressEnabled={keyPressEnabled}
          />
        </ButtonCol>
        <ButtonCol>
          <KeyButton
            label="&#5125;"
            targetKey="ArrowRight"
            onPress={onArrowRight}
            keyPressEnabled={keyPressEnabled}
          />
        </ButtonCol>
        <div className="ml-8">
          <div className="flex">
            <KeyButton
              label="Manual"
              targetKey="m"
              onPress={onManualClick}
              keyPressEnabled={keyPressEnabled}
            />
            <KeyButton
              label="Automatic"
              targetKey="a"
              onPress={onAutoClick}
              keyPressEnabled={keyPressEnabled}
            />
          </div>

          <div style={{ marginTop: 8 }}>
            <button
              className="btn"
              onClick={() => {
                setKeyPressEnabled((prev) => !prev);
              }}
            >
              KeyPress commands {keyPressEnabled ? "✅" : "❌"}
            </button>
          </div>
          <div>
            <GPStatus isConnected={isGamepadConnected}>
              <InfoIcon />
              <div>
                {isGamepadConnected
                  ? "Gamepad is connected"
                  : "Gamepad is not connected"}
              </div>
            </GPStatus>
          </div>
          <Gamepad
            onConnectionChange={(isConnected) =>
              setIsGamepadConnected(isConnected)
            }
            sendMotorCommand={sendMotorCommand}
            sendHorizontalRudderCommand={sendHorizontalRudderCommand}
            sendVerticalRudderCommand={sendVerticalRudderCommand}
            updateDepthTarget={updateDepthTarget}
          />
        </div>
      </Buttons>
    </div>
  );
};
