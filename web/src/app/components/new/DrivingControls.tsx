import { Panel } from "./Panel";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  PauseIcon,
} from "./arrows";

type DrivingControlsProps = {
  onStop?: () => void;
  onForwards?: () => void;
  onBackwards?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onCenter?: () => void;
  onManual?: () => void;
  onAutomatic?: () => void;
};

export const DrivingControls = ({
  onAutomatic,
  onBackwards,
  onCenter,
  onForwards,
  onLeft,
  onManual,
  onRight,
  onStop,
}: DrivingControlsProps) => {
  return (
    <Panel>
      <div className="flex space-x-md items-center justify-center bg-slate-200 rounded p-xs">
        <div className="items-center">
          <button className="btn btn-square btn-error" onClick={onStop}>
            <PauseIcon />
          </button>
        </div>
        <div className="flex flex-col space-y-xs">
          <div className="flex justify-center">
            <button className="btn btn-square" onClick={onForwards}>
              <ChevronUp />
            </button>
          </div>
          <div className="flex justify-center items-center space-x-xs">
            <button className="btn btn-square" onClick={onLeft}>
              <ChevronLeft />
            </button>
            <button className="btn btn-square" onClick={onCenter}>
              C
            </button>
            <button className="btn btn-square" onClick={onRight}>
              <ChevronRight />
            </button>
          </div>
          <div className="flex justify-center">
            <button className="btn btn-square" onClick={onBackwards}>
              <ChevronDown />
            </button>
          </div>
        </div>
        <div className="flex flex-col space-y-xs">
          <button className="btn" onClick={onManual}>
            Manual
          </button>
          <button className="btn" onClick={onAutomatic}>
            Automatic
          </button>
        </div>
      </div>
    </Panel>
  );
};
