import { useState } from "react";
import { Panel } from "./Panel";

const pidOptions = [
  "classic_PID",
  "P",
  "PI",
  "PD",
  "pessen_integration",
  "some_overshoot",
  "no_overshoot",
];

const PidModelSelect = () => {
  const [modelValue, setModelValue] = useState<string>("");
  return (
    <select
      id="route-select"
      className="select select-sm select-bordered"
      value={modelValue}
      onChange={(e) => {
        setModelValue(e.target.value);
      }}
    >
      <option value=""></option>
      {pidOptions.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
};

type RangeProps = {
  min: number;
  max: number;
  initial: number;
  unit: string;
  step: number;
  id: string;
  label: string;
  colorClass: string;
};
const Range = ({
  min,
  max,
  initial,
  unit,
  step,
  id,
  label,
  colorClass,
}: RangeProps) => {
  const [val, setVal] = useState(initial);
  return (
    <label htmlFor={id}>
      <span className="label-text">{label}</span>
      <span className="ml-md">
        {val} {unit}
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={(e) => {
          setVal(Number(e.target.value));
        }}
        className={`range range-xs ${colorClass}`}
      />
    </label>
  );
};

const Pitch = () => {
  return (
    <div className="grid grid-cols-3 gap-sm">
      <div className="col-span-2">
        <Range
          min={-45}
          max={45}
          initial={0}
          unit={"deg"}
          step={1}
          colorClass="range-info"
          id="pitch"
          label="Pitch"
        />
      </div>
      <div className="col-span-1 flex items-center justify-end">
        <PidModelSelect />
      </div>
    </div>
  );
};

const Depth = () => {
  return (
    <div className="grid grid-cols-3 gap-sm">
      <div className="col-span-2">
        <Range
          min={0}
          max={10}
          initial={0}
          unit={"m"}
          step={0.1}
          colorClass="range-primary"
          id="depth"
          label="Depth"
        />
      </div>
      <div className="col-span-1 flex items-center justify-end">
        <PidModelSelect />
      </div>
    </div>
  );
};

export const PidControls = () => {
  return (
    <Panel>
      <div className="flex flex-col space-y-sm">
        <div className="label-text mb-sm">PID controls</div>
        <Pitch />
        <Depth />
      </div>
    </Panel>
  );
};
