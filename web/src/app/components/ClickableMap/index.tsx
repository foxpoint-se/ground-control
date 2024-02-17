import { useMemo } from "react";
import dynamic from "next/dynamic";
import { IconType, MarkerOpts, TargetMarkerOpts } from "./LeafletMap";
import { Coordinate } from "../types";

const height = "100%";
const width = "100%";

const Loading = () => (
  <div className="bg-neutral-400" style={{ height, width }} />
);

interface VehicleProps {
  heading: number;
  coordinate: Coordinate;
}

interface ClickableMapProps {
  vehicle?: VehicleProps;
  vehiclePath?: Coordinate[];
  targetMarkers?: TargetMarkerOpts[];
}

export const ClickableMap = ({
  vehicle,
  targetMarkers = [],
  vehiclePath = [],
}: ClickableMapProps) => {
  const LeafletMap = useMemo(
    () =>
      dynamic(() => import("./LeafletMap"), {
        loading: () => <Loading />,
        ssr: false,
      }),
    []
  );

  let markers: any[] = [];
  let polylines = [];

  polylines.push({
    id: "vehicle-path",
    color: "#3388ff",
    coordinates: vehiclePath,
  });

  const arrowMarker: MarkerOpts | undefined =
    vehicle?.coordinate.lat && vehicle.coordinate.lon
      ? {
          lat: vehicle?.coordinate?.lat,
          lon: vehicle?.coordinate?.lon,
          rotationAngle: vehicle?.heading,
          icon: "arrowline" as IconType,
        }
      : undefined;

  return (
    <>
      <LeafletMap
        width={width}
        height={height}
        polylines={polylines}
        markers={markers}
        arrowLineMarker={arrowMarker}
        targetMarkers={targetMarkers}
      />
    </>
  );
};
