import { memo } from "react";

export const Toggle2 = ({
  isToggledOn,
  onToggleChange,
  label,
}: {
  isToggledOn: boolean;
  label: string;
  onToggleChange: (isToggledOn: boolean) => void;
}) => {
  return (
    <label className="cursor-pointer label justify-start space-x-md">
      <span className="label-text">{label}</span>
      <input
        type="checkbox"
        onChange={(e) => {
          onToggleChange(e.target.checked);
        }}
        className="toggle toggle-primary"
        checked={isToggledOn}
      />
    </label>
  );
};

export const Toggle = memo(Toggle2);
