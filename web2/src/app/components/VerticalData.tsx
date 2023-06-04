import { ReactNode } from "react";
import "../components/data-table.css";

const oneMeterInPixels = 30;
const heightOfLine = 16;
const armLength = 90;
const centerPointWidth = heightOfLine;

const gridColor = "#d0d0d0";

// const Wrapper = styled.div`
//   border: 2px solid #cecece;
//   border-radius: 4px;
//   display: flex;
//   justify-content: center;
//   padding: 10px;
//   padding-top: 20px;
//   padding-bottom: 20px;
//   width: 250px;
// `

const Wrapper = ({ children }: { children: ReactNode }) => (
  <div className="border-gray-200 border-2 rounded-sm flex justify-center p-3 py-6 w-80">
    {children}
  </div>
);

// const MeterWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   position: relative;
//   width: 100%;
// `

const MeterWrapper = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col relative w-full">{children}</div>
);

// const AnchorPointWrapper = styled.div`
//   height: ${heightOfLine}px;
//   width: ${centerPointWidth}px;
//   background-color: transparent;
//   position: relative;
// `

const AnchorPointWrapper = ({ children }: { children: ReactNode }) => (
  <div
    className="fill-transparent relative"
    style={{ height: heightOfLine, width: centerPointWidth }}
  >
    {children}
  </div>
);

// const Labels = styled.div`
//   position: absolute;
//   top: 20px;
//   left: -15px;
//   width: 100px;
// `

const Labels = ({ children }: { children: ReactNode }) => (
  <div className="absolute top-[20px] left-[-15px] w-full">{children}</div>
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

// const ArmWrapper = styled.div`
//   height: ${heightOfLine}px;
//   width: ${armLength}px;
//   display: flex;
//   position: relative;
// `

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

type WaterProps = {
  $waterLevel: number;
};

// this way is more efficient, according to styled-components
// const Water = styled.div.attrs((props) => ({
//   style: {
//     width: props.$waterLevel * 100 + '%',
//   },
// }))<WaterProps>`
//   background-color: #4fb8f2;
//   height: ${heightOfLine}px;
// `
const Water = ({ waterLevel }: { waterLevel: number }) => (
  <div
    className="bg-cyan-600"
    style={{
      width: `${waterLevel * 100}%`,
      height: heightOfLine,
    }}
  />
);

// const Air = styled.div`
//   height: ${heightOfLine}px;
//   flex-grow: 1;
//   flex-shrink: 1;
//   background-color: black;
// `

const Air = () => (
  <div className="bg-black shrink grow" style={{ height: heightOfLine }} />
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

type LevelIndicatorProps = {
  $level: number;
};

// const LevelIndicator = styled.div<LevelIndicatorProps>`
//   position: absolute;
//   top: -20px;
//   left: ${armLength / 2 - 20}px;
//   color: ${(props) => getColor(props.$level)};
// `

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
      left: `${armLength / 2 - 20}px`,
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
  const waterLevel = level;
  if (flip) {
    return (
      <ArmWrapper>
        <Air />
        <Water waterLevel={waterLevel} />
        <LevelIndicator level={level}>{round(level * 100)} %</LevelIndicator>
      </ArmWrapper>
    );
  }
  return (
    <ArmWrapper>
      <Water waterLevel={waterLevel} />
      <Air />
      <LevelIndicator level={level}>{round(level * 100)} %</LevelIndicator>
    </ArmWrapper>
  );
};

type DepthIndicatorWrapperProps = {
  $depth: number;
  $pitch: number;
};

// const DepthIndicatorWrapper = styled.div.attrs((props) => ({
//   style: {
//     transform: `rotate(${props.$pitch || 0}deg)`,
//     top: `${props.$depth * oneMeterInPixels - heightOfLine / 2}px`,
//   },
// }))<DepthIndicatorWrapperProps>`
//   display: flex;
//   position: absolute;
//   z-index: 1;
//   left: -${armLength + centerPointWidth / 2}px;
// `

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

// const VerticalLine = styled.div`
//   height: 100%;
//   width: 2px;
//   border-left: 1px solid ${gridColor};
//   position: absolute;
//   left: calc(50% - 2px);
// `

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

// const IndicatorWrapper = styled.div`
//   position: relative;
//   height: 100%;
// `

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

// const BackdropWrapper = styled.div`
//   width: 100%;
// `
const BackdropWrapper = ({ children }: { children: ReactNode }) => (
  <div className="w-full">{children}</div>
);
// const BackdropRow = styled.div`
//   width: 100%;
//   height: ${oneMeterInPixels}px;
//   border-bottom: 1px solid ${gridColor};
//   box-sizing: border-box;

//   :first-child {
//     border-top: 1px solid ${gridColor};
//   }
// `

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
  depthVelocity?: number;
  pitchVelocity?: number;
  frontTank?: number;
  rearTank?: number;
  frontTargetLevel?: number;
  frontTargetStatus?: string;
  frontIsAutocorrecting?: boolean;
  rearTargetLevel?: number;
  rearTargetStatus?: string;
  rearIsAutocorrecting?: boolean;
}

export const VerticalData = ({
  depth = 0.0,
  pitch = 0.0,
  depthVelocity = 0.0,
  pitchVelocity = 0.0,
  frontTank = 0.0,
  rearTank = 0.0,
  frontTargetLevel = undefined,
  frontTargetStatus = undefined,
  frontIsAutocorrecting = undefined,
  rearTargetLevel = undefined,
  rearTargetStatus = undefined,
  rearIsAutocorrecting = undefined,
}: VerticalDataProps) => {
  return (
    <div>
      <table style={{ marginBottom: 20 }}>
        <tbody>
          <tr>
            <td>Depth</td>
            <td>{depth && round(depth)}</td>
          </tr>
          <tr>
            <td>Depth velocity</td>
            <td>{depthVelocity && round(depthVelocity)}</td>
          </tr>
          <tr>
            <td>Pitch</td>
            <td>{pitch && round(pitch)}</td>
          </tr>
          <tr>
            <td>Pitch velocity</td>
            <td>{pitchVelocity && round(pitchVelocity)}</td>
          </tr>

          <tr>
            <td>Rear tank</td>
            <td>{rearTank && round(rearTank)}</td>
          </tr>
          <tr>
            <td>Rear target level</td>
            <td>{rearTargetLevel && round(rearTargetLevel)}</td>
          </tr>
          <tr>
            <td>Rear target status</td>
            <td>{rearTargetStatus}</td>
          </tr>
          <tr>
            <td>Rear is auto correcting</td>
            <td>
              {rearIsAutocorrecting === false
                ? "False"
                : rearIsAutocorrecting === true
                ? "True"
                : ""}
            </td>
          </tr>
          <tr>
            <td>Front tank</td>
            <td>{frontTank && round(frontTank)}</td>
          </tr>
          <tr>
            <td>Front target level</td>
            <td>{frontTargetLevel && round(frontTargetLevel)}</td>
          </tr>
          <tr>
            <td>Front target status</td>
            <td>{frontTargetStatus}</td>
          </tr>
          <tr>
            <td>Front is auto correcting</td>
            <td>
              {frontIsAutocorrecting === false
                ? "False"
                : frontIsAutocorrecting === true
                ? "True"
                : ""}
            </td>
          </tr>
        </tbody>
      </table>
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
