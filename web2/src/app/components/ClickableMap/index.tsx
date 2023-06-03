import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { IconType, MarkerOpts, TargetMarkerOpts } from "./LeafletMap";
import { Coordinate } from "../types";
import { Route, routes } from "./routePlans";
import { Button } from "../button/Button";
import { LeafletMouseEvent } from "leaflet";

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
  const [clickRouteEnabled, setClickRouteEnabled] = useState(false);
  const [clickedRoute, setClickedRoute] = useState<any[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route>();

  const handleMapClick = (e: LeafletMouseEvent) => {
    if (clickRouteEnabled) {
      const clickedPos = { lat: e.latlng.lat, lon: e.latlng.lng };
      setClickedRoute((prevList) => [...prevList, clickedPos]);
    }
  };

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

  if (clickedRoute.length > 0) {
    const clickedRoutePolyline = {
      id: "clicked-route",
      color: "#828282",
      coordinates: clickedRoute,
    };
    polylines.push(clickedRoutePolyline);

    const clickedMarkers = clickedRoute.map(({ lat, lon }) => ({
      lat,
      lon,
      icon: "dot",
    }));

    markers = [...markers, ...clickedMarkers];
  }

  polylines.push({
    id: "vehicle-path",
    color: "#3388ff",
    coordinates: vehiclePath,
  });

  if (selectedRoute) {
    polylines.push({
      id: selectedRoute.name,
      coordinates: selectedRoute.path,
      color: "green",
    });

    const selectedRouteMarkers = selectedRoute.path.map(({ lat, lon }) => ({
      lat,
      lon,
      icon: "dot",
    }));
    markers = [...markers, ...selectedRouteMarkers];
  }

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
      <div className="flex mb-3">
        <div>
          <div>
            <label
              htmlFor="route-select"
              className="block mb-2 font-semibold text-sm"
            >
              Select route
            </label>
            <select
              id="route-select"
              className="p-2"
              value={selectedRoute?.name || ""}
              onChange={(e) => {
                setSelectedRoute(routes.find((r) => r.name === e.target.value));
              }}
            >
              <option value="">(None)</option>
              {routes.map(({ name, path }) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-end ml-4">
          <Button
            onClick={() => {
              setClickRouteEnabled((prev) => !prev);
            }}
          >
            Click route {clickRouteEnabled ? "✅" : "❌"}
          </Button>
          {clickRouteEnabled && (
            <div className="flex items-end ml-4">
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(clickedRoute));
                }}
              >
                Copy {clickedRoute.length} positions to clipboard
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => {
                  if (confirm("Are you sure?")) {
                    setClickedRoute(() => []);
                  }
                }}
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      </div>
      <LeafletMap
        width={width}
        height={height}
        polylines={polylines}
        markers={markers}
        onClick={handleMapClick}
        arrowLineMarker={arrowMarker}
        targetMarkers={targetMarkers}
      />
    </>
  );
};
