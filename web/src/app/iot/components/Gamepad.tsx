import { useState } from "react";
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
}: {
  gamepadId: string;
  isConnected: boolean;
}) => {
  const displayName = gamepadId ? gamepadId : "Unknown gamepad";
  const color: "alert-info" | "" = isConnected ? "alert-info" : "";
  return (
    <div role="alert" className={`alert ${color} p-sm`}>
      {isConnected ? (
        <>
          <InfoIcon />
          <span>{displayName} connected</span>
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

export const Gamepad = ({ flipYAxes = true }: { flipYAxes?: boolean }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [gamepadId, setGamepadId] = useState("");
  const [leftAxisX, setLeftAxisX] = useState(0);
  const [leftAxisY, setLeftAxisY] = useState(0);
  const [rightAxisX, setRightAxisX] = useState(0);
  const [rightAxisY, setRightAxisY] = useState(0);

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

  return (
    <div>
      <ConnectionStatus isConnected={isConnected} gamepadId={gamepadId} />
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
    </div>
  );
};
