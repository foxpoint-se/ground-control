import { useEffect, useState } from "react";
import ROSLIB from "roslib";
import { useTracedRouteSubscriber2 } from "./rosBridge2";
import { MapPanel2 } from "./MapPanel2";
import { TracedRoute } from "@/app/components/topics";

export const RosBridgeMap2 = ({ rosBridge }: { rosBridge: ROSLIB.Ros }) => {
  const [tracedRoutes, setTracedRoutes] = useState<TracedRoute[]>([]);

  useTracedRouteSubscriber2(rosBridge, (newSegment: TracedRoute) => {
    console.log("newSegment", newSegment);
    setTracedRoutes((prev) => {
      const newList = [...prev, newSegment];
      return newList;
    });
  });

  return (
    <div className="grid grid-cols-4 gap-sm">
      <div className="col-span-4">
        <MapPanel2
          tracedRoutes={tracedRoutes}
          onSendKnownPosition={() => {}}
          vehiclePosition={undefined}
          ghostPosition={undefined}
        />
      </div>
    </div>
  );
};
