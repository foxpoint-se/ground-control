import { useSearchParams, notFound } from 'next/navigation'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'
import styled from 'styled-components'

const SelectWrapper = styled.div`
  display: flex;
`

type WsBackend = 'hej' | 'korv'

const options: WsBackend[] = ['hej', 'korv']

type SelectProps = {
  backends: WsBackend[]
  onChange: (val: WsBackend) => void
}

export const RosWsSelect = ({ backends, onChange }: SelectProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedBackend, setSelectedBackend] = useState<WsBackend>()
  const backend = searchParams.get('ws')

  useEffect(() => {
    if (backend && options.includes(backend as WsBackend)) {
      router.push('?backend=korv')
    } else {
      // TODO: fortsätt här typ. ska försöka slänga 404 ifall man pluttar i en ws som inte finns
      // kanske måste migrera från pages till app
      // alternativt. kör på ros/[backend]
      notFound()
    }
  }, [])

  const handleChange = (e) => {
    setSelectedBackend(e.target)
  }

  return (
    <SelectWrapper>
      <select
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          const backend = e.target.value as WsBackend
          setSelectedBackend(backend)
        }}
      >
        <option></option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
        {/* <option value=""></option>
        <option value={"hej"}>hej</option>
        <option value={"korv"}>korv</option> */}
      </select>
    </SelectWrapper>
  )
}
