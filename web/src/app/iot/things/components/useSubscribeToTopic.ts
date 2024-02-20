import { PubSub } from "@aws-amplify/pubsub";
import { useEffect } from "react";
import {
  FloatMsg,
  MOTOR_CMD_TOPIC,
  MotorCmdMsg,
  RUDDER_HORIZONTAL_CMD,
  RUDDER_VERTICAL_CMD,
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

type AWSMessage = {
  message: string;
};

export const useTest1Subscriber = (
  thingName: string,
  onMessage: (m: AWSMessage) => void
) => {
  const topic = `${thingName}/test1`;
  useSubscriber<AWSMessage>(topic, onMessage);
};

export const useTest2Subscriber = (
  thingName: string,
  onMessage: (m: AWSMessage) => void
) => {
  const topic = `${thingName}/test2`;
  useSubscriber<AWSMessage>(topic, onMessage);
};

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
  const topic = `${thingName}/${RUDDER_HORIZONTAL_CMD}`;
  const { publish: publishRudderXCmd } = usePublisher<FloatMsg>(topic);
  return { publishRudderXCmd };
};

export const useRudderYPublisher = (
  thingName: string
): { publishRudderYCmd: (m: FloatMsg) => void } => {
  const topic = `${thingName}/${RUDDER_VERTICAL_CMD}`;
  const { publish: publishRudderYCmd } = usePublisher<FloatMsg>(topic);
  return { publishRudderYCmd };
};
