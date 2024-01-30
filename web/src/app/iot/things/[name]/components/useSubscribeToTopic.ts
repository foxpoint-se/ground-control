import { PubSub } from "@aws-amplify/pubsub";
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
