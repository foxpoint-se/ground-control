import { useState } from "react";
import { Panel } from "./Panel";

const TankControl = ({
  tank,
  label,
  onPublish,
}: {
  tank: "front" | "rear";
  label: string;
  onPublish: TankPublisher;
}) => {
  const [levelInput, setLevelInput] = useState(0);

  return (
    <div className="grid grid-cols-4 gap-sm">
      <div className="col-span-3">
        <label htmlFor={tank}>
          <span className="label-text">{label}</span>
          <span className="ml-md">{levelInput} %</span>
          <input
            id={tank}
            type="range"
            min={0}
            max="100"
            step={1}
            value={levelInput}
            onChange={(e) => {
              setLevelInput(Number(e.target.value));
            }}
            className="range range-secondary range-xs"
          />
        </label>
      </div>
      <div className="col-span-1 flex items-center justify-end">
        <button
          className="btn btn-sm"
          onClick={() => {
            onPublish(levelInput / 100);
          }}
        >
          Publish
        </button>
      </div>
    </div>
  );
};

type TankPublisher = (v: number) => void;

type TankControlsProps = {
  onPublishFront: TankPublisher;
  onPublishRear: TankPublisher;
};

export const TankControls = ({
  onPublishFront,
  onPublishRear,
}: TankControlsProps) => {
  return (
    <Panel>
      <div className="label-text mb-sm">Tank controls</div>
      <div className="flex flex-col space-y-sm">
        <TankControl tank="front" label="Front" onPublish={onPublishFront} />
        <TankControl tank="rear" label="Rear" onPublish={onPublishRear} />
      </div>
    </Panel>
  );
};
