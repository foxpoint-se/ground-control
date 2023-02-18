import { useState } from 'react'
import styled from 'styled-components'
import { Button, PrimaryButton } from './styles'
import { PidDepthMsg } from './types'

const Wrapper = styled.div`
  margin-bottom: 20px;
  margin-left: 10px;
`

export const PidDebug = ({ onSubmit }: { onSubmit: (msg: PidDepthMsg) => void }) => {
  const [pValue, setPValue] = useState(0)
  const [iValue, setIValue] = useState(0)
  const [dValue, setDValue] = useState(0)
  const [targetDepth, setTargetDepth] = useState(0)

  const handleClick = () => {
    onSubmit({ p_value: pValue, i_value: iValue, d_value: dValue, depth_target: targetDepth })
  }

  const handleAbort = () => {
    onSubmit({ p_value: pValue, i_value: iValue, d_value: dValue, depth_target: -1 })
  }
  return (
    <Wrapper>
      <div>Depth</div>
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
          <span style={{ marginRight: 10 }}>Target depth</span>

          <input
            type="number"
            value={targetDepth}
            onChange={(e) => {
              setTargetDepth(Number(e.target.value))
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
