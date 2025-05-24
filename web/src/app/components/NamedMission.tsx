import { useState } from "react";
import { Panel } from "./Panel";
import { Toggle } from "./Toggle";

export const NamedMission = ({
  onSendNamedMission,
}: {
  onSendNamedMission: ({ data }: { data: string }) => void;
}) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const onRotholmenClick = () => {
    onSendNamedMission({ data: "rotholmen_runt_2025" });
  };
  return (
    <Panel>
      <div className="flex flex-col gap-sm">
        <Toggle
          isToggledOn={!isDisabled}
          onToggleChange={() => {
            setIsDisabled((prev) => !prev);
          }}
          label="Enabled?"
        />
      </div>
      <button className="btn" onClick={onRotholmenClick} disabled={isDisabled}>
        Rotholmen runt 2025
      </button>
    </Panel>
  );
};
