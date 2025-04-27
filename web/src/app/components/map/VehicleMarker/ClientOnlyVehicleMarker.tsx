import { useEffect, useRef } from "react";
import { Marker, MarkerProps } from "react-leaflet";
import "leaflet-rotatedmarker";
import L, { LatLngExpression } from "leaflet";
import { Coordinate } from "../../mapTypes";

export type VehicleMarkerProps = {
  position?: Coordinate;
  rotationAngle?: number;
  isGhost?: boolean;
  markerProps?: MarkerProps;
};

const ArrowLineIcon = L.icon({
  iconUrl: "/arrowline.svg",
  iconSize: [200, 200],
  iconAnchor: [100, 184],
});

const BlueArrowLineIcon = L.icon({
  iconUrl: "/bluearrowline.svg",
  iconSize: [200, 200],
  iconAnchor: [100, 184],
});

const VehicleMarker = ({
  rotationAngle,
  position,
  isGhost,
  markerProps,
}: VehicleMarkerProps) => {
  const markerRef = useRef<L.Marker | null>(null);
  const rotation = rotationAngle || 0;
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setRotationAngle(rotation);
    }
  }, [rotation]);

  // Note: Had problems with flickering when doing the if-check higher up in the tree.
  // Works better when instead always passing down defined or undefined props and checking them here.
  if (!position) {
    return null;
  }
  const markerPosition: LatLngExpression = [position.lat, position.lon];
  return (
    <Marker
      ref={markerRef}
      zIndexOffset={1}
      {...markerProps}
      position={markerPosition}
      icon={isGhost ? BlueArrowLineIcon : ArrowLineIcon}
      rotationAngle={rotation}
    />
  );
};

export default VehicleMarker;
