import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button } from './styles'
import { useKeyPress } from './useKeyPress'
import { Gamepad } from '../components/Gamepad'
import { DepthControlCmd } from './types'

const Buttons = styled.div`
  display: flex;
  align-items: center;
`

const ButtonCol = styled.div`
  display: flex;
  flex-direction: column;
`

const CommandButton = styled(Button)`
  padding: 10px 16px;
  margin: 2px;
  min-width: 50px;

  :first-child {
    margin-left: 0;
  }
`

const MoreCommandButtons = styled.div`
  margin-left: 20px;
`

const Flex = styled.div`
  display: flex;
`

const GPStatus = styled.div`
  background-color: ${({ isConnected }) => (isConnected ? '#e8f8fd' : '#ededed')};
  padding: 12px;
  display: inline-block;
  margin-top: 16px;
  border-radius: 4px;
  border: 1px double #dedede;
  color: ${({ isConnected }) => (isConnected ? '#505078' : '#6f6f6f')};
  display: flex;
  align-items: center;
`
const InfoIcon = () => <Circle>ℹ</Circle>

const Circle = styled.div`
  border-radius: 50%;
  height: 24px;
  width: 24px;
  border: 1px solid;
  border-color: ${({ isConnected }) => (isConnected ? '#505078' : '#6f6f6f')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-right: 8px;
`

const KeyButton = ({ targetKey, label, onPress, keyPressEnabled }) => {
  const keyPressed = useKeyPress(targetKey)

  useEffect(() => {
    if (keyPressEnabled && keyPressed) {
      onPress()
    }
  }, [keyPressEnabled, keyPressed])

  return (
    <CommandButton onClick={onPress} pressed={keyPressEnabled && keyPressed}>
      {label}
    </CommandButton>
  )
}

interface ControlsProps {
  onArrowUp: () => void
  onArrowDown: () => void
  onArrowLeft: () => void
  onArrowRight: () => void
  onCenterClick: () => void
  onAutoClick: () => void
  onManualClick: () => void
  sendMotorCommand: (val: number) => void
  sendRudderCommand: (val: number) => void
}

export const Controls = ({
  onArrowUp,
  onArrowDown,
  onArrowLeft,
  onArrowRight,
  onCenterClick,
  onAutoClick,
  onManualClick,
  sendMotorCommand,
  sendRudderCommand,
}: ControlsProps) => {
  const [keyPressEnabled, setKeyPressEnabled] = useState(false)
  const [isGamepadConnected, setIsGamepadConnected] = useState(false)

  return (
    <div>
      <Buttons>
        <ButtonCol>
          <KeyButton
            label="&#5130;"
            targetKey="ArrowLeft"
            onPress={onArrowLeft}
            keyPressEnabled={keyPressEnabled}
          />
        </ButtonCol>
        <ButtonCol>
          <KeyButton
            label="&#5123;"
            targetKey="ArrowUp"
            onPress={onArrowUp}
            keyPressEnabled={keyPressEnabled}
          />
          <KeyButton
            label="Center"
            targetKey="c"
            onPress={onCenterClick}
            keyPressEnabled={keyPressEnabled}
          />
          <KeyButton
            label="&#5121;"
            targetKey="ArrowDown"
            onPress={onArrowDown}
            keyPressEnabled={keyPressEnabled}
          />
        </ButtonCol>
        <ButtonCol>
          <KeyButton
            label="&#5125;"
            targetKey="ArrowRight"
            onPress={onArrowRight}
            keyPressEnabled={keyPressEnabled}
          />
        </ButtonCol>
        <MoreCommandButtons>
          <Flex>
            <KeyButton
              label="Manual"
              targetKey="m"
              onPress={onManualClick}
              keyPressEnabled={keyPressEnabled}
            />
            <KeyButton
              label="Automatic"
              targetKey="a"
              onPress={onAutoClick}
              keyPressEnabled={keyPressEnabled}
            />
          </Flex>

          <div style={{ marginTop: 8 }}>
            <Button
              onClick={() => {
                setKeyPressEnabled((prev) => !prev)
              }}
            >
              KeyPress commands {keyPressEnabled ? '✅' : '❌'}
            </Button>
          </div>
          <div>
            <GPStatus isConnected={isGamepadConnected}>
              <InfoIcon />
              <div>{isGamepadConnected ? 'Gamepad is connected' : 'Gamepad is not connected'}</div>
            </GPStatus>
          </div>
          <Gamepad
            onConnectionChange={(isConnected) => setIsGamepadConnected(isConnected)}
            sendMotorCommand={sendMotorCommand}
            sendRudderCommand={sendRudderCommand}
          />
        </MoreCommandButtons>
      </Buttons>
    </div>
  )
}
