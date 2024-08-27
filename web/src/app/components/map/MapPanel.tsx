import { useState } from "react";
import { Map } from "./Map";
import {
  ClickedKnownPosition,
  ClickedRoute,
  GhostMarker,
  PlannedRoute,
  TraveledPath,
} from "./overlayRoutes";
import { Coordinate } from "../mapTypes";
import { Route, routes } from "./routePlans";
import VehicleMarker from "./VehicleMarker";
import { Panel } from "../Panel";
import { ClearAndConfirmButton } from "../ClearAndConfirmButton";
import MarkerWithPopup from "./MarkerWithPopup";
import { MarkerWithPopupProps } from "./MarkerWithPopup/MarkerWithPopup";
import { SubmergedCoordinate } from "../topics";

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
  onSendMission,
  onSendEmptyMission,
}: {
  onEnableChange: (enabled: boolean) => void;
  clickedPositions: Coordinate[];
  onClear: () => void;
  enabled: boolean;
  onSendMission?: () => void;
  onSendEmptyMission?: () => void;
}) => {
  const [showCopied, setShowCopied] = useState(false);
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
          <div className="flex items-center space-x-sm ml-sm">
            <ClearAndConfirmButton onClick={onClear} />
            <button onClick={handleCopyClick} className="btn btn-xs">
              Copy {countPositions} to clipboard
            </button>
            {showCopied && <div className="text-xs">Copied to clipboard!</div>}
            {onSendMission && onSendEmptyMission && (
              <div className="flex items-center space-x-sm">
                <button
                  onClick={onSendMission}
                  className="btn btn-xs btn-success"
                >
                  Send
                </button>
                <button
                  className="btn btn-xs btn-error"
                  onClick={onSendEmptyMission}
                >
                  Send empty
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const MapPanel = ({
  vehiclePosition,
  vehicleRotation,
  ghostPosition,
  onUpdateGnss,
  popupMarkers = [],
  onSendMission,
  recordedEvents = [],
}: {
  vehiclePosition?: Coordinate;
  vehicleRotation?: number;
  ghostPosition?: Coordinate;
  onUpdateGnss: (c: Coordinate) => void;
  popupMarkers?: MarkerWithPopupProps[];
  onSendMission?: (positions: Coordinate[]) => void;
  recordedEvents?: SubmergedCoordinate[];
}) => {
  const [overlayRoute, setOverlayRoute] = useState<Route>();
  const [clickRouteEnabled, setClickRouteEnabled] = useState(false);
  const [clickKnownPositionEnabled, setClickKnownPositionEnabled] =
    useState(false);
  const [clickedRoute, setClickedRoute] = useState<Coordinate[]>([]);
  const [clickedKnownPosition, setClickedKnownPosition] =
    useState<Coordinate>();
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
    } else if (clickKnownPositionEnabled) {
      setClickedKnownPosition(() => c);
    }
  };

  const handleSendMission = (positions: Coordinate[]) => {
    if (onSendMission) {
      onSendMission(positions);
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
            <GhostMarker position={ghostPosition} />
            <PlannedRoute route={overlayRoute} />
            <ClickedRoute positions={clickedRoute} />
            <TraveledPath path={recordedEvents.map((e) => e.coordinate)} />
            <ClickedKnownPosition position={clickedKnownPosition} />
            {popupMarkers.map((m) => (
              <MarkerWithPopup
                id={m.id}
                key={m.id}
                popupText={m.popupText}
                position={m.position}
                isPopupOpen={m.isPopupOpen}
              />
            ))}
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
              onSendMission={() => {
                handleSendMission(clickedRoute);
              }}
              onSendEmptyMission={() => {
                handleSendMission([]);
              }}
            />
          </div>
          <div className="col-span-2">
            <ClickKnownPosition
              enabled={clickKnownPositionEnabled}
              onClear={() => {
                setClickedKnownPosition(() => undefined);
              }}
              clickedKnownPosition={clickedKnownPosition}
              onEnableChange={(enabled) => {
                setClickKnownPositionEnabled(enabled);
              }}
              onSend={onUpdateGnss}
            />
          </div>
        </div>
      </div>
    </Panel>
  );
};

const ClickKnownPosition = ({
  enabled,
  onClear,
  clickedKnownPosition,
  onEnableChange,
  onSend,
}: {
  enabled: boolean;
  onClear: () => void;
  clickedKnownPosition?: Coordinate;
  onEnableChange: (enabled: boolean) => void;
  onSend: (c: Coordinate) => void;
}) => {
  return (
    <div>
      <div>
        <label className="cursor-pointer label justify-start space-x-md">
          <span className="label-text">Click known position</span>
          <input
            type="checkbox"
            onChange={(e) => {
              onEnableChange(e.target.checked);
              if (!e.target.checked) {
                onClear();
              }
            }}
            className="toggle toggle-primary"
            checked={enabled}
          />
        </label>
        {enabled && (
          <div className="flex items-center space-x-sm">
            {clickedKnownPosition ? (
              <>
                <div className="flex items-center space-x-sm">
                  <button
                    onClick={() => {
                      onSend(clickedKnownPosition);
                    }}
                    className="btn btn-xs btn-success"
                  >
                    Send
                  </button>
                  <span>
                    lat: {clickedKnownPosition.lat}, lon:{" "}
                    {clickedKnownPosition.lon}
                  </span>
                </div>
              </>
            ) : (
              <span className="text-sm text-error">
                Click map to get a position!
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
