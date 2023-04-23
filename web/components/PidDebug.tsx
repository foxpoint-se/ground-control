import { useState } from 'react'
import styled from 'styled-components'
import { Button, PrimaryButton } from './styles'
import { PidDepthMsg, PidPitchMsg } from './types'

const Wrapper = styled.div`
  margin-bottom: 20px;
  margin-left: 10px;
`

export const PidDebug = ({
  onSubmit,
  pitchOrDepth,
}: {
  onSubmit: (msg: PidDepthMsg | PidPitchMsg) => void
  pitchOrDepth: 'pitch' | 'depth'
}) => {
  const [pValue, setPValue] = useState(0)
  const [iValue, setIValue] = useState(0)
  const [dValue, setDValue] = useState(0)
  const [target, setTarget] = useState(0)

  const handleClick = () => {
    if (pitchOrDepth === 'depth') {
      onSubmit({ p_value: pValue, i_value: iValue, d_value: dValue, depth_target: target })
    } else if (pitchOrDepth === 'pitch') {
      onSubmit({ p_value: pValue, i_value: iValue, d_value: dValue, pitch_target: target })
    }
  }

  const handleAbort = () => {
    onSubmit({ p_value: pValue, i_value: iValue, d_value: dValue, depth_target: -1 })
  }
  return (
    <Wrapper>
      <div>{pitchOrDepth}</div>
      <div>
        <label>
          <span style={{ marginRight: 10 }}>P value</span>

          <input
            type="number"
            value={pValue}
            onChange={(e) => {
              setPValue(Number(e.target.value))
            }}
          />
        </label>
      </div>
      <div>
        <label>
          <span style={{ marginRight: 10 }}>I value</span>

          <input
            type="number"
            value={iValue}
            onChange={(e) => {
              setIValue(Number(e.target.value))
            }}
          />
        </label>
      </div>
      <div>
        <label>
          <span style={{ marginRight: 10 }}>D value</span>

          <input
            type="number"
            value={dValue}
            onChange={(e) => {
              setDValue(Number(e.target.value))
            }}
          />
        </label>
      </div>
      <div>
        <label>
          <span style={{ marginRight: 10 }}>Target {pitchOrDepth}</span>

          <input
            type="number"
            value={target}
            onChange={(e) => {
              setTarget(Number(e.target.value))
            }}
          />
        </label>
      </div>
      <div style={{ display: 'flex' }}>
        <PrimaryButton onClick={handleClick}>Submit</PrimaryButton>
        <Button onClick={handleAbort}>Abort</Button>
      </div>
    </Wrapper>
  )
}
