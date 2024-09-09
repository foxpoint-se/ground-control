import { memo, useCallback, useState } from "react";
import { Map } from "./Map";
import {
  ClickedKnownPosition,
  ClickedRoute,
  GhostMarker,
  PlannedRoute,
  TraveledPath,
} from "./overlayRoutes";
import { Coordinate } from "../mapTypes";
import { Route, routes as importedRoutes } from "./routePlans";
import VehicleMarker from "./VehicleMarker";
import { Panel } from "../Panel";
import { ClearAndConfirmButton } from "../ClearAndConfirmButton";
import MarkerWithPopup from "./MarkerWithPopup";
import { MarkerWithPopupProps } from "./MarkerWithPopup/MarkerWithPopup";
import { Assignment, SubmergedCoordinate, TracedRoute } from "../topics";
import { calcCrowDistanceMeters } from "../calcDistance";
import { useLocalStorageBackends } from "../useLocalStorageRoutes";

const SelectOverlayRoute = ({
  onChange,
  routes,
}: {
  onChange?: (r?: Route) => void;
  routes: Route[];
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
  onSaveClickedRoute,
}: {
  onEnableChange: (enabled: boolean) => void;
  clickedPositions: Coordinate[];
  onClear: () => void;
  enabled: boolean;
  onSendMission?: () => void;
  onSendEmptyMission?: () => void;
  onSaveClickedRoute: (name: string, path: Coordinate[]) => void;
}) => {
  const [showCopied, setShowCopied] = useState(false);
  const [name, setName] = useState("");
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
          <>
            <div className="flex items-center space-x-sm ml-sm">
              <ClearAndConfirmButton onClick={onClear} />
              <button onClick={handleCopyClick} className="btn btn-xs">
                Copy {countPositions} to clipboard
              </button>
              {showCopied && (
                <div className="text-xs">Copied to clipboard!</div>
              )}
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
            <div className="mt-md flex space-x-sm ml-sm">
              <button
                onClick={() => {
                  onSaveClickedRoute(name, clickedPositions);
                }}
                className="btn btn-xs"
                disabled={!name || clickedPositions.length === 0}
              >
                Save locally
              </button>
              <input
                className="input input-bordered input-xs"
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
                placeholder="Give clicked route a name"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const MapPanel = ({
  vehiclePosition,
  vehicleRotation,
  ghostPosition,
  onSendKnownPosition,
  popupMarkers = [],
  onSendMission,
  tracedRoutes = [],
}: {
  vehiclePosition?: Coordinate;
  vehicleRotation?: number;
  ghostPosition?: Coordinate;
  onSendKnownPosition: (c: Coordinate) => void;
  popupMarkers?: MarkerWithPopupProps[];
  onSendMission?: (assignments: Assignment[]) => void;
  tracedRoutes?: TracedRoute[];
}) => {
  const [overlayRoute, setOverlayRoute] = useState<Route>();
  const [clickRouteEnabled, setClickRouteEnabled] = useState(false);
  const [clickKnownPositionEnabled, setClickKnownPositionEnabled] =
    useState(false);
  const [clickedRoute, setClickedRoute] = useState<Assignment[]>([]);
  const [clickedKnownPosition, setClickedKnownPosition] =
    useState<Coordinate>();

  const { routes: availableRoutes, onAdd: onAddAvailableRoute } =
    useLocalStorageBackends(importedRoutes);

  const initialCenter: L.LatLngExpression = [59.310506, 17.981233];
  const initalZoom = 16;

  const handleClearClickedPositions = () => {
    setClickedRoute([]);
  };

  const handleMapClick = (c: Coordinate) => {
    if (clickRouteEnabled) {
      setClickedRoute((prev) => {
        const newCoord: Assignment = {
          coordinate: c,
          sync_after: false,
          target_depth: 0.0,
        };
        return [...prev, newCoord];
      });
    } else if (clickKnownPositionEnabled) {
      setClickedKnownPosition(() => c);
    }
  };

  const handleSendMission = (positions: Assignment[]) => {
    if (onSendMission) {
      onSendMission(positions);
    }
  };

  const handleChangeAssignment = useCallback(
    (assignment: Assignment, index: number) => {
      const newAssignments = [...clickedRoute];
      newAssignments[index] = assignment;
      setClickedRoute(newAssignments);
    },
    [clickedRoute]
  );

  return (
    <Panel>
      <div className="flex flex-col space-y-sm">
        <div className="h-72 lg:h-[500px] flex space-x-sm">
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
            <ClickedRoute positions={clickedRoute.map((a) => a.coordinate)} />
            {tracedRoutes.map((tr) => {
              const color =
                tr.average_depth_meters > 0.2 ? "darkblue" : "yellow";
              return (
                <TraveledPath
                  key={`${tr.started_at}${tr.ended_at}${tr.xy_distance_covered_meters}`}
                  color={color}
                  path={tr.path.map((e) => e.coordinate)}
                />
              );
            })}
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
          {clickRouteEnabled && (
            <div className="w-1/4 overflow-y-auto overflow-x-hidden">
              <MemoizedModifyClickedRoute
                route={clickedRoute}
                onChangeAssignment={handleChangeAssignment}
              />
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-xs">
          <div className="col-span-2 lg:col-span-1">
            <SelectOverlayRoute
              routes={availableRoutes}
              onChange={(r) => setOverlayRoute(r)}
            />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <ClickRoute
              enabled={clickRouteEnabled}
              onClear={handleClearClickedPositions}
              clickedPositions={clickedRoute.map((a) => a.coordinate)}
              onEnableChange={(enabled) => {
                setClickRouteEnabled(enabled);
              }}
              onSendMission={() => {
                handleSendMission(clickedRoute);
              }}
              onSendEmptyMission={() => {
                handleSendMission([]);
              }}
              onSaveClickedRoute={(name, path) => {
                onAddAvailableRoute({ name, path });
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
              onSend={onSendKnownPosition}
            />
          </div>
        </div>
      </div>
    </Panel>
  );
};

const ModifyClickedRoute = ({
  route,
  onChangeAssignment,
}: {
  route: Assignment[];
  onChangeAssignment: (c: Assignment, index: number) => void;
}) => {
  return (
    <div className="h-full px-xs">
      <div className="label-text mb-sm">Clicked route</div>
      {route.length === 0 && (
        <div className="text-sm text-neutral-500">
          Click map to add assignments
        </div>
      )}
      {route.length > 0 && (
        <div className="flex flex-col space-y-sm">
          {route.map((c, index, list) => {
            let distanceToPrevious: undefined | number = undefined;

            const previousCoord = list[index - 1];
            if (previousCoord) {
              distanceToPrevious = calcCrowDistanceMeters(
                previousCoord.coordinate,
                c.coordinate
              );
            }
            return (
              <AssignmentForm
                routeLength={list.length}
                index={index}
                key={`${c.coordinate.lat}${c.coordinate.lon}`}
                assignment={c}
                onChange={onChangeAssignment}
                distanceToPrevious={
                  distanceToPrevious == undefined
                    ? undefined
                    : round(distanceToPrevious)
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const MemoizedModifyClickedRoute = memo(ModifyClickedRoute);

const round = (value: number) => Math.round(value * 100) / 100;

const AssignmentForm = ({
  assignment,
  index,
  routeLength,
  onChange,
  distanceToPrevious,
}: {
  assignment: Assignment;
  index: number;
  routeLength: number;
  onChange: (c: Assignment, index: number) => void;
  distanceToPrevious?: number;
}) => {
  const isFirst = index === 0;
  const isLast = index === routeLength - 1;
  let assignmentText = `Assignment ${index + 1}`;
  if (isLast) {
    assignmentText = "End";
  }
  if (isFirst) {
    assignmentText = "Start";
  }
  return (
    <div className="card bg-[#cecbdb42] p-sm text-xs flex flex-col space-y-xs">
      <div className="font-bold">{assignmentText}</div>
      {distanceToPrevious !== undefined && (
        <div>{distanceToPrevious} m from previous</div>
      )}
      <div>
        <label className="flex justify-between items-center">
          <span>Target depth</span>
          <input
            className="p-xs"
            type="number"
            min={-1}
            max={3}
            step={0.1}
            value={assignment.target_depth}
            onChange={(e) => {
              const newAssignment: Assignment = {
                ...assignment,
                target_depth: Number(e.target.value),
              };
              onChange(newAssignment, index);
            }}
          />
        </label>
      </div>
      <div>
        <label className="cursor-pointer flex justify-between">
          <span>Sync after?</span>
          <input
            type="checkbox"
            disabled={isLast}
            onChange={(e) => {
              const newAssignment: Assignment = {
                ...assignment,
                sync_after: Boolean(e.target.checked),
              };
              onChange(newAssignment, index);
            }}
            className="toggle toggle-primary"
            checked={assignment.sync_after}
          />
        </label>
      </div>
    </div>
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
