import { MapPanel } from "@/app/components/new/map/MapPanel";
import { useRosBackend } from "./stuff";
import { Coordinate } from "@/app/components/new/mapTypes";
import ROSLIB from "roslib";
import {
  GNSS_STATUS,
  GNSS_STATUS_MSG_TYPE,
  GnssStatus,
  ImuStatus,
} from "@/app/components/new/topics";
import { useEffect, useState } from "react";

const useRos = (url: string): ROSLIB.Ros | undefined => {
  const [ros, setRos] = useState<ROSLIB.Ros>();

  useEffect(() => {
    const rosInstance = new ROSLIB.Ros({ url });
    setRos(rosInstance);
    console.log("connected to", url);

    return () => {
      rosInstance.close();
      console.log("disconnected from", url);
    };
  }, [url]);

  return ros;
};

function useTopic<T>(
  ros: ROSLIB.Ros,
  topicName: string,
  messageType: string,
  onMessage?: (m: T) => void
): { publish: (m: T) => void } {
  const [topic, setTopic] = useState<ROSLIB.Topic>();

  const subscriber = (m: unknown) => {
    if (onMessage) {
      onMessage(m as T);
    }
  };

  useEffect(() => {
    const topicInstance = new ROSLIB.Topic({
      ros,
      name: topicName,
      messageType,
    });
    topicInstance.subscribe(subscriber);
    console.log("subscribed to ", topicName, "message type", messageType);
    setTopic(topicInstance);
  }, [ros, topicName, messageType]);

  const publish = (m: T) => {
    if (topic) {
      const msg = new ROSLIB.Message(m);
      topic.publish(msg);
    }
  };

  return { publish };
}
// const useGnssStatus = (): ROSLIB.Topic | undefined => {
//   const [listener, setListener] = useState<ROSLIB.Topic>();
//   const { ros } = useRosBackend();

//   useEffect(() => {
//     if (ros) {
//       const listener = new ROSLIB.Topic({
//         ros,
//         name: GNSS_STATUS,
//         messageType: GNSS_STATUS_MSG_TYPE,
//       });
//       setListener(listener);
//     }
//   }, [ros]);

//   return listener;
// };

const RosBridgeLoaded = ({ ros }: { ros: ROSLIB.Ros }) => {
  const [vehiclePosition, setVehiclePosition] = useState<Coordinate>();
  const [imuStatus, setImuStatus] = useState<ImuStatus>();
  const publish = useTopic<GnssStatus>(
    ros,
    "gnss/status",
    "eel_interfaces/GnssStatus",
    (m) => {
      setVehiclePosition(m);
    }
  );
  useTopic<ImuStatus>(ros, "imu/status", "eel_interfaces/ImuStatus", (m) => {
    setImuStatus(m);
  });

  return (
    <MapPanel
      vehiclePosition={vehiclePosition}
      vehicleRotation={imuStatus?.heading}
    />
  );
};

export const RosBridgeMap = () => {
  const ros = useRos("ws://localhost:9090");

  if (!ros) {
    return null;
  }

  return <RosBridgeLoaded ros={ros} />;
};
