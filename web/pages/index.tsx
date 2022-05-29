import Head from 'next/head'
import Link from 'next/link'
import styled from 'styled-components'
import { Container, Main, PrimaryButton } from '../components/styles'

const SelectWrapper = styled.div`
  display: flex;
`

const OptionLink = styled(PrimaryButton)`
  padding: 10px 20px;
  width: 100px;
  display: flex;
  justify-content: center;
  margin: 2px;
  min-width: 100px;

  :first-child {
    margin-left: 0;
  }
`

const StyledMain = styled(Main)`
  margin: 0 auto;
`

const Heading = styled.h1`
  margin-top: 100px;
`

const Index = () => (
  <>
    <Head>
      <title>Select source</title>
    </Head>
    <Container>
      <StyledMain>
        <Heading>Select source</Heading>
        <SelectWrapper>
          <Link href="/radio" passHref>
            <OptionLink as="a">Radio</OptionLink>
          </Link>
          <Link href="/ros" passHref>
            <OptionLink as="a">ROS</OptionLink>
          </Link>
        </SelectWrapper>
      </StyledMain>
    </Container>
  </>
)

export default Index
