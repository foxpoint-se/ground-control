import { PubSub } from "@aws-amplify/pubsub";
import { PubSubContent } from "@aws-amplify/pubsub/dist/esm/types/PubSub";
import { useEffect, useState } from "react";
import {
  FloatMsg,
  MOTOR_CMD_TOPIC,
  MotorCmdMsg,
  RUDDER_HORIZONTAL_CMD,
  RUDDER_VERTICAL_CMD,
} from "../../components/topics";

const pubsub = new PubSub({
  region: "eu-west-1",
  endpoint: "wss://a3c7yl7o7rq6cp-ats.iot.eu-west-1.amazonaws.com/mqtt",
});

// NOTE: consider using only one `subscribe`, passing in multiple topics.
// If we get some network problems of some sort, it might be worth doing.
// Check here how to get the current topic, so that can handle each message per topic:
// https://github.com/aws-amplify/amplify-js/issues/1025
// So far I can't see that there's any problem. Only one websocket is created anyway.
// So this should be good enough.
function useSubscribeToTopic<Type>(topic: string): Type | undefined {
  const [data, setData] = useState<Type>();

  useEffect(() => {
    const subscription = pubsub.subscribe({ topics: [topic] }).subscribe({
      next: (receivedData) => {
        const newData = receivedData as Type;
        setData(newData);
      },
      error: (err) => {
        console.log("err", err);
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return data;
}

export function useEelSubscriber<Type>(
  thingName: string,
  topic: string
): Type | undefined {
  const data = useSubscribeToTopic<Type>(`${thingName}/${topic}`);
  return data;
}

type PublishHandler = <T extends PubSubContent>(
  topic: string,
  data: T | undefined
) => void;

// NOTE: beware to not call this before auth session has been set up
// For some reason we don't need to pass any credentials into to `new PubSub()`
// but as long as we have got an auth session already, everything's fine.
// In case of emergency, maybe try:
// const iotClient = new IoT({
//   region: "eu-west-1",
//   endpoint: "https://iot.eu-west-1.amazonaws.com",
//   credentials: authSession.credentials,
// });
const useTriggerPublisher = (): { publish: PublishHandler } => {
  useEffect(() => {
    pubsub.subscribe({ topics: [] }).subscribe();
  }, []);

  const publish: PublishHandler = (topic, data) => {
    if (data) {
      pubsub
        .publish({
          topics: [topic],
          message: data,
        })
        .catch((reason) => console.error(reason));
    }
  };

  return { publish };
};

type EelPublisher = {
  publishMotorCmd: (msg: MotorCmdMsg) => void;
  publishRudderXCmd: (msg: FloatMsg) => void;
  publishRudderYCmd: (msg: FloatMsg) => void;
};

export const useEelPublisher = (thingName: string): EelPublisher => {
  const publisher = useTriggerPublisher();

  return {
    publishMotorCmd: (msg: MotorCmdMsg) => {
      const topic = `${thingName}/${MOTOR_CMD_TOPIC}`;
      publisher.publish(topic, msg);
    },
    publishRudderXCmd: (msg: FloatMsg) => {
      const topic = `${thingName}/${RUDDER_HORIZONTAL_CMD}`;
      publisher.publish(topic, msg);
    },
    publishRudderYCmd: (msg: FloatMsg) => {
      const topic = `${thingName}/${RUDDER_VERTICAL_CMD}`;
      publisher.publish(topic, msg);
    },
  };
};
