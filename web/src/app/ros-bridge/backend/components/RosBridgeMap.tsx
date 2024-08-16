import { MapPanel } from "@/app/components/map/MapPanel";
import { Coordinate } from "@/app/components/mapTypes";
import ROSLIB from "roslib";
import { ImuStatus } from "@/app/components/topics";
import { useEffect, useState } from "react";
import {
  useGnssPublisher,
  useGnssSubscriber,
  useImuSubscriber,
  useLocalizationSubscriber,
} from "./rosBridge";
import { Panel } from "@/app/components/Panel";
import { Toggle } from "@/app/components/Toggle";
import { DistanceDebug, Entry } from "./DistanceDebug";

export const RosBridgeMap = ({ rosBridge }: { rosBridge: ROSLIB.Ros }) => {
  const [isDistanceDebugEnabled, setIsDistanceDebugEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);

  const [vehiclePosition, setVehiclePosition] = useState<Coordinate>();
  const [ghostPosition, setGhostPosition] = useState<Coordinate>();
  const [imuStatus, setImuStatus] = useState<ImuStatus>();
  useImuSubscriber(rosBridge, setImuStatus);
  useGnssSubscriber(rosBridge, setVehiclePosition);
  useLocalizationSubscriber(rosBridge, setGhostPosition);
  const { publishGnssStatus } = useGnssPublisher(rosBridge);

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

  return (
    <div className="grid grid-cols-4 gap-sm">
      <div className="col-span-4">
        <Panel>
          <Toggle
            label="Debug distance?"
            isToggledOn={isDistanceDebugEnabled}
            onToggleChange={setIsDistanceDebugEnabled}
          />
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
                }}
              />
            )}
          </Panel>
        </div>
      )}
    </div>
  );
};
