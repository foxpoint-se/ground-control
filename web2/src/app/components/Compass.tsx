// const CompassCircle = styled.div`
//   height: 100px;
//   width: 100px;
//   border-radius: 50%;
//   border: 2px solid grey;
//   display: flex;
//   justify-content: center;

import { ReactNode } from "react";

//   align-items: center;
// `

const CompassCircle = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-24 w-24 rounded-full border border-neutral-500 flex justify-center items-center">
      {children}
    </div>
  );
};

// const NeedleWrapper = styled.div`
//   width: 4px;
//   height: 90px;
//   display: flex;
//   flex-direction: column;
//   transform: rotate(${({ rotation }) => rotation || 0}deg);
//   `

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
// const NeedleTip = styled.div`
//   background-color: grey;
//   height: 50%;
// `;

const NeedleTip = () => {
  return <div className="h-[50%] bg-neutral-500" />;
};

//   const InvisibleNeedlePart = styled.div`
//   background-color: transparent;
//   height: 50%;
//   `;

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
