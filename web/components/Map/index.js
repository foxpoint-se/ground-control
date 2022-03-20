import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import styled from 'styled-components'

const height = '100%'
const width = '100%'

const Loading = styled.div`
  height: ${height}px;
  width: ${width};
  background-color: lightgray;
`

export const Map = ({ polylines, markers, targetMarkers, onClick }) => {
  const LeafletMap = useMemo(
    () =>
      dynamic(() => import('./LeafletMap'), {
        loading: () => <Loading />,
        ssr: false,
      }),
    [],
  )
  return (
    <LeafletMap
      width={width}
      height={height}
      polylines={polylines}
      markers={markers}
      targetMarkers={targetMarkers}
      onClick={onClick}
    />
  )
}
