import { useState } from "react";
import { useGamepad } from "./useGamepad";

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

// TODO: get connected state back
// set the initial values when connected, otherwise undefined?

// 8BitDo SN30 Pro+ (Vendor: 2dc8 Product: 6102)
export const Gamepad = ({ flipYAxes = true }: { flipYAxes?: boolean }) => {
  const [leftAxisX, setLeftAxisX] = useState(0);
  const [leftAxisY, setLeftAxisY] = useState(0);
  const [rightAxisX, setRightAxisX] = useState(0);
  const [rightAxisY, setRightAxisY] = useState(0);
  const gamepad = useGamepad(
    {
      [SN30ProPlusButtonMapping.A]: () => console.log("Pressed A"),
      [SN30ProPlusButtonMapping.B]: () => console.log("Pressed B"),
    },
    {
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
    }
  );

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
