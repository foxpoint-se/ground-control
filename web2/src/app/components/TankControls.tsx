import { useState } from "react";
import { Stepper, StepperLabel, StepperWrapper } from "./Stepper";

export const TankControls = ({
  onChangeRear,
  onChangeFront,
}: {
  onChangeRear: (v: number) => void;
  onChangeFront: (v: number) => void;
}) => {
  const [rearValue, setRearValue] = useState(0);
  const [frontValue, setFrontValue] = useState(0);
  const [frontValueManual, setFrontValueManual] = useState(0);
  const [rearValueManual, setRearValueManual] = useState(0);
  return (
    <div>
      <div className="flex">
        <StepperWrapper>
          <StepperLabel>Rear tank</StepperLabel>
          <Stepper
            min={0}
            max={1}
            step={0.1}
            value={rearValue}
            onChange={(v) => {
              setRearValue(v);
              onChangeRear && onChangeRear(v);
            }}
          />
        </StepperWrapper>
        <StepperWrapper>
          <StepperLabel>Front tank</StepperLabel>
          <Stepper
            min={0}
            max={1}
            step={0.1}
            value={frontValue}
            onChange={(v) => {
              setFrontValue(v);
              onChangeFront && onChangeFront(v);
            }}
          />
        </StepperWrapper>
      </div>
      <div className="flex">
        <StepperWrapper>
          <StepperLabel>Rear tank</StepperLabel>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onChangeRear && onChangeRear(rearValueManual);
            }}
          >
            <input
              type="text"
              onChange={(e) => {
                setRearValueManual(Number(e.target.value));
              }}
            />
            <input type="submit" />
          </form>
        </StepperWrapper>
        <StepperWrapper>
          <StepperLabel>Front tank</StepperLabel>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onChangeFront && onChangeFront(frontValueManual);
            }}
          >
            <input
              type="text"
              onChange={(e) => {
                setFrontValueManual(Number(e.target.value));
              }}
            />
            <input type="submit" />
          </form>
        </StepperWrapper>
      </div>
    </div>
  );
};
