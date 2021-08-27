import PropTypes from 'prop-types'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

const LeafletMap = ({ height, width, position }) => {
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
      {position && <Marker position={[position.lat, position.lon]} />}
    </MapContainer>
  )
}

LeafletMap.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

export default LeafletMap
