import { SetStateAction, useRef, useState } from "react";
import { ButtonAxis, useGamepad } from "./useGamepad";
import { InfoIcon } from "./icons";

// Axis 0 --> left Y
// Axis 1 --> left X

// Button 0 --> A
// Button 1 --> B

type SN30ProPlusButton = "A" | "B";

const SN30ProPlusButtonMapping: Record<SN30ProPlusButton, number> = {
  A: 0,
  B: 1,
};

type SN30ProPlusAxis = "LeftY" | "LeftX" | "RightY" | "RightX";

const SN30ProPlusAxisMapping: Record<SN30ProPlusAxis, number> = {
  LeftX: 0,
  LeftY: 1,
  RightX: 2,
  RightY: 3,
};

const ConnectionStatus = ({
  gamepadId,
  isConnected,
  action,
}: {
  gamepadId: string;
  isConnected: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}) => {
  const displayName = gamepadId ? gamepadId : "Unknown gamepad";
  const color: "alert-info" | "" = isConnected ? "alert-info" : "";
  return (
    <div
      role="alert"
      className={`alert ${color} p-sm flex items-center flex-wrap gap-xs justify-between`}
    >
      {isConnected ? (
        <>
          <span className="flex items-center space-x-sm overflow-hidden">
            <InfoIcon />
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              {displayName} connected
            </span>
          </span>
          {action && (
            <div>
              <button
                className="btn btn-xs btn-neutral whitespace-nowrap"
                onClick={action.onClick}
              >
                {action.label}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center gap-xs">
          <InfoIcon />
          <span>Gamepad not connected</span>
        </div>
      )}
    </div>
  );
};

type GamepadValues = {
  leftAxisY: number;
  leftAxisX: number;
  rightAxisY: number;
  rightAxisX: number;
};

const DebugTable = (props: GamepadValues) => {
  const { leftAxisX, leftAxisY, rightAxisX, rightAxisY } = props;
  return (
    <table className="table table-sm table-fixed">
      <thead>
        <tr>
          <th>Button</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Left axis</td>
          <td>
            <table className="table table-sm table-fixed">
              <thead>
                <tr>
                  <th>&#8597;</th>
                  <th>&#8596;</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {leftAxisY}
                  </td>
                  <td className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {leftAxisX}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td>Right axis</td>
          <td>
            <table className="table table-sm table-fixed">
              <thead>
                <tr>
                  <th>&#8597;</th>
                  <th>&#8596;</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {rightAxisY}
                  </td>
                  <td className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {rightAxisX}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

type AxisOnChange = (newValue: number) => void;
type AxisListener = {
  onChange: AxisOnChange;
};

type JoystickListener = {
  x?: AxisListener;
  y?: AxisListener;
};

export type GamepadListeners = {
  joystick?: {
    left?: JoystickListener;
    right?: JoystickListener;
  };
};

// On Android, the centered value is not 0.0, but instead 0.00392150...
const ANDROID_CENTERED_THRESHOLD = 0.005;
const uglyHandleAndroidAxisNotCentered = (val: number): number => {
  if (Math.abs(val) < ANDROID_CENTERED_THRESHOLD) {
    return 0;
  }
  return val;
};

const createAxisCallback = (
  stateSetter: (value: SetStateAction<number>) => void,
  flipPolarity: boolean = false,
  changeHandler?: AxisOnChange
): ButtonAxis => {
  return (value: number) => {
    stateSetter((prev) => {
      const maybeFlipped = flipPolarity ? -value : value;
      const newValue = uglyHandleAndroidAxisNotCentered(maybeFlipped);
      if (prev !== newValue) {
        if (changeHandler) {
          changeHandler(newValue);
        }
      }
      return newValue;
    });
  };
};

export const Gamepad = ({ listeners }: { listeners?: GamepadListeners }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [gamepadId, setGamepadId] = useState("");
  const [leftAxisX, setLeftAxisX] = useState(0);
  const [leftAxisY, setLeftAxisY] = useState(0);
  const [rightAxisX, setRightAxisX] = useState(0);
  const [rightAxisY, setRightAxisY] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const gamepad = useGamepad({
    buttonCallbacks: {
      [SN30ProPlusButtonMapping.A]: () => console.log("Pressed A"),
      [SN30ProPlusButtonMapping.B]: () => console.log("Pressed B"),
    },
    axisCallbacks: {
      [SN30ProPlusAxisMapping.LeftX]: createAxisCallback(
        setLeftAxisX,
        false,
        listeners?.joystick?.left?.x?.onChange
      ),
      [SN30ProPlusAxisMapping.LeftY]: createAxisCallback(
        setLeftAxisY,
        true,
        listeners?.joystick?.left?.y?.onChange
      ),
      [SN30ProPlusAxisMapping.RightX]: createAxisCallback(
        setRightAxisX,
        false,
        listeners?.joystick?.right?.x?.onChange
      ),
      [SN30ProPlusAxisMapping.RightY]: createAxisCallback(
        setRightAxisY,
        true,
        listeners?.joystick?.right?.y?.onChange
      ),
    },
    onConnect: (gamepadId: string) => {
      setIsConnected(true);
      setGamepadId(gamepadId);
    },
    onDisconnect: () => {
      setIsConnected(false);
    },
  });

  const handleOpenDebugClick = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  return (
    <div>
      <ConnectionStatus
        isConnected={isConnected}
        gamepadId={gamepadId}
        action={{ label: "Open debug", onClick: handleOpenDebugClick }}
      />
      <dialog id="debug-modal" className={`modal`} ref={dialogRef}>
        <div className="modal-box absolute top-lg">
          <DebugTable
            leftAxisX={leftAxisX}
            leftAxisY={leftAxisY}
            rightAxisX={rightAxisX}
            rightAxisY={rightAxisY}
          />
        </div>
        <form
          method="dialog"
          className="modal-backdrop bg-neutral-700 opacity-20"
        >
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};
