import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import ROSLIB from "roslib";

type TransportType = "ros";

type EelContext = {
  rosConnections: ROSLIB.Ros[];
};

const EelTopicsContext = createContext<EelContext>({
  rosConnections: [],
});

const EelTopicsProvider = ({
  transportType,
  wsBackendUrl,
  children,
}: {
  transportType: TransportType;
  children: ReactNode;
  wsBackendUrl: string;
}) => {
  // Workaround since useEffect is called twice (in dev mode?) so we want to be able
  // to disconnect from all connected sockets
  const [rosConnections, setRosConnections] = useState<ROSLIB.Ros[]>([]);
  console.log("Eel topics provider");

  useEffect(() => {
    if (transportType === "ros") {
      if (rosConnections.length > 0) {
        console.log("ros connections exist. disconnecting");
        rosConnections.forEach((r) => {
          r.close();
        });
        setRosConnections([]);
      } else {
        const rosConn = new ROSLIB.Ros({ url: wsBackendUrl });
        rosConn.on("connection", function () {
          console.log("Connected to websocket server.");
        });

        rosConn.on("error", function (error) {
          console.log("Error connecting to websocket server: ", error);
        });

        rosConn.on("close", function () {
          console.log("Connection to websocket server closed.");
        });
        setRosConnections((prev) => [...prev, rosConn]);
      }
    } else {
      if (rosConnections.length > 0) {
        console.log("ros connections exist ANOTHER. disconnecting");
        rosConnections.forEach((r) => {
          r.close();
        });
        setRosConnections([]);
      }
    }

    return () => {
      if (rosConnections.length > 0) {
        console.log("ros connections exist ANOTHER AGAIN. disconnecting");
        rosConnections.forEach((r) => {
          r.close();
        });
        setRosConnections([]);
      }
    };
  }, [transportType]);

  return (
    <EelTopicsContext.Provider value={{ rosConnections }}>
      {children}
    </EelTopicsContext.Provider>
  );
};

export const SubscriberContext = createContext<{
  subscribe?: Subscribe;
  send?: Send;
}>({
  subscribe: undefined,
  send: undefined,
});

type Subscribe = (
  topic: string,
  messageType: string,
  callback: (msg: any) => void
) => void;
type Send = (topic: string, messageType: string, message: any) => void;

const CallbacksProvider = ({ children }: { children: ReactNode }) => {
  const { rosConnections } = useContext(EelTopicsContext);
  console.log("inner provider", { rosConnections });

  const subscribe = useCallback<Subscribe>(
    (topic, messageType, callback) => {
      console.log("subscribing to", topic, rosConnections);

      if (rosConnections.length > 0) {
        const rosConn = rosConnections[0];
        const listener = new ROSLIB.Topic({
          ros: rosConn,
          name: topic,
          messageType,
        });
        listener.subscribe(callback);
      }
    },
    [rosConnections]
  );

  const send = useCallback<Send>(
    (topic, messageType, message) => {
      if (rosConnections.length > 0) {
        const rosConn = rosConnections[0];

        const publisher = new ROSLIB.Topic({
          ros: rosConn,
          name: topic,
          messageType: messageType,
        });

        const msg = new ROSLIB.Message(message);
        publisher.publish(msg);
      }
    },
    [rosConnections]
  );

  return (
    <SubscriberContext.Provider value={{ subscribe, send }}>
      {children}
    </SubscriberContext.Provider>
  );
};

type SubscriberProviderProps = {
  children: ReactNode;
  selectedSource: TransportType;
  wsBackendUrl: string;
};

export const SubscriberProvider = ({
  children,
  selectedSource,
  wsBackendUrl,
}: SubscriberProviderProps) => {
  return (
    <EelTopicsProvider
      transportType={selectedSource}
      wsBackendUrl={wsBackendUrl}
    >
      <CallbacksProvider>{children}</CallbacksProvider>
    </EelTopicsProvider>
  );
};
