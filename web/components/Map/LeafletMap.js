import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { MapContainer, Polyline, TileLayer, Marker, useMapEvents, Circle } from 'react-leaflet'
import { RotatedMarker } from './RotatedMarker'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import icon from 'leaflet/dist/images/marker-icon.png'

const DefaultIcon = L.icon({
  iconUrl: '/dot.svg',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
})

const TargetIcon = L.icon({
  iconUrl: icon.src,
  iconSize: [28, 44],
  iconAnchor: [13, 41],
})

const ArrowIcon = L.icon({
  iconUrl: '/arrow.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
})

const LineIcon = L.icon({
  iconUrl: '/line.svg',
  iconSize: [400, 400],
  iconAnchor: [200, 200],
})

L.Marker.prototype.options.icon = DefaultIcon

const ClickForMarker = ({ onClick }) => {
  const map = useMapEvents({
    click: onClick,
  })
  return null
}

const LeafletMap = ({
  height,
  width,
  polylines = [],
  markers = [],
  targetMarkers = [],
  onClick,
}) => {
  return (
    <MapContainer
      center={[59.310506, 17.981233]}
      zoom={16}
      scrollWheelZoom={true}
      style={{ height, width }}
    >
      {onClick && <ClickForMarker onClick={onClick} />}
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {polylines.map((p) => (
        <Polyline
          key={p.key}
          pathOptions={p.color && { color: p.color }}
          positions={p.positions.map((m) => [m.lat, m.lon])}
        />
      ))}
      {targetMarkers.map(({ coordinate: { lat, lon }, tolerance }) => {
        return (
          <Fragment key={`${lat}${lon}`}>
            <Circle
              center={[lat, lon]}
              radius={2 * tolerance}
              stroke={false}
              fill
              fillOpacity={0.3}
              fillColor="#419c43"
            />
            <Circle
              center={[lat, lon]}
              radius={tolerance}
              weight={10}
              stroke={false}
              fillColor="#419c43"
              fillOpacity={0.5}
            />
            <Marker icon={TargetIcon} position={[lat, lon]} />
          </Fragment>
        )
      })}
      {markers.map((m) => {
        if (m.rotated) {
          return (
            <Fragment key={m.key}>
              <RotatedMarker
                icon={LineIcon}
                rotationAngle={m.heading}
                position={[m.lat, m.lon]}
                zIndexOffset={99}
              />
              <RotatedMarker
                icon={ArrowIcon}
                rotationAngle={m.heading}
                position={[m.lat, m.lon]}
                zIndexOffset={100}
              />
            </Fragment>
          )
        }
        return <Marker key={m.key} position={[m.lat, m.lon]} />
      })}
    </MapContainer>
  )
}

LeafletMap.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  polylines: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      color: PropTypes.string,
      positions: PropTypes.arrayOf(
        PropTypes.shape({
          lat: PropTypes.number.isRequired,
          lon: PropTypes.number.isRequired,
        }),
      ),
    }),
  ),
  markers: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      rotated: PropTypes.bool,
      lat: PropTypes.number.isRequired,
      lon: PropTypes.number.isRequired,
      heading: PropTypes.number,
    }),
  ),
}

export default LeafletMap
