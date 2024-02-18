import { useCallback, useEffect, useState } from "react";
import ROSLIB from "roslib";
import {
  GnssStatus,
  ImuStatus,
  FloatMsg,
  BoolMsg,
  Vector3Msg,
  NavStatus,
} from "@/app/components/new/topics";

export const useRosBridge = (
  url: string
): { rosBridge?: ROSLIB.Ros; isConnected: boolean } => {
  const [rosBridge, setRosBridge] = useState<ROSLIB.Ros>();
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const rosInstance = new ROSLIB.Ros({ url });
    rosInstance.on("connection", () => {
      setIsConnected(() => true);
    });
    rosInstance.on("close", () => {
      console.log("Connection to", url, "was closed");
      setIsConnected(() => false);
    });
    rosInstance.on("error", (err) => {
      console.warn("Could not connect to", url, err);
      setIsConnected(() => false);
    });
    setRosBridge(() => rosInstance);

    return () => {
      if (rosInstance.isConnected) {
        rosInstance.close();
        console.log("disconnected from", url);
        setRosBridge(() => undefined);
      }
    };
  }, [url]);

  return { rosBridge, isConnected };
};

function useTopic<T>(
  ros: ROSLIB.Ros,
  topicName: string,
  messageType: string,
  onMessage?: (m: T) => void
): { publisher: ROSLIB.Topic } {
  const topicInstance = new ROSLIB.Topic({
    ros,
    name: topicName,
    messageType,
  });
  const [topic, setTopic] = useState<ROSLIB.Topic>(topicInstance);

  const subscriber = useCallback(
    (m: unknown) => {
      if (onMessage) {
        onMessage(m as T);
      }
    },
    [onMessage]
  );

  useEffect(() => {
    console.log("Subscribing to", topicName, `(${messageType})`);
    topic.subscribe(subscriber);
  }, []);

  return { publisher: topic };
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
  const { publisher } = useTopic<T>(ros, topic, messageType);

  const publish = useCallback(
    (m: any) => {
      publisher.publish(m);
    },
    [publisher]
  );
  return { publish };
}

export const useGnssSubscriber = (
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

export const useImuSubscriber = (
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

export const useNavSubscriber = (
  ros: ROSLIB.Ros,
  onMessage: (m: NavStatus) => void
) => {
  useSubscriber<NavStatus>(
    ros,
    "nav/status",
    "eel_interfaces/NavigationStatus",
    onMessage
  );
};

export const useMotorPublisher = (
  ros: ROSLIB.Ros
): { publishMotorCmd: (m: FloatMsg) => void } => {
  const { publish: publishMotorCmd } = usePublisher<FloatMsg>(
    ros,
    "motor/cmd",
    "std_msgs/msg/Float32"
  );
  return {
    publishMotorCmd: (m) => {
      publishMotorCmd(m);
    },
  };
};

export const useRudderXPublisher = (
  ros: ROSLIB.Ros
): { publishRudderXCmd: (m: FloatMsg) => void } => {
  const { publish: publishRudderXCmd } = usePublisher<FloatMsg>(
    ros,
    "rudder_horizontal/cmd",
    "std_msgs/msg/Float32"
  );
  return { publishRudderXCmd };
};

export const useRudderYPublisher = (
  ros: ROSLIB.Ros
): { publishRudderYCmd: (m: FloatMsg) => void } => {
  const { publish: publishRudderYCmd } = usePublisher<FloatMsg>(
    ros,
    "rudder_vertical/cmd",
    "std_msgs/msg/Float32"
  );
  return { publishRudderYCmd };
};

export const useNavPublisher = (
  ros: ROSLIB.Ros
): { publishNavCmd: (m: BoolMsg) => void } => {
  const { publish: publishNavCmd } = usePublisher<BoolMsg>(
    ros,
    "nav/cmd",
    "std_msgs/msg/Bool"
  );
  return { publishNavCmd };
};

export const useRudderStatusSubscriber = (
  ros: ROSLIB.Ros,
  onMessage: (m: Vector3Msg) => void
) => {
  useSubscriber<Vector3Msg>(
    ros,
    "rudder/status",
    "geometry_msgs/msg/Vector3",
    onMessage
  );
};
