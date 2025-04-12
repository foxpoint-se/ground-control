import { useEffect } from "react";
import ROSLIB from "roslib";
import polylinesData from "@/data/example-polylines.json";
import { TracedRoute } from "@/app/components/topics";

interface SubmergedCoordinate {
  coordinate: {
    lat: number;
    lon: number;
  };
  depth: number;
}

export const useTracedRouteSubscriber2 = (
  rosBridge: ROSLIB.Ros,
  callback: (route: TracedRoute) => void
) => {
  useEffect(() => {
    if (!rosBridge) return;

    let intervalId: NodeJS.Timeout;

    const startMocking = () => {
      // Start with an empty route
      let currentRoute: TracedRoute = {
        path: [],
        started_at: new Date().toISOString(),
        ended_at: "",
        duration_seconds: "0",
        xy_distance_covered_meters: 0,
        average_depth_meters: 0,
      };

      // Add points one by one from the polylines data
      let pointIndex = 0;
      intervalId = setInterval(() => {
        if (pointIndex < polylinesData.polylines[0].coordinates.length) {
          const point = polylinesData.polylines[0].coordinates[pointIndex];
          currentRoute.path.push({
            coordinate: {
              lat: point[0],
              lon: point[1],
            },
            depth: 0, // Mock depth
          });
          currentRoute.ended_at = new Date().toISOString();
          currentRoute.duration_seconds = String(
            (new Date(currentRoute.ended_at).getTime() -
              new Date(currentRoute.started_at).getTime()) /
              1000
          );

          callback(currentRoute);
          pointIndex++;
        } else {
          clearInterval(intervalId);
        }
      }, 1000); // Add a point every second

      return () => {
        clearInterval(intervalId);
      };
    };

    const cleanup = startMocking();

    return () => {
      cleanup();
    };
  }, [rosBridge, callback]);
};
