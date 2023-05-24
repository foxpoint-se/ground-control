import styled from 'styled-components'

export const Main = styled.main`
  min-height: 100%;
  display: flex;
  flex-direction: column;
`

export const Container = styled.div`
  min-height: 100vh;
  height: 100vh;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
`

type ButtonProps = {
  $pressed?: boolean
}

export const Button = styled.button<ButtonProps>`
  font-weight: 500;
  padding: 4px 8px;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  border: 1px ​solid #3c3c3c;
  background-color: #f8e9e9;
  min-height: 30px;
  padding-left: 20px;
  padding-right: 20px;
  :hover {
    background-color: #f9f1f1;
  }

  :active {
    background-color: #eadfdf;
  }

  ${({ $pressed }) => $pressed && 'background-color: #eadfdf;'}
`

export const PrimaryButton = styled(Button)`
  background-color: #639563;
  color: white;

  :hover {
    background-color: #75a275;
  }

  :active {
    background-color: #5a855a;
  }

  :disabled {
    background-color: #a2b2a2;
  }

  ${({ $pressed }) => $pressed && 'background-color: #5a855a;'}
`
export const SecondaryButton = styled(Button)`
  background-color: #3f3f91;
  color: white;
  :hover {
    background-color: #5555a0;
  }

  :active {
    background-color: #353575;
  }

  ${({ $pressed }) => $pressed && 'background-color: #353575;'}
`

export const DataTable = styled.table`
  border: 2px solid #cecece;
  border-radius: 4px;

  tr:nth-child(2n + 1) {
    background-color: #ededed;
  }

  td {
    padding: 4px 2px;
  }

  td:nth-child(2) {
    min-width: 120px;
    text-align: right;
    font-weight: 500;
  }
`
