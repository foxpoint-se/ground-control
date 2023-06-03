import {
  Circle,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LeafletMouseEvent } from "leaflet";
import { Fragment } from "react";
import icon from "leaflet/dist/images/marker-icon.png";
import { RotatableMarker } from "./RotatableMarker";
import { Coordinate } from "../types";

interface PolylineOpts {
  id: string;
  color: string;
  coordinates: Coordinate[];
}

export type IconType = "dot" | "arrowline" | "pin";

export interface MarkerOpts extends Coordinate {
  icon: IconType;
  rotated?: boolean;
  rotationAngle?: number;
  zIndexOffset?: number;
}

export interface TargetMarkerOpts extends MarkerOpts {
  tolerance: number;
}

interface LeafletMapProps {
  width: number | string;
  height: number | string;
  polylines?: PolylineOpts[];
  heading?: number;
  position?: [number, number];
  markers?: MarkerOpts[];
  targetMarkers?: TargetMarkerOpts[];
  arrowLineMarker?: MarkerOpts;
  onClick?: (event: LeafletMouseEvent) => void;
}

const ArrowLineIcon = L.icon({
  iconUrl: "/arrowline.svg",
  iconSize: [200, 200],
  iconAnchor: [100, 184],
});

const DotIcon = L.icon({
  iconUrl: "/dot.svg",
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const PinIcon = L.icon({
  iconUrl: icon.src,
  iconSize: [28, 44],
  iconAnchor: [13, 41],
});

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

type Icons = Record<IconType, L.Icon>;
const icons: Icons = {
  dot: DotIcon,
  arrowline: ArrowLineIcon,
  pin: PinIcon,
};

const LeafletMap = ({
  width,
  height,
  polylines = [],
  markers = [],
  targetMarkers = [],
  arrowLineMarker,
  onClick,
}: LeafletMapProps) => {
  return (
    // <div className="grow">
    <MapContainer
      center={[59.310506, 17.981233]}
      zoom={16}
      scrollWheelZoom={true}
      style={{ height, width, flexGrow: 1 }}
    >
      {onClick && <OnClickHandler onClick={onClick} />}
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {targetMarkers.map(({ icon, lat, lon, tolerance }) => {
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
            <Marker icon={icons[icon]} position={[lat, lon]} />
          </Fragment>
        );
      })}
      {polylines.map(({ id, color, coordinates }) => (
        <Polyline
          key={id}
          pathOptions={{ color }}
          positions={coordinates
            .filter(({ lat, lon }) => lat && lon)
            .map(({ lat, lon }) => [lat, lon])}
        />
      ))}
      {markers.map(({ icon, lat, lon, zIndexOffset }) => {
        return (
          <Marker
            key={`${lat}${lon}`}
            icon={icons[icon]}
            position={[lat, lon]}
            zIndexOffset={zIndexOffset}
          />
        );
      })}
      <RotatableMarker
        position={arrowLineMarker && [arrowLineMarker.lat, arrowLineMarker.lon]}
        icon={arrowLineMarker ? icons[arrowLineMarker.icon] : icons.arrowline}
        rotationAngle={
          arrowLineMarker?.rotationAngle ? arrowLineMarker.rotationAngle : 0
        }
        zIndexOffset={arrowLineMarker ? arrowLineMarker.zIndexOffset : 1}
      />
    </MapContainer>
    // </div>
  );
};

export default LeafletMap;
