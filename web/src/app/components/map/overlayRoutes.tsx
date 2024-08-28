import dynamic from "next/dynamic";
import { Route } from "./routePlans";
import DotMarker from "./DotMarker";
import { Coordinate } from "../mapTypes";

const RouteMarker = ({ lat, lon }: { lat: number; lon: number }) => {
  const zIndexOffset = undefined;
  return <DotMarker position={[lat, lon]} zIndexOffset={zIndexOffset} />;
};

const Polyline = dynamic(
  () => import("react-leaflet").then((module) => module.Polyline),
  {
    ssr: false,
  }
);
export const PlannedRoute = ({ route }: { route?: Route }) => {
  if (!route) {
    return null;
  }
  return (
    <>
      <Polyline
        key={route.name}
        pathOptions={{ color: "green" }}
        positions={route.path.map(({ lat, lon }) => [lat, lon])}
      />
      {route.path.map(({ lat, lon }) => {
        return <RouteMarker key={`${lat}${lon}`} lat={lat} lon={lon} />;
      })}
    </>
  );
};

export const ClickedRoute = ({ positions }: { positions: Coordinate[] }) => {
  return (
    <>
      <Polyline
        pathOptions={{ color: "#828282" }}
        positions={positions.map((p) => [p.lat, p.lon])}
      />
      {positions.map(({ lat, lon }) => {
        return <RouteMarker key={`${lat}${lon}`} lat={lat} lon={lon} />;
      })}
    </>
  );
};

export const GhostMarker = ({ position }: { position?: Coordinate }) => {
  if (!position) {
    return null;
  }
  return <RouteMarker lat={position.lat} lon={position.lon} />;
};

export const ClickedKnownPosition = ({
  position,
}: {
  position?: Coordinate;
}) => {
  if (!position) {
    return null;
  }
  return <RouteMarker lat={position.lat} lon={position.lon} />;
};

export const TraveledPath = ({
  path,
  color,
}: {
  path: Coordinate[];
  color: string;
}) => {
  return (
    <>
      <Polyline
        pathOptions={{ color }}
        positions={path.map(({ lat, lon }) => [lat, lon])}
      />
    </>
  );
};
