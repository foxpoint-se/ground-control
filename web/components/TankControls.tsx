import styled from 'styled-components'
import { useState } from 'react'
import { Stepper } from './Stepper'

const Tanks = styled.div`
  display: flex;
`
const StepperWrapper = styled.div`
  background-color: #eeeeee;
  border-radius: 4px;
  padding: 6px;
  margin: 4px;
  display: flex;
  flex-direction: column;
`

const TankLabel = styled.span`
  font-size: 10px;
  margin-bottom: 4px;
`

export const TankControls = ({ onChangeRear, onChangeFront }) => {
  const [rearValue, setRearValue] = useState(0)
  const [frontValue, setFrontValue] = useState(0)
  return (
    <div>
      <Tanks>
        <StepperWrapper>
          <TankLabel>Rear tank</TankLabel>
          <Stepper
            min={0}
            max={1}
            step={0.1}
            value={rearValue}
            onChange={(v) => {
              setRearValue(v)
              onChangeRear && onChangeRear(v)
            }}
          />
        </StepperWrapper>
        <StepperWrapper>
          <TankLabel>Front tank</TankLabel>
          <Stepper
            min={0}
            max={1}
            step={0.1}
            value={frontValue}
            onChange={(v) => {
              setFrontValue(v)
              onChangeFront && onChangeFront(v)
            }}
          />
        </StepperWrapper>
      </Tanks>
    </div>
  )
}
