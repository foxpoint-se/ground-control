import { ReactNode } from "react";

const oneMeterInPixels = 20;
const heightOfLine = 16;
const armLength = 60;
const centerPointWidth = heightOfLine;

const gridColor = "#d0d0d0";

const Wrapper = ({ children }: { children: ReactNode }) => (
  <div className="border-gray-200 border-2 rounded-sm flex justify-center p-3 py-6 w-full">
    {children}
  </div>
);
const MeterWrapper = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col relative w-full">{children}</div>
);
const AnchorPointWrapper = ({ children }: { children: ReactNode }) => (
  <div
    className="fill-transparent relative"
    style={{ height: heightOfLine, width: centerPointWidth }}
  >
    {children}
  </div>
);

const Labels = ({ children }: { children: ReactNode }) => (
  <div className="absolute top-[20px] w-full">{children}</div>
);

const DepthAnchorPoint = ({
  depth,
  pitch,
}: {
  depth: number;
  pitch: number;
}) => {
  return (
    <AnchorPointWrapper>
      <Labels>
        <div style={{ color: getColor(pitch) }}>{round(pitch)}°</div>
        <div>{round(depth)}m</div>
      </Labels>
    </AnchorPointWrapper>
  );
};

const ArmWrapper = ({ children }: { children: ReactNode }) => (
  <div
    className="flex relative"
    style={{
      height: heightOfLine,
      width: armLength,
    }}
  >
    {children}
  </div>
);

const getColor = (level: number) => {
  let color = "blue";
  if (level > 0) {
    color = "green";
  } else if (level < 0) {
    color = "red";
  }
  return color;
};

const round = (value: number) => Math.round(value * 100) / 100;

const LevelIndicator = ({
  children,
  level,
}: {
  children: ReactNode;
  level: number;
}) => (
  <div
    className="absolute top-[20px]"
    style={{
      color: getColor(level),
      left: `${armLength / 2 - 10}px`,
    }}
  >
    {children}
  </div>
);

export const Arm = ({
  level,
  flip = false,
}: {
  level: number;
  flip?: boolean;
}) => {
  const levelInPercent = round(level * 100);

  return (
    <ArmWrapper>
      <progress
        className={`progress progress-primary h-4 ${flip ? "rotate-180" : ""}`}
        value={levelInPercent}
        max="100"
      />
      <LevelIndicator level={level}>{round(level * 100)} %</LevelIndicator>
    </ArmWrapper>
  );
};

const DepthIndicatorWrapper = ({
  children,
  depth,
  pitch,
}: {
  children: ReactNode;
  depth: number;
  pitch: number;
}) => (
  <div
    className="absolute flex z-10"
    style={{
      transform: `rotate(${pitch || 0}deg)`,
      top: `${depth * oneMeterInPixels - heightOfLine / 2}px`,
      left: `-${armLength + centerPointWidth / 2}px`,
    }}
  >
    {children}
  </div>
);

const VerticalLine = ({ children }: { children: ReactNode }) => (
  <div
    className="absolute h-full w-1"
    style={{
      borderLeft: `1px solid ${gridColor}`,
      left: "calc(50% - 2px)",
    }}
  >
    {children}
  </div>
);

const IndicatorWrapper = ({ children }: { children: ReactNode }) => (
  <div className="relative h-full">{children}</div>
);

const DepthIndicator = ({
  depth,
  pitch,
  frontTank,
  rearTank,
}: {
  depth: number;
  pitch: number;
  frontTank: number;
  rearTank: number;
}) => {
  return (
    <VerticalLine>
      <IndicatorWrapper>
        <DepthIndicatorWrapper depth={depth} pitch={pitch}>
          <Arm level={rearTank} />
          <DepthAnchorPoint depth={depth} pitch={pitch} />
          <Arm level={frontTank} flip />
        </DepthIndicatorWrapper>
      </IndicatorWrapper>
    </VerticalLine>
  );
};

const BackdropWrapper = ({ children }: { children: ReactNode }) => (
  <div className="w-full">{children}</div>
);

const BackdropRow = ({ first }: { first?: boolean }) => (
  <div
    className="w-full box-border"
    style={
      first
        ? {
            borderTop: `1px solid ${gridColor}`,
            borderBottom: `1px solid ${gridColor}`,
            height: `${oneMeterInPixels}px`,
          }
        : {
            borderBottom: `1px solid ${gridColor}`,
            height: `${oneMeterInPixels}px`,
          }
    }
  />
);

const DepthBackdrop = () => (
  <BackdropWrapper>
    <BackdropRow />
    <BackdropRow />
    <BackdropRow />
    <BackdropRow />
    <BackdropRow />
    <BackdropRow />
    <BackdropRow />
    <BackdropRow />
    <BackdropRow />
  </BackdropWrapper>
);

const DepthMeter = ({
  depth,
  pitch,
  frontTank,
  rearTank,
}: {
  depth: number;
  pitch: number;
  frontTank: number;
  rearTank: number;
}) => (
  <MeterWrapper>
    <DepthIndicator
      depth={depth}
      pitch={pitch}
      frontTank={frontTank}
      rearTank={rearTank}
    />
    <DepthBackdrop />
  </MeterWrapper>
);

interface VerticalDataProps {
  depth?: number;
  pitch?: number;
  frontTank?: number;
  rearTank?: number;
}

export const DepthVisualization = ({
  depth = 0.0,
  pitch = 0.0,
  frontTank = 0.0,
  rearTank = 0.0,
}: VerticalDataProps) => {
  return (
    <div>
      <Wrapper>
        <DepthMeter
          depth={depth}
          pitch={pitch}
          frontTank={frontTank}
          rearTank={rearTank}
        />
      </Wrapper>
    </div>
  );
};
