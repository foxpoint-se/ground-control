import { Coordinate } from "@/app/components/mapTypes";
import { ImuStatus } from "@/app/components/topics";
import { useState } from "react";
import { useGnssSubscriber, useImuSubscriber } from "./useSubscribeToTopic";
import { MapPanel } from "@/app/components/map/MapPanel";

export const IotMap = ({ thingName }: { thingName: string }) => {
  const [vehiclePosition, setVehiclePosition] = useState<Coordinate>();
  const [imuStatus, setImuStatus] = useState<ImuStatus>();
  useImuSubscriber(thingName, setImuStatus);
  useGnssSubscriber(thingName, setVehiclePosition);

  const onUpdateGnss = (c: Coordinate) => {
    console.log("Not implemented. Coord:", c);
  };

  return (
    <MapPanel
      vehiclePosition={vehiclePosition}
      vehicleRotation={imuStatus?.heading}
      onUpdateGnss={onUpdateGnss}
    />
  );
};
