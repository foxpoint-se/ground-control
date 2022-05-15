import styled from 'styled-components'

const CompassCircle = styled.div`
  height: 100px;
  width: 100px;
  border-radius: 50%;
  border: 2px solid grey;
  display: flex;
  justify-content: center;

  align-items: center;
`

const NeedleWrapper = styled.div`
  width: 4px;
  height: 90px;
  display: flex;
  flex-direction: column;
  transform: rotate(${({ rotation }) => rotation || 0}deg);
`
const NeedleTip = styled.div`
  background-color: grey;
  height: 50%;
`
const InvisibleNeedlePart = styled.div`
  background-color: transparent;
  height: 50%;
`

const Needle = ({ heading }) => {
  if (typeof heading !== 'number') return null

  return (
    <NeedleWrapper rotation={heading}>
      <NeedleTip />
      <InvisibleNeedlePart />
    </NeedleWrapper>
  )
}

export const Compass = ({ heading }) => {
  return (
    <CompassCircle>
      <Needle heading={heading} />
    </CompassCircle>
  )
}
