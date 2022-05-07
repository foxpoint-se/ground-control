import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import styled from 'styled-components'
import { Button } from '../styles'
import { routes } from '../../utils/routePlans'
import { Coordinate, IconType, TargetMarkerOpts } from './LeafletMap'

const height = '100%'
const width = '100%'

const Loading = styled.div`
  height: ${height}px;
  width: ${width};
  background-color: lightgray;
`

const ClickRouteWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  margin-left: 16px;
`

const ClickRouteInfo = styled.div`
  margin-left: 16px;
  display: flex;
  align-items: center;
`

const MapOptionsRow = styled.div`
  display: flex;
`

const SelectWrapper = styled.div`
  button:not(:last-child) {
    margin-right: 4px;
  }
`

const LabelSelect = styled.div`
  label {
    font-size: 12px;
    font-weight: 500;
    display: block;
    margin-bottom: 4px;
  }

  select {
    padding: 4px;
  }
`
interface VehicleProps {
  heading: number
  coordinate: Coordinate
}

interface ClickableMapProps {
  vehicle?: VehicleProps
  vehiclePath?: Coordinate[]
  movingAverages?: Coordinate[]
  targetMarkers?: TargetMarkerOpts[]
}

export const ClickableMap = ({
  vehicle,
  targetMarkers = [],
  vehiclePath = [],
  movingAverages = [],
}: ClickableMapProps) => {
  const [clickRouteEnabled, setClickRouteEnabled] = useState(false)
  const [clickedRoute, setClickedRoute] = useState([])
  const [selectedRoute, setSelectedRoute] = useState(null)

  const handleMapClick = (e) => {
    if (clickRouteEnabled) {
      const clickedPos = { lat: e.latlng.lat, lon: e.latlng.lng }
      setClickedRoute((prevList) => [...prevList, clickedPos])
    }
  }

  const LeafletMap = useMemo(
    () =>
      dynamic(() => import('./LeafletMap'), {
        loading: () => <Loading />,
        ssr: false,
      }),
    [],
  )

  let markers = []
  let polylines = []

  if (clickedRoute.length > 0) {
    const clickedRoutePolyline = {
      id: 'clicked-route',
      color: '#828282',
      coordinates: clickedRoute,
    }
    polylines.push(clickedRoutePolyline)

    const clickedMarkers = clickedRoute.map(({ lat, lon }) => ({
      lat,
      lon,
      icon: 'dot',
    }))

    markers = [...markers, ...clickedMarkers]
  }

  polylines.push({
    id: 'vehicle-path',
    color: '#3388ff',
    coordinates: vehiclePath,
  })

  polylines.push({
    id: 'moving-averages',
    color: 'red',
    coordinates: movingAverages,
  })

  if (selectedRoute) {
    polylines.push({ id: selectedRoute.name, coordinates: selectedRoute.path, color: 'green' })

    const selectedRouteMarkers = selectedRoute.path.map(({ lat, lon }) => ({
      lat,
      lon,
      icon: 'dot',
    }))
    markers = [...markers, ...selectedRouteMarkers]
  }

  const arrowMarker = {
    lat: vehicle?.coordinate?.lat,
    lon: vehicle?.coordinate?.lon,
    rotationAngle: vehicle?.heading,
    icon: 'arrowline' as IconType,
  }

  return (
    <>
      <MapOptionsRow style={{ marginBottom: 12 }}>
        <SelectWrapper>
          <LabelSelect>
            <label htmlFor="route-select">Select route</label>
            <select
              id="route-select"
              value={selectedRoute?.name || ''}
              onChange={(e) => {
                setSelectedRoute(routes.find((r) => r.name === e.target.value))
              }}
            >
              <option value="">(None)</option>
              {routes.map(({ name, path }) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </LabelSelect>
        </SelectWrapper>
        <ClickRouteWrapper>
          <Button
            onClick={() => {
              setClickRouteEnabled((prev) => !prev)
            }}
          >
            Click route {clickRouteEnabled ? '✅' : '❌'}
          </Button>
          {clickRouteEnabled && (
            <ClickRouteInfo>
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(clickedRoute))
                }}
              >
                Copy {clickedRoute.length} positions to clipboard
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => {
                  if (confirm('Are you sure?')) {
                    setClickedRoute(() => [])
                  }
                }}
              >
                Clear
              </Button>
            </ClickRouteInfo>
          )}
        </ClickRouteWrapper>
      </MapOptionsRow>
      <LeafletMap
        width={width}
        height={height}
        polylines={polylines}
        markers={markers}
        onClick={handleMapClick}
        arrowLineMarker={arrowMarker}
        targetMarkers={targetMarkers}
      />
    </>
  )
}
