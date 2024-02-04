import { PubSub } from "@aws-amplify/pubsub";
import { PubSubContent } from "@aws-amplify/pubsub/dist/esm/types/PubSub";
import { useEffect, useState } from "react";

const pubsub = new PubSub({
  region: "eu-west-1",
  endpoint: "wss://a3c7yl7o7rq6cp-ats.iot.eu-west-1.amazonaws.com/mqtt",
});

export function useSubscribeToTopic<Type>(topic: string): Type | undefined {
  const [data, setData] = useState<Type>();

  useEffect(() => {
    const subscription = pubsub.subscribe({ topics: [topic] }).subscribe({
      next: (receivedData) => {
        const newData = receivedData as Type;
        setData(newData);
        console.log(newData);
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

type PublishHandler = <T extends PubSubContent>(
  topic: string,
  data: T | undefined
) => void;

// NOTE: beware to not call this before auth session has been set up
// For some reason we don't need to pass any credentials into to `new PubSub()`
// but as long as we have got an auth session already, everything's fine.
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

const MOTOR_CMD_TOPIC = "motor/cmd";

type FloatMsg = {
  data: number;
};

type MotorCmdMsg = FloatMsg;

type EelPublisher = {
  publishMotorCmd: (msg: MotorCmdMsg) => void;
};

export const useEelPublisher = (thingName: string): EelPublisher => {
  const publisher = useTriggerPublisher();

  return {
    publishMotorCmd: (msg: MotorCmdMsg) => {
      const topic = `${thingName}/${MOTOR_CMD_TOPIC}`;
      publisher.publish(topic, msg);
    },
  };
};
