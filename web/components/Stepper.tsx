import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
`
const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const Input = styled.input`
  appearance: textfield;

  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    appearance: none;
  }

  font-size: 20px;
`

const StepButton = styled.button`
  height: 20px;
`

export const StepperWrapper = styled.div`
  background-color: #eeeeee;
  border-radius: 4px;
  padding: 6px;
  margin: 4px;
  display: flex;
  flex-direction: column;
`

export const StepperLabel = styled.span`
  font-size: 10px;
  margin-bottom: 4px;
`

interface StepperProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
}

export const Stepper = ({ value, onChange, min, max, step }: StepperProps) => {
  return (
    <Wrapper>
      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          let newValue = Number(e.target.value)
          if (newValue > max) newValue = max
          else if (newValue < min) newValue = min
          newValue = Math.round(newValue * 10) / 10
          onChange(newValue)
        }}
      />
      <ButtonsWrapper>
        <StepButton
          tabIndex="-1"
          onClick={() => {
            let newValue = value + step
            newValue = newValue > max ? max : newValue
            newValue = Math.round(newValue * 10) / 10
            onChange(newValue)
          }}
        >
          &#8963;
        </StepButton>
        <StepButton
          tabIndex="-1"
          onClick={() => {
            let newValue = value - step
            newValue = newValue < min ? min : newValue
            newValue = Math.round(newValue * 10) / 10
            onChange(newValue)
          }}
        >
          &#8964;
        </StepButton>
      </ButtonsWrapper>
    </Wrapper>
  )
}
