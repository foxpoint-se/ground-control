import { PubSub } from "@aws-amplify/pubsub";
import { useEffect } from "react";
import {
  BATTERY_STATUS,
  BatteryStatusMqtt,
  BoolMsg,
  Coordinate,
  DEPTH_CONTROL_CMD,
  DepthControlCmd,
  FloatMsg,
  FRONT_TANK_CMD,
  FRONT_TANK_STATUS,
  GNSS_STATUS,
  GnssStatus,
  IMU_STATUS,
  ImuStatus,
  LEAKAGE_STATUS,
  LeakageStatus,
  LOCALIZATION_STATUS,
  MOTOR_CMD_TOPIC,
  MotorCmdMsg,
  NAV_CMD,
  NAV_STATUS,
  NavStatus,
  PRESSURE_STATUS,
  PressureStatus,
  REAR_TANK_CMD,
  REAR_TANK_STATUS,
  ROUTE_TRACING_UPDATES,
  RUDDER_X_CMD,
  RUDDER_Y_CMD,
  TankStatus,
  TracedRoute,
  NavigationMission,
  NAV_MISSION_CMD,
} from "../../../components/topics";

const pubsub = new PubSub({
  region: "eu-west-1",
  endpoint: "wss://a3c7yl7o7rq6cp-ats.iot.eu-west-1.amazonaws.com/mqtt",
});

// NOTE: beware to not call this before auth session has been set up
// For some reason we don't need to pass any credentials into to `new PubSub()`
// but as long as we have got an auth session already, everything's fine.
// In case of emergency, maybe try:
// const iotClient = new IoT({
//   region: "eu-west-1",
//   endpoint: "https://iot.eu-west-1.amazonaws.com",
//   credentials: authSession.credentials,
// });

// NOTE: consider using only one `subscribe`, passing in multiple topics.
// If we get some network problems of some sort, it might be worth doing.
// Check here how to get the current topic, so that can handle each message per topic:
// https://github.com/aws-amplify/amplify-js/issues/1025
// So far I can't see that there's any problem. Only one websocket is created anyway.
// So this should be good enough.
function useTopic<T>(
  topic: string,
  onMessage?: (m: T) => void
): { publish: (m: T) => void } {
  const subscriber = (m: unknown) => {
    if (onMessage) {
      onMessage(m as T);
    }
  };
  useEffect(() => {
    const subscription = pubsub.subscribe({ topics: [topic] }).subscribe({
      next: subscriber,
      error: (err) => {
        console.log("subscription error", err);
      },
    });
    console.log("subscribed to", topic);
    return () => {
      subscription.unsubscribe();
      console.log("unsubscribed from", topic);
    };
  }, [topic]);

  const publish = (m: T) => {
    if (m) {
      pubsub
        .publish({
          topics: [topic],
          message: m,
        })
        .catch((reason) => console.error(reason));
    }
  };

  return { publish };
}

function useSubscriber<T>(topic: string, onMessage: (m: T) => void) {
  useTopic<T>(topic, onMessage);
}

function usePublisher<T>(topic: string): { publish: (m: T) => void } {
  return useTopic<T>(topic);
}

export const useMotorPublisher = (
  thingName: string
): { publishMotorCmd: (m: MotorCmdMsg) => void } => {
  const topic = `${thingName}/${MOTOR_CMD_TOPIC}`;
  const { publish: publishMotorCmd } = usePublisher<MotorCmdMsg>(topic);
  return { publishMotorCmd };
};

export const useRudderXPublisher = (
  thingName: string
): { publishRudderXCmd: (m: FloatMsg) => void } => {
  const topic = `${thingName}/${RUDDER_X_CMD}`;
  const { publish: publishRudderXCmd } = usePublisher<FloatMsg>(topic);
  return { publishRudderXCmd };
};

export const useRudderYPublisher = (
  thingName: string
): { publishRudderYCmd: (m: FloatMsg) => void } => {
  const topic = `${thingName}/${RUDDER_Y_CMD}`;
  const { publish: publishRudderYCmd } = usePublisher<FloatMsg>(topic);
  return { publishRudderYCmd };
};

export const usePitchDepthPublisher = (
  thingName: string
): { publishPitchDepthCmd: (m: DepthControlCmd) => void } => {
  const topic = `${thingName}/${DEPTH_CONTROL_CMD}`;
  const { publish: publishPitchDepthCmd } =
    usePublisher<DepthControlCmd>(topic);
  return { publishPitchDepthCmd };
};

export const useImuSubscriber = (
  thingName: string,
  onMessage: (m: ImuStatus) => void
) => {
  const topic = `${thingName}/${IMU_STATUS}`;
  useSubscriber<ImuStatus>(topic, onMessage);
};

export const usePressureSubscriber = (
  thingName: string,
  onMessage: (m: PressureStatus) => void
) => {
  const topic = `${thingName}/${PRESSURE_STATUS}`;
  useSubscriber<PressureStatus>(topic, onMessage);
};

export const useGnssSubscriber = (
  thingName: string,
  onMessage: (m: GnssStatus) => void
) => {
  const topic = `${thingName}/${GNSS_STATUS}`;
  useSubscriber<GnssStatus>(topic, onMessage);
};

export const useGnssPublisher = (
  thingName: string
): { publishGnssStatus: (m: Coordinate) => void } => {
  const topic = `${thingName}/${GNSS_STATUS}`;
  const { publish: publishGnssStatus } = usePublisher<Coordinate>(topic);
  return { publishGnssStatus };
};

export const useLocalizationSubscriber = (
  thingName: string,
  onMessage: (m: Coordinate) => void
) => {
  const topic = `${thingName}/${LOCALIZATION_STATUS}`;
  useSubscriber<Coordinate>(topic, onMessage);
};

export const useNavPublisher = (
  thingName: string
): { publishNavCmd: (m: BoolMsg) => void } => {
  const topic = `${thingName}/${NAV_CMD}`;
  const { publish: publishNavCmd } = usePublisher<BoolMsg>(topic);
  return { publishNavCmd };
};

export const useNavMissionPublisher = (
  thingName: string
): { publishNavMissionCmd: (m: NavigationMission) => void } => {
  const topic = `${thingName}/${NAV_MISSION_CMD}`;
  const { publish: publishNavMissionCmd } =
    usePublisher<NavigationMission>(topic);
  return { publishNavMissionCmd };
};

export const useFrontTankPublisher = (
  thingName: string
): { publishFrontTankCmd: (m: FloatMsg) => void } => {
  const topic = `${thingName}/${FRONT_TANK_CMD}`;
  const { publish: publishFrontTankCmd } = usePublisher<FloatMsg>(topic);
  return { publishFrontTankCmd };
};

export const useRearTankPublisher = (
  thingName: string
): { publishRearTankCmd: (m: FloatMsg) => void } => {
  const topic = `${thingName}/${REAR_TANK_CMD}`;
  const { publish: publishRearTankCmd } = usePublisher<FloatMsg>(topic);
  return { publishRearTankCmd };
};

export const useFrontTankSubscriber = (
  thingName: string,
  onMessage: (m: TankStatus) => void
) => {
  const topic = `${thingName}/${FRONT_TANK_STATUS}`;
  useSubscriber<TankStatus>(topic, onMessage);
};
export const useRearTankSubscriber = (
  thingName: string,
  onMessage: (m: TankStatus) => void
) => {
  const topic = `${thingName}/${REAR_TANK_STATUS}`;
  useSubscriber<TankStatus>(topic, onMessage);
};

export const useNavStatusSubscriber = (
  thingName: string,
  onMessage: (m: NavStatus) => void
) => {
  const topic = `${thingName}/${NAV_STATUS}`;
  useSubscriber<NavStatus>(topic, onMessage);
};

export const useBatterySubscriber = (
  thingName: string,
  onMessage: (m: BatteryStatusMqtt) => void
) => {
  const topic = `${thingName}/${BATTERY_STATUS}`;
  useSubscriber<BatteryStatusMqtt>(topic, onMessage);
};

export const useLeakageStatusSubscriber = (
  thingName: string,
  onMessage: (m: LeakageStatus) => void
) => {
  const topic = `${thingName}/${LEAKAGE_STATUS}`;
  useSubscriber<LeakageStatus>(topic, onMessage);
};

export const useTracedRouteSubscriber = (
  thingName: string,
  onMessage: (m: TracedRoute) => void
) => {
  const topic = `${thingName}/${ROUTE_TRACING_UPDATES}`;
  useSubscriber<TracedRoute>(topic, onMessage);
};
