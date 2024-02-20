import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { MapContainerProps, useMapEvents } from "react-leaflet";
import { Coordinate } from "../mapTypes";
import { LeafletMouseEvent } from "leaflet";

const MapContainer = dynamic(
  () => import("react-leaflet").then((module) => module.MapContainer),
  {
    ssr: false,
  }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((module) => module.TileLayer),
  {
    ssr: false,
  }
);

type MapProps = {
  onClick?: (c: Coordinate) => void;
};

const OnClickHandler = ({
  onClick,
}: {
  onClick: (e: LeafletMouseEvent) => void;
}) => {
  useMapEvents({
    click: onClick,
  });
  return null;
};

export const Map = ({
  center,
  zoom,
  children,
  onClick,
}: MapContainerProps & MapProps) => {
  const handleMapClick = (e: LeafletMouseEvent) => {
    if (onClick) {
      onClick({ lat: e.latlng.lat, lon: e.latlng.lng });
    }
  };
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      className="w-full h-full"
    >
      <OnClickHandler onClick={handleMapClick} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
};

export default Map;
