import { useState } from "react";
import { Panel } from "./Panel";
import { useDepthCmdPublisher } from "@/app/ros-bridge/backend/components/rosBridge";
import ROSLIB from "roslib";
import { DepthControlCmd } from "./topics";

const tuple = <T extends string[]>(...args: T) => args;
const pidOptions = tuple(
  "classic_PID",
  "P",
  "PI",
  "PD",
  "pessen_integration",
  "some_overshoot",
  "no_overshoot"
);
type PidModel = (typeof pidOptions)[number];

const PidModelSelect = ({
  onChange,
  value,
}: {
  value?: PidModel;
  onChange: (v: PidModel | undefined) => void;
}) => {
  const handleChange = (val: string) => {
    const nextModel = pidOptions.find((v) => val === v);
    onChange(nextModel);
  };
  return (
    <select
      id="route-select"
      className="select select-sm select-bordered"
      value={value}
      onChange={(e) => {
        handleChange(e.target.value);
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
  unit: string;
  step: number;
  id: string;
  label: string;
  colorClass: string;
  value: number;
  onChange: ValueCallback;
};
const Range = ({
  min,
  max,
  unit,
  step,
  id,
  label,
  colorClass,
  value,
  onChange,
}: RangeProps) => {
  return (
    <label htmlFor={id}>
      <span className="label-text">{label}</span>
      <span className="ml-md">
        {value} {unit}
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          onChange(Number(e.target.value));
        }}
        className={`range range-xs ${colorClass}`}
      />
    </label>
  );
};

type PidModelCallback = (v: PidModel | undefined) => void;

type PidModelProps = {
  pidModel?: PidModel;
  onChangePidModel: PidModelCallback;
};

type ValueCallback = (v: number) => void;

type RangeValueProps = {
  rangeValue: number;
  onChangeRangeValue: ValueCallback;
};

const Pitch = ({
  pidModel,
  onChangePidModel,
  rangeValue,
  onChangeRangeValue,
}: PidModelProps & RangeValueProps) => {
  return (
    <div className="grid grid-cols-3 gap-sm">
      <div className="col-span-2">
        <Range
          min={-45}
          max={45}
          unit={"deg"}
          step={1}
          colorClass="range-info"
          id="pitch"
          label="Pitch"
          value={rangeValue}
          onChange={onChangeRangeValue}
        />
      </div>
      <div className="col-span-1 flex items-center justify-end">
        <PidModelSelect onChange={onChangePidModel} value={pidModel} />
      </div>
    </div>
  );
};

const Depth = ({
  onChangePidModel,
  pidModel,
  onChangeRangeValue,
  rangeValue,
}: PidModelProps & RangeValueProps) => {
  return (
    <div className="grid grid-cols-3 gap-sm">
      <div className="col-span-2">
        <Range
          min={0}
          max={10}
          unit={"m"}
          step={0.1}
          colorClass="range-primary"
          id="depth"
          label="Depth"
          value={rangeValue}
          onChange={onChangeRangeValue}
        />
      </div>
      <div className="col-span-1 flex items-center justify-end">
        <PidModelSelect onChange={onChangePidModel} value={pidModel} />
      </div>
    </div>
  );
};

export const PidControls = ({
  onPublishDepthCmd,
}: {
  onPublishDepthCmd: (m: DepthControlCmd) => void;
}) => {
  const [pitchPidModel, setPitchPidModel] = useState<PidModel>();
  const [depthPidModel, setDepthPidModel] = useState<PidModel>();
  const [pitch, setPitch] = useState(0);
  const [depth, setDepth] = useState(0);

  const validForm = pitchPidModel && depthPidModel;

  const handlePublish = () => {
    if (depthPidModel && pitchPidModel) {
      onPublishDepthCmd({
        depth_pid_type: depthPidModel,
        pitch_pid_type: pitchPidModel,
        depth_target: depth,
        pitch_target: pitch,
      });
    }
  };
  return (
    <Panel>
      <div className="flex flex-col space-y-sm">
        <div className="label-text mb-sm">PID controls</div>
        <Pitch
          onChangePidModel={setPitchPidModel}
          pidModel={pitchPidModel}
          onChangeRangeValue={setPitch}
          rangeValue={pitch}
        />
        <Depth
          onChangePidModel={setDepthPidModel}
          pidModel={depthPidModel}
          onChangeRangeValue={setDepth}
          rangeValue={depth}
        />
        <div className="flex justify-end">
          <button
            className="btn btn-sm"
            disabled={!validForm}
            onClick={handlePublish}
          >
            Publish
          </button>
        </div>
      </div>
    </Panel>
  );
};
