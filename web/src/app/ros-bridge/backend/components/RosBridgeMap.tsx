import { MapPanel } from "@/app/components/new/map/MapPanel";
import { Coordinate } from "@/app/components/new/mapTypes";
import ROSLIB from "roslib";
import { ImuStatus } from "@/app/components/new/topics";
import { useState } from "react";
import { useGnssSubscriber, useImuSubscriber, useRosBridge } from "./rosBridge";

const RosBridgeLoaded = ({ rosBridge }: { rosBridge: ROSLIB.Ros }) => {
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

export const RosBridgeMap = () => {
  const { rosBridge } = useRosBridge("ws://localhost:9090");

  if (!rosBridge) {
    return null;
  }

  return <RosBridgeLoaded rosBridge={rosBridge} />;
};
