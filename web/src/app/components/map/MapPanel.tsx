import { ReactNode, useState } from "react";
import { Map } from "./Map";
import { ClickedRoute, PlannedRoute } from "./overlayRoutes";
import { Coordinate } from "../mapTypes";
import { Route, routes } from "./routePlans";
import VehicleMarker from "./VehicleMarker";
import { Panel } from "../Panel";

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

const ClickRoute = ({
  onEnableChange,
  clickedPositions,
  onClear,
  enabled,
}: {
  onEnableChange: (enabled: boolean) => void;
  clickedPositions: Coordinate[];
  onClear: () => void;
  enabled: boolean;
}) => {
  const [showCopied, setShowCopied] = useState(false);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const countPositions = clickedPositions.length;

  const handleCopyClick = () => {
    navigator.clipboard.writeText(JSON.stringify(clickedPositions));
    setShowCopied(() => {
      setTimeout(() => {
        setShowCopied(false);
      }, 3000);
      return true;
    });
  };

  const handleClearClick = () => {
    setIsConfirmingClear(true);
  };

  const handleClearReject = () => {
    setIsConfirmingClear(false);
  };
  const handleClearConfirm = () => {
    onClear();
    setIsConfirmingClear(false);
  };
  return (
    <div>
      <div>
        <label className="cursor-pointer label justify-start space-x-md">
          <span className="label-text">Click route</span>
          <input
            type="checkbox"
            onChange={(e) => {
              onEnableChange(e.target.checked);
            }}
            className="toggle toggle-primary"
            checked={enabled}
          />
        </label>
        {enabled && (
          <div className="flex items-center space-x-sm">
            {isConfirmingClear ? (
              <>
                <button onClick={handleClearReject} className="btn btn-xs">
                  Cancel
                </button>
                <button
                  onClick={handleClearConfirm}
                  className="btn btn-xs btn-error"
                >
                  Clear
                </button>
              </>
            ) : (
              <button onClick={handleClearClick} className="btn btn-xs">
                Clear
              </button>
            )}
            <button onClick={handleCopyClick} className="btn btn-xs">
              Copy {countPositions} to clipboard
            </button>
            {showCopied && <div className="text-xs">Copied to clipboard!</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export const MapPanel = ({
  vehiclePosition,
  vehicleRotation,
}: {
  vehiclePosition?: Coordinate;
  vehicleRotation?: number;
}) => {
  const [overlayRoute, setOverlayRoute] = useState<Route>();
  const [clickRouteEnabled, setClickRouteEnabled] = useState(false);
  const [clickedRoute, setClickedRoute] = useState<Coordinate[]>([]);
  const initialCenter: L.LatLngExpression = [59.310506, 17.981233];
  const initalZoom = 16;

  const handleClearClickedPositions = () => {
    setClickedRoute([]);
  };

  const handleMapClick = (c: Coordinate) => {
    if (clickRouteEnabled) {
      setClickedRoute((prev) => {
        return [...prev, c];
      });
    }
  };
  return (
    <Panel>
      <div className="flex flex-col space-y-sm">
        <div className="h-72 lg:h-[500px]">
          <Map
            center={initialCenter}
            zoom={initalZoom}
            onClick={handleMapClick}
          >
            <VehicleMarker
              position={vehiclePosition}
              rotationAngle={vehicleRotation}
            />
            <PlannedRoute route={overlayRoute} />
            <ClickedRoute positions={clickedRoute} />
          </Map>
        </div>
        <div className="grid grid-cols-2 gap-xs">
          <div className="col-span-2 lg:col-span-1">
            <SelectOverlayRoute onChange={(r) => setOverlayRoute(r)} />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <ClickRoute
              enabled={clickRouteEnabled}
              onClear={handleClearClickedPositions}
              clickedPositions={clickedRoute}
              onEnableChange={(enabled) => {
                setClickRouteEnabled(enabled);
              }}
            />
          </div>
        </div>
      </div>
    </Panel>
  );
};
