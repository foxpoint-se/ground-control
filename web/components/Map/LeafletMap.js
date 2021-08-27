import PropTypes from 'prop-types'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const Map = ({ height, width }) => {
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
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  )
}

Map.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

export default Map
