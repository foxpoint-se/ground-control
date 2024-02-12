import dynamic from "next/dynamic";
import { Route } from "./routePlans";
import DotMarker from "./DotMarker";

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
export const OverlayRoute = ({ route }: { route: Route }) => {
  const positions: any[] = route.path.map(({ lat, lon }) => [lat, lon]);
  return (
    <>
      <Polyline
        key={route.name}
        pathOptions={{ color: "green" }}
        positions={positions}
      />
      {route.path.map(({ lat, lon }) => {
        return <RouteMarker key={`${lat}${lon}`} lat={lat} lon={lon} />;
      })}
    </>
  );
};
