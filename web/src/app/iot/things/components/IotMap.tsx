import { Coordinate } from "@/app/components/mapTypes";
import { Assignment, ImuStatus, TracedRoute } from "@/app/components/topics";
import { useState } from "react";
import {
  useImuSubscriber,
  useLocalizationSubscriber,
  useNavMissionPublisher,
  useTracedRouteSubscriber,
  useGnssPublisher,
} from "./useSubscribeToTopic";
import { MapPanel } from "@/app/components/map/MapPanel";

export const IotMap = ({ thingName }: { thingName: string }) => {
  const [ghostPosition, setGhostPosition] = useState<Coordinate>();
  const [imuStatus, setImuStatus] = useState<ImuStatus>();
  const [tracedRoutes, setTracedRoutes] = useState<TracedRoute[]>([]);
  useImuSubscriber(thingName, setImuStatus);
  useLocalizationSubscriber(thingName, setGhostPosition);
  const { publishNavMissionCmd } = useNavMissionPublisher(thingName);
  const { publishGnssStatus } = useGnssPublisher(thingName);

  useTracedRouteSubscriber(thingName, (newSegment: TracedRoute) => {
    setTracedRoutes((prev) => {
      const newList = [...prev, newSegment];
      return newList;
    });
  });

  const onSendKnownPosition = (c: Coordinate) => {
    publishGnssStatus(c);
  };

  const onSendMission = (assignments: Assignment[]) => {
    publishNavMissionCmd({ assignments });
  };

  return (
    <MapPanel
      vehicleRotation={imuStatus?.heading}
      onSendKnownPosition={onSendKnownPosition}
      ghostPosition={ghostPosition}
      tracedRoutes={tracedRoutes}
      onSendMission={onSendMission}
    />
  );
};
