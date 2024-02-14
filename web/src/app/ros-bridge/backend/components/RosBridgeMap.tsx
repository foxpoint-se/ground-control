import { MapPanel } from "@/app/components/new/map/MapPanel";
import { Coordinate } from "@/app/components/new/mapTypes";
import ROSLIB from "roslib";
import { ImuStatus } from "@/app/components/new/topics";
import { useState } from "react";
import { useGnssSubscriber, useImuSubscriber } from "./rosBridge";

export const RosBridgeMap = ({ rosBridge }: { rosBridge: ROSLIB.Ros }) => {
  const [vehiclePosition, setVehiclePosition] = useState<Coordinate>();
  const [imuStatus, setImuStatus] = useState<ImuStatus>();
  useImuSubscriber(rosBridge, setImuStatus);
  useGnssSubscriber(rosBridge, setVehiclePosition);

  return (
    <MapPanel
      vehiclePosition={vehiclePosition}
      vehicleRotation={imuStatus?.heading}
    />
  );
};
