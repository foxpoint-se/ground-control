import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import styled from 'styled-components'

const height = 700
const width = '100%'

const Loading = styled.div`
  height: ${height}px;
  width: ${width};
  background-color: lightgray;
`

export const Map = ({ markerPosition, polylinePositions }) => {
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
      markerPosition={markerPosition}
      polylinePositions={polylinePositions}
    />
  )
}
