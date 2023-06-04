import { InputHTMLAttributes, ReactNode } from "react";

const Input = (props: InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="text-md stepper" />
);

export const StepperWrapper = ({ children }: { children: ReactNode }) => (
  <div className="border border-neutral-400 rounded-sm p-2 ml-3 flex flex-col">
    {children}
  </div>
);

export const StepperLabel = ({ children }: { children: ReactNode }) => (
  <span className="text-sm mb-2">{children}</span>
);

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

export const Stepper = ({ value, onChange, min, max, step }: StepperProps) => {
  return (
    <div className="flex">
      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          let newValue = Number(e.target.value);
          if (newValue > max) newValue = max;
          else if (newValue < min) newValue = min;
          newValue = Math.round(newValue * 10) / 10;
          onChange(newValue);
        }}
      />
      <div className="flex flex-col ml-2">
        <button
          className="btn btn-neutral"
          tabIndex={-1}
          onClick={() => {
            let newValue = value + step;
            newValue = newValue > max ? max : newValue;
            newValue = Math.round(newValue * 10) / 10;
            onChange(newValue);
          }}
        >
          &#9650;
        </button>
        <button
          tabIndex={-1}
          className="btn btn-neutral"
          onClick={() => {
            let newValue = value - step;
            newValue = newValue < min ? min : newValue;
            newValue = Math.round(newValue * 10) / 10;
            onChange(newValue);
          }}
        >
          &#9660;
        </button>
      </div>
    </div>
  );
};
