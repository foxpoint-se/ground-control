import { Marker, MarkerProps } from "react-leaflet";

import L from "leaflet";

const LeafletDotIcon = L.icon({
  iconUrl: "/dot.svg",
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const DotMarker = (props: MarkerProps) => {
  return <Marker {...props} icon={LeafletDotIcon} />;
};

export default DotMarker;
