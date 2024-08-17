import { Marker, MarkerProps, Popup } from "react-leaflet";
import "leaflet-rotatedmarker";
import L, { LatLngExpression } from "leaflet";
import { Coordinate } from "../../mapTypes";
import { ReactNode, useEffect, useRef } from "react";

export type MarkerWithPopupProps = {
  id: string;
  position: Coordinate;
  markerProps?: MarkerProps;
  popupText?: ReactNode;
  isPopupOpen?: boolean;
};

const BasicMarker = L.icon({
  iconUrl: "/basic-marker.svg",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const MarkerWithPopup = ({
  position,
  markerProps,
  popupText,
  isPopupOpen,
}: MarkerWithPopupProps) => {
  const markerRef = useRef<L.Marker>(null);
  // Note: Had problems with flickering when doing the if-check higher up in the tree.
  // Works better when instead always passing down defined or undefined props and checking them here.

  const markerPosition: LatLngExpression = [position.lat, position.lon];

  useEffect(() => {
    if (markerRef.current) {
      if (isPopupOpen) {
        markerRef.current.openPopup();
      } else {
        markerRef.current.closePopup();
      }
    }
  }, [isPopupOpen]);

  return (
    <Marker
      position={markerPosition}
      zIndexOffset={2}
      ref={markerRef}
      icon={BasicMarker}
      {...markerProps}
    >
      {popupText && <Popup>{popupText}</Popup>}
    </Marker>
  );
};

export default MarkerWithPopup;
