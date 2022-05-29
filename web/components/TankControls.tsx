import styled from 'styled-components'
import { useState } from 'react'
import { Stepper, StepperLabel, StepperWrapper } from './Stepper'

const Tanks = styled.div`
  display: flex;
`

export const TankControls = ({ onChangeRear, onChangeFront }) => {
  const [rearValue, setRearValue] = useState(0)
  const [frontValue, setFrontValue] = useState(0)
  return (
    <div>
      <Tanks>
        <StepperWrapper>
          <StepperLabel>Rear tank</StepperLabel>
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
          <StepperLabel>Front tank</StepperLabel>
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
