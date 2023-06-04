import { useEffect, useRef } from "react";
import { Marker } from "react-leaflet";
import "leaflet-rotatedmarker";

interface RotatedMarkerProps {
  rotationAngle: number;
  position: [number, number] | undefined;
  icon: L.Icon;
  zIndexOffset?: number;
}

export const RotatableMarker = ({
  rotationAngle,
  icon,
  position,
  zIndexOffset,
}: RotatedMarkerProps) => {
  const markerRef = useRef<L.Marker | null>(null);
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setRotationAngle(rotationAngle);
    }
  }, [rotationAngle]);

  // Note: Had problems with flickering when doing the if-check higher up in the tree.
  // Works better when instead always passing down defined or undefined props and checking them here.
  if (!position) {
    return null;
  }
  return (
    <Marker
      ref={markerRef}
      position={[position[0], position[1]]}
      icon={icon}
      rotationAngle={rotationAngle}
      zIndexOffset={zIndexOffset}
    />
  );
};
