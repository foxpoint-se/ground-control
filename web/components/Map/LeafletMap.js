import PropTypes from 'prop-types'
import { MapContainer, Polyline, TileLayer, Marker } from 'react-leaflet'
import { RotatedMarker } from './RotatedMarker'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

const ArrowIcon = L.icon({
  iconUrl: '/arrow.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
})

L.Marker.prototype.options.icon = DefaultIcon

const LeafletMap = ({ height, width, polylines = [], markers = [] }) => {
  return (
    <MapContainer
      center={[59.31, 17.978]}
      zoom={16}
      scrollWheelZoom={true}
      style={{ height, width }}
    >
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
      {markers.map((m) => {
        if (m.rotated) {
          return (
            <RotatedMarker
              key={m.key}
              icon={ArrowIcon}
              rotationAngle={m.heading}
              position={[m.lat, m.lon]}
            />
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
