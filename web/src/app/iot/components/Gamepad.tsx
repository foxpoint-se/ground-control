import { useRef, useState } from "react";
import { useGamepad } from "./useGamepad";
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
    <div role="alert" className={`alert ${color} p-sm flex items-center`}>
      {isConnected ? (
        <>
          <InfoIcon />
          <span className="whitespace-nowrap overflow-hidden text-ellipsis">
            {displayName} connected
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
        <>
          <InfoIcon />
          <span>Gamepad not connected</span>
        </>
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

export const Gamepad = ({ flipYAxes = true }: { flipYAxes?: boolean }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [gamepadId, setGamepadId] = useState("");
  const [showDebug, setShowDebug] = useState(false);
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
      [SN30ProPlusAxisMapping.LeftX]: (value) => {
        setLeftAxisX(value);
      },
      [SN30ProPlusAxisMapping.LeftY]: (value) => {
        const newValue = flipYAxes ? -value : value;
        setLeftAxisY(newValue);
      },
      [SN30ProPlusAxisMapping.RightX]: setRightAxisX,
      [SN30ProPlusAxisMapping.RightY]: (value) => {
        const newValue = flipYAxes ? -value : value;
        setRightAxisY(newValue);
      },
    },
    onConnect: (gamepadId: string) => {
      setIsConnected(true);
      setGamepadId(gamepadId);
    },
    onDisconnect: () => {
      setIsConnected(true);
    },
  });

  const handleOpenDebugClick = () => {
    // const handleClick = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
    // };
    // const newState = !showDebug;
    // setShowDebug(newState);
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
