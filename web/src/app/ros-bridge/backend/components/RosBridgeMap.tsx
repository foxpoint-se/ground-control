import { MapPanel } from "@/app/components/map/MapPanel";
import { Coordinate } from "@/app/components/mapTypes";
import ROSLIB from "roslib";
import {
  TracedRoute,
  SubmergedCoordinate,
  ImuStatus,
} from "@/app/components/topics";
import { ReactNode, useEffect, useState } from "react";
import {
  useGnssPublisher,
  useGnssSubscriber,
  useTracedRouteSubscriber,
  useImuSubscriber,
  useLocalizationSubscriber,
  useNavMissionPublisher,
} from "./rosBridge";
import { Panel } from "@/app/components/Panel";
import { Toggle } from "@/app/components/Toggle";
import { DistanceDebug, Entry } from "./DistanceDebug";

export const RosBridgeMap = ({ rosBridge }: { rosBridge: ROSLIB.Ros }) => {
  const [isDistanceDebugEnabled, setIsDistanceDebugEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [clickedEntries, setClickedEntries] = useState<Entry[]>([]);
  const [tracedRoutes, setTracedRoutes] = useState<TracedRoute[]>([]);
  const [vehiclePosition, setVehiclePosition] = useState<Coordinate>();
  const [ghostPosition, setGhostPosition] = useState<Coordinate>();
  const [imuStatus, setImuStatus] = useState<ImuStatus>();
  useImuSubscriber(rosBridge, setImuStatus);
  useGnssSubscriber(rosBridge, setVehiclePosition);
  useLocalizationSubscriber(rosBridge, setGhostPosition);
  const { publishGnssStatus } = useGnssPublisher(rosBridge);
  const { publishNavMissionCmd } = useNavMissionPublisher(rosBridge);

  useTracedRouteSubscriber(rosBridge, (newSegment: TracedRoute) => {
    setTracedRoutes((prev) => {
      const newList = [...prev, newSegment];
      return newList;
    });
  });

  const onUpdateGnss = (c: Coordinate) => {
    publishGnssStatus(c);
  };

  useEffect(() => {
    if (isRecording && ghostPosition) {
      const entry: Entry = {
        ...ghostPosition,
        type: "localization",
        receivedAt: Date.now(),
      };
      setEntries((prev: Entry[]) => {
        const newList = [...prev, entry];
        return newList;
      });
    }
  }, [ghostPosition, isRecording]);

  useEffect(() => {
    if (isRecording && vehiclePosition) {
      const entry: Entry = {
        ...vehiclePosition,
        type: "gnss",
        receivedAt: Date.now(),
      };
      setEntries((prev: Entry[]) => {
        const newList = [...prev, entry];
        return newList;
      });
    }
  }, [vehiclePosition, isRecording]);

  const handleClickEntry = (entry: Entry) => {
    setClickedEntries((prev) => {
      const exists = prev.find((e) => e.receivedAt === entry.receivedAt);
      if (exists) {
        return prev.filter((e) => e.receivedAt !== entry.receivedAt);
      } else {
        return [...prev, entry];
      }
    });
  };

  const handleSendMission = (positions: Coordinate[]) => {
    publishNavMissionCmd({ coordinate_list: positions });
  };

  return (
    <div className="grid grid-cols-4 gap-sm">
      <div className="col-span-4">
        <Panel>
          <Toggle
            label="Debug distance?"
            isToggledOn={isDistanceDebugEnabled}
            onToggleChange={setIsDistanceDebugEnabled}
          />
          {isDistanceDebugEnabled && (
            <DistanceDisplay clickedEntries={clickedEntries} />
          )}
        </Panel>
      </div>
      <div
        className={`${isDistanceDebugEnabled ? "col-span-3" : "col-span-4"}`}
      >
        <MapPanel
          vehiclePosition={vehiclePosition}
          ghostPosition={ghostPosition}
          vehicleRotation={imuStatus?.heading}
          onUpdateGnss={onUpdateGnss}
          popupMarkers={clickedEntries.map((ce) => {
            return {
              id: ce.receivedAt.toString(),
              position: { lat: ce.lat, lon: ce.lon },
              popupText: createPopupText(clickedEntries),
            };
          })}
          onSendMission={handleSendMission}
          tracedRoutes={tracedRoutes}
        />
      </div>
      {isDistanceDebugEnabled && (
        <div className="col-span-1">
          <Panel>
            {rosBridge && (
              <DistanceDebug
                isRecording={isRecording}
                setIsRecording={setIsRecording}
                entries={entries}
                onClearEntries={() => {
                  setEntries([]);
                  setClickedEntries([]);
                }}
                onClickEntry={handleClickEntry}
              />
            )}
          </Panel>
        </div>
      )}
    </div>
  );
};

const createPopupText = (entries: Entry[]): ReactNode => {
  if (entries.length === 2) {
    return (
      "Distance between positions: " +
      calcCrowDistanceMeters(
        { lat: entries[0].lat, lon: entries[0].lon },
        { lat: entries[1].lat, lon: entries[1].lon }
      )
    );
  }
  return "Select exactly 2 positions";
};

const calcCrowDistanceMeters = (
  coordinate1: Coordinate,
  coordinate2: Coordinate
): number => {
  const R = 6371000; // meters
  const dLat = toRadians(coordinate2.lat - coordinate1.lat);
  var dLon = toRadians(coordinate2.lon - coordinate1.lon);
  var lat1 = toRadians(coordinate1.lat);
  var lat2 = toRadians(coordinate2.lat);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
};

const toRadians = (degrees: number) => {
  return (degrees * Math.PI) / 180;
};

const DistanceDisplay = ({ clickedEntries }: { clickedEntries: Entry[] }) => {
  if (clickedEntries.length === 2) {
    const pos1 = { lat: clickedEntries[0].lat, lon: clickedEntries[0].lon };
    const pos2 = { lat: clickedEntries[1].lat, lon: clickedEntries[1].lon };

    return (
      <div className="font-bold">
        {round(calcCrowDistanceMeters(pos1, pos2))}
      </div>
    );
  }

  return <div className="font-bold">Select exactly 2 positions.</div>;
};

const round = (value: number) => Math.round(value * 100) / 100;
