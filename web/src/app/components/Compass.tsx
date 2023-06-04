import { ReactNode } from "react";

const CompassCircle = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-24 w-24 rounded-full border border-neutral-500 flex justify-center items-center">
      {children}
    </div>
  );
};

const NeedleWrapper = ({
  children,
  rotation,
}: {
  children: ReactNode;
  rotation: number;
}) => {
  return (
    <div
      className="w-[4px] h-[90px] flex flex-col"
      style={{
        transform: `rotate(${rotation || 0}deg)`,
      }}
    >
      {children}
    </div>
  );
};

const NeedleTip = () => {
  return <div className="h-[50%] bg-neutral-500" />;
};

const InvisibleNeedlePart = () => {
  return <div className="h-[50%] bg-transparent" />;
};

const Needle = ({ heading }: { heading: number }) => {
  if (typeof heading !== "number") return null;

  return (
    <NeedleWrapper rotation={heading}>
      <NeedleTip />
      <InvisibleNeedlePart />
    </NeedleWrapper>
  );
};

export const Compass = ({ heading }: { heading: number }) => {
  return (
    <CompassCircle>
      <Needle heading={heading} />
    </CompassCircle>
  );
};
