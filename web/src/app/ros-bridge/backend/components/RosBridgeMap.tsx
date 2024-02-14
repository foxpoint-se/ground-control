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

const useRosBridge = (url: string): { rosBridge?: ROSLIB.Ros } => {
  const [rosBridge, setRosBridge] = useState<ROSLIB.Ros>();

  useEffect(() => {
    const rosInstance = new ROSLIB.Ros({ url });
    setRosBridge(rosInstance);
    console.log("connected to", url);

    return () => {
      rosInstance.close();
      console.log("disconnected from", url);
    };
  }, [url]);

  return { rosBridge };
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

function useSubscriber<T>(
  ros: ROSLIB.Ros,
  topic: string,
  messageType: string,
  onMessage: (m: T) => void
) {
  useTopic<T>(ros, topic, messageType, onMessage);
}

function usePublisher<T>(
  ros: ROSLIB.Ros,
  topic: string,
  messageType: string
): { publish: (m: T) => void } {
  return useTopic<T>(ros, topic, messageType);
}

const useGnssSubscriber = (
  ros: ROSLIB.Ros,
  onMessage: (m: GnssStatus) => void
) => {
  useSubscriber<GnssStatus>(
    ros,
    "gnss/status",
    "eel_interfaces/GnssStatus",
    onMessage
  );
};

const useImuSubscriber = (
  ros: ROSLIB.Ros,
  onMessage: (m: ImuStatus) => void
) => {
  useSubscriber<ImuStatus>(
    ros,
    "imu/status",
    "eel_interfaces/ImuStatus",
    onMessage
  );
};

const RosBridgeLoaded = ({ ros }: { ros: ROSLIB.Ros }) => {
  const [vehiclePosition, setVehiclePosition] = useState<Coordinate>();
  const [imuStatus, setImuStatus] = useState<ImuStatus>();
  useImuSubscriber(ros, setImuStatus);
  useGnssSubscriber(ros, setVehiclePosition);

  return (
    <MapPanel
      vehiclePosition={vehiclePosition}
      vehicleRotation={imuStatus?.heading}
    />
  );
};

export const RosBridgeMap = () => {
  const ros = useRosBridge("ws://localhost:9090");

  if (!ros) {
    return null;
  }

  return <RosBridgeLoaded ros={ros} />;
};
