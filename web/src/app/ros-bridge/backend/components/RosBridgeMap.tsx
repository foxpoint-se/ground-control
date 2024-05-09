import { MapPanel } from "@/app/components/map/MapPanel";
import { Coordinate } from "@/app/components/mapTypes";
import ROSLIB from "roslib";
import { ImuStatus } from "@/app/components/topics";
import { useState } from "react";
import {
  useGnssSubscriber,
  useImuSubscriber,
  useLocalizationSubscriber,
} from "./rosBridge";

export const RosBridgeMap = ({ rosBridge }: { rosBridge: ROSLIB.Ros }) => {
  const [vehiclePosition, setVehiclePosition] = useState<Coordinate>();
  const [ghostPosition, setGhostPosition] = useState<Coordinate>();
  const [imuStatus, setImuStatus] = useState<ImuStatus>();
  useImuSubscriber(rosBridge, setImuStatus);
  useGnssSubscriber(rosBridge, setVehiclePosition);
  useLocalizationSubscriber(rosBridge, setGhostPosition);

  return (
    <MapPanel
      vehiclePosition={vehiclePosition}
      ghostPosition={ghostPosition}
      vehicleRotation={imuStatus?.heading}
    />
  );
};
