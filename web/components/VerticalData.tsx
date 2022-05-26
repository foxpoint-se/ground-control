import styled from 'styled-components'
import { DataTable } from './styles'

const oneMeterInPixels = 30
const heightOfLine = 16
const armLength = 90
const centerPointWidth = heightOfLine

const gridColor = '#d0d0d0'

const Wrapper = styled.div`
  border: 2px solid #cecece;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  padding: 10px;
  padding-top: 20px;
  padding-bottom: 20px;
  width: 250px;
`

const MeterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
`

const AnchorPointWrapper = styled.div`
  height: ${heightOfLine}px;
  width: ${centerPointWidth}px;
  background-color: transparent;
  position: relative;
`

const Labels = styled.div`
  position: absolute;
  top: 20px;
  left: -15px;
  width: 100px;
`

const DepthAnchorPoint = ({ depth, pitch }) => {
  return (
    <AnchorPointWrapper>
      <Labels>
        <div style={{ color: getColor(pitch) }}>{round(pitch)}°</div>
        <div>{round(depth)}m</div>
      </Labels>
    </AnchorPointWrapper>
  )
}

const ArmWrapper = styled.div`
  height: ${heightOfLine}px;
  width: ${armLength}px;
  display: flex;
  position: relative;
`

// this way is more efficient, according to styled-components
const Water = styled.div.attrs(({ waterLevel }) => ({
  style: {
    width: `${waterLevel * 100}%`,
  },
}))`
  background-color: #4fb8f2;
  height: ${heightOfLine}px;
`

const Air = styled.div`
  height: ${heightOfLine}px;
  flex-grow: 1;
  flex-shrink: 1;
  background-color: black;
`

const getColor = (level) => {
  let color = 'blue'
  if (level > 0) {
    color = 'green'
  } else if (level < 0) {
    color = 'red'
  }
  return color
}

const round = (value) => Math.round(value * 100) / 100

const LevelIndicator = styled.div`
  position: absolute;
  top: -20px;
  left: ${armLength / 2 - 20}px;
  color: ${({ level }) => getColor(level)};
`

const Arm = ({ level, flip = false }) => {
  const waterLevel = level
  if (flip) {
    return (
      <ArmWrapper>
        <Air />
        <Water waterLevel={waterLevel} />
        <LevelIndicator level={level}>{round(level * 100)} %</LevelIndicator>
      </ArmWrapper>
    )
  }
  return (
    <ArmWrapper>
      <Water waterLevel={waterLevel} />
      <Air />
      <LevelIndicator level={level}>{round(level * 100)} %</LevelIndicator>
    </ArmWrapper>
  )
}

const DepthIndicatorWrapper = styled.div.attrs(({ depth, pitch }) => ({
  style: {
    transform: `rotate(${pitch || 0}deg)`,
    top: `${depth * oneMeterInPixels - heightOfLine / 2}px`,
  },
}))`
  display: flex;
  position: absolute;
  z-index: 1;
  left: -${armLength + centerPointWidth / 2}px;
`

const VerticalLine = styled.div`
  height: 100%;
  width: 2px;
  border-left: 1px solid ${gridColor};
  position: absolute;
  left: calc(50% - 2px);
`

const IndicatorWrapper = styled.div`
  position: relative;
  height: 100%;
`

const DepthIndicator = ({ depth, pitch, frontTank, rearTank }) => {
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
  )
}

const gridBorderWidth = 1
const Table = styled.table`
  width: 100%;
  border: 1px solid ${gridColor};
  td {
    /* box-sizing: border-box; */
    height: ${oneMeterInPixels - gridBorderWidth}px;
    border-bottom: ${gridBorderWidth}px solid ${gridColor};
  }
`

const BackdropWrapper = styled.div`
  width: 100%;
`
const BackdropRow = styled.div`
  width: 100%;
  height: ${oneMeterInPixels}px;
  border-bottom: 1px solid ${gridColor};
  box-sizing: border-box;

  :first-child {
    border-top: 1px solid ${gridColor};
  }
`

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
)

const DepthMeter = ({ depth, pitch, frontTank, rearTank }) => (
  <MeterWrapper>
    <DepthIndicator depth={depth} pitch={pitch} frontTank={frontTank} rearTank={rearTank} />
    <DepthBackdrop />
  </MeterWrapper>
)

interface VerticalDataProps {
  depth?: number
  pitch?: number
  frontTank?: number
  rearTank?: number
  frontTargetLevel?: number
  frontTargetStatus?: string
  frontIsAutocorrecting?: boolean
  rearTargetLevel?: number
  rearTargetStatus?: string
  rearIsAutocorrecting?: boolean
}

export const VerticalData = ({
  depth = 0.0,
  pitch = 0.0,
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
      <DataTable style={{ marginBottom: 20 }}>
        <tbody>
          <tr>
            <td>Depth</td>
            <td>{depth && round(depth)}</td>
          </tr>
          <tr>
            <td>Pitch</td>
            <td>{pitch && round(pitch)}</td>
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
                ? 'False'
                : rearIsAutocorrecting === true
                ? 'True'
                : ''}
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
                ? 'False'
                : frontIsAutocorrecting === true
                ? 'True'
                : ''}
            </td>
          </tr>
        </tbody>
      </DataTable>
      <Wrapper>
        <DepthMeter depth={depth} pitch={pitch} frontTank={frontTank} rearTank={rearTank} />
      </Wrapper>
    </div>
  )
}
