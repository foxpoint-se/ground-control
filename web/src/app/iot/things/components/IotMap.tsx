import { Coordinate } from "@/app/components/mapTypes";
import { ImuStatus, TracedRoute } from "@/app/components/topics";
import { useState } from "react";
import {
  useGnssSubscriber,
  useImuSubscriber,
  useLocalizationSubscriber,
  useTracedRouteSubscriber,
} from "./useSubscribeToTopic";
import { MapPanel } from "@/app/components/map/MapPanel";

export const IotMap = ({ thingName }: { thingName: string }) => {
  const [vehiclePosition, setVehiclePosition] = useState<Coordinate>();
  const [ghostPosition, setGhostPosition] = useState<Coordinate>();
  const [imuStatus, setImuStatus] = useState<ImuStatus>();
  const [tracedRoutes, setTracedRoutes] = useState<TracedRoute[]>([]);
  useImuSubscriber(thingName, setImuStatus);
  useGnssSubscriber(thingName, setVehiclePosition);
  useLocalizationSubscriber(thingName, setGhostPosition);

  useTracedRouteSubscriber(thingName, (newSegment: TracedRoute) => {
    setTracedRoutes((prev) => {
      const newList = [...prev, newSegment];
      return newList;
    });
  });

  const onUpdateGnss = (c: Coordinate) => {
    console.log("Not implemented. Coord:", c);
  };

  return (
    <MapPanel
      vehiclePosition={vehiclePosition}
      vehicleRotation={imuStatus?.heading}
      onUpdateGnss={onUpdateGnss}
      ghostPosition={ghostPosition}
      tracedRoutes={tracedRoutes}
    />
  );
};
