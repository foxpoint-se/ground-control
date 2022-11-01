import styled from 'styled-components'
import { useState } from 'react'
import { Stepper, StepperLabel, StepperWrapper } from './Stepper'

const Tanks = styled.div`
  display: flex;
`

export const TankControls = ({ onChangeRear, onChangeFront }) => {
  const [rearValue, setRearValue] = useState(0)
  const [frontValue, setFrontValue] = useState(0)
  const [frontValueManual, setFrontValueManual] = useState(0)
  const [rearValueManual, setRearValueManual] = useState(0)
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
      <Tanks>
        <StepperWrapper>
          <StepperLabel>Rear tank</StepperLabel>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onChangeRear && onChangeRear(rearValueManual)
            }}
          >
            <input
              type="text"
              onChange={(e) => {
                setRearValueManual(Number(e.target.value))
              }}
            />
            <input type="submit" />
          </form>
        </StepperWrapper>
        <StepperWrapper>
          <StepperLabel>Front tank</StepperLabel>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onChangeFront && onChangeFront(frontValueManual)
            }}
          >
            <input
              type="text"
              onChange={(e) => {
                setFrontValueManual(Number(e.target.value))
              }}
            />
            <input type="submit" />
          </form>
        </StepperWrapper>
      </Tanks>
    </div>
  )
}
