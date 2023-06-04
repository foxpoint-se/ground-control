import { useState } from "react";
import { DepthControlCmd } from "./types";
import { Stepper, StepperLabel, StepperWrapper } from "./Stepper";
import { Button } from "./button/Button";

const pidOptions = [
  "classic_PID",
  "P",
  "PI",
  "PD",
  "pessen_integration",
  "some_overshoot",
  "no_overshoot",
];

interface Props {
  onSubmit: (cmd: DepthControlCmd) => void;
}

export const DepthAndPitchControls = ({ onSubmit }: Props) => {
  const [pitch, setPitch] = useState<number>(0);
  const [depth, setDepth] = useState<number>(0);
  const [pitchPidType, setPitchPidType] = useState<string>("");
  const [depthPidType, setDepthPidType] = useState<string>("");

  const enabled =
    pitch !== undefined &&
    depth !== undefined &&
    pitchPidType !== "" &&
    depthPidType !== "";

  return (
    <div className="flex mb-8">
      <StepperWrapper>
        <select
          className="mb-4"
          value={pitchPidType}
          onChange={(e) => {
            setPitchPidType(e.target.value);
          }}
        >
          <option value=""></option>
          {pidOptions.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <StepperLabel>Pitch</StepperLabel>
        <Stepper
          min={-90}
          max={90}
          step={5}
          value={pitch || 0}
          onChange={(v) => {
            setPitch(Number(v));
          }}
        />
      </StepperWrapper>
      <StepperWrapper>
        <select
          className="mb-4"
          value={depthPidType}
          onChange={(e) => {
            setDepthPidType(e.target.value);
          }}
        >
          <option value=""></option>
          {pidOptions.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <StepperLabel>Depth</StepperLabel>
        <Stepper
          min={0}
          max={10}
          step={0.1}
          value={depth || 0}
          onChange={(v) => {
            setDepth(Number(v));
          }}
        />
      </StepperWrapper>
      <div className="flex items-end ml-3">
        <Button
          variant="primary"
          disabled={!enabled}
          onClick={() => {
            onSubmit({
              depth_pid_type: depthPidType,
              depth_target: depth,
              pitch_pid_type: pitchPidType,
              pitch_target: pitch,
            });
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};
