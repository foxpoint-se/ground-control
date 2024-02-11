import "leaflet/dist/leaflet.css";
import { ReactNode, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import L, { LeafletMouseEvent } from "leaflet";

import { Route, routes } from "../../ClickableMap/routePlans";
import { LatLngExpression } from "leaflet";

type MapProps = {
  center?: L.LatLngExpression;
  zoom?: number;
  children?: ReactNode;
};

const Map = ({ center, zoom, children }: MapProps) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
};

const SelectOverlayRoute = ({
  onChange,
}: {
  onChange?: (r?: Route) => void;
}) => {
  const [selectedRoute, setSelectedRoute] = useState<Route>();
  return (
    <label htmlFor="route-select" className="form-control w-full">
      <div className="label">
        <span className="label-text">Select overlay route</span>
      </div>
      <select
        id="route-select"
        className="select select-sm select-bordered"
        value={selectedRoute?.name || ""}
        onChange={(e) => {
          const newSelected = routes.find((r) => r.name === e.target.value);
          setSelectedRoute(newSelected);
          if (onChange) {
            onChange(newSelected);
          }
        }}
      >
        <option value="">(None)</option>
        {routes.map(({ name, path }) => (
          <option key={name}>{name}</option>
        ))}
      </select>
    </label>
  );
};

const Panel = ({ children }: { children?: ReactNode }) => {
  return (
    <section className="p-xs bg-neutral-100 shadow-md rounded overflow-hidden">
      {children}
    </section>
  );
};

const DotIcon = L.icon({
  iconUrl: "/dot.svg",
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const RouteMarker = ({ lat, lon }: { lat: number; lon: number }) => {
  const zIndexOffset = undefined;
  return (
    <Marker position={[lat, lon]} zIndexOffset={zIndexOffset} icon={DotIcon} />
  );
};

const OverlayRoute = ({ route }: { route: Route }) => {
  const positions: LatLngExpression[] = route.path.map(({ lat, lon }) => [
    lat,
    lon,
  ]);
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

export const MapPanel = () => {
  const [overlayRoute, setOverlayRoute] = useState<Route>();
  const initialCenter: L.LatLngExpression = [59.310506, 17.981233];
  const initalZoom = 16;
  return (
    <Panel>
      <div className="flex flex-col space-y-sm">
        <div className="h-72 lg:h-96">
          <Map center={initialCenter} zoom={initalZoom}>
            {overlayRoute && <OverlayRoute route={overlayRoute} />}
          </Map>
        </div>
        <div className="grid grid-cols-2">
          <div className="col-span-2 lg:col-span-1">
            <SelectOverlayRoute onChange={(r) => setOverlayRoute(r)} />
          </div>
        </div>
      </div>
    </Panel>
  );
};
