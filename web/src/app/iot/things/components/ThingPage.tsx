"use client";

import { ReactNode } from "react";
import { useCurrentAuth } from "../../components/authContext";
import { useSubscribeToTopic } from "./useSubscribeToTopic";

type MockTelemetry = {
  battery: number;
  velocity: number;
};

const LastMessage = ({ lastMessage }: { lastMessage: string }) => {
  return (
    <div>
      <span className="mr-md">Last message:</span>
      <span className="font-bold">{lastMessage}</span>
    </div>
  );
};

// TODO: Do we need to pass in some credentials when initiating iot client, before running subscribe()???
// If everything works without problems, then I guess not?
// If it's needed, then maybe reuse the one in iotClient.ts?

// const iotClient = new IoT({
//   region: "eu-west-1",
//   endpoint: "https://iot.eu-west-1.amazonaws.com",
//   // credentials: credentialsAndIdentityId.credentials,
//   credentials: authSession.credentials,
// });

// const client = new IoTClient({end})

// const useIotClient = ({
//   credentials,
// }: {
//   credentials: AWSCredentials;
// }): IoT | undefined => {
//   const iotRef = useRef<IoT>();

//   return iotRef.current;
// };

const ThingDashboard = ({ thingName }: { thingName: string }) => {
  const telemetryData = useSubscribeToTopic<MockTelemetry>(
    "ros2_mock_telemetry_topic"
  );

  return (
    <Main>
      <h1 className="text-3xl font-bold mb-md">{thingName}</h1>
      <h2 className="text-xl font-bold mb-sm">Battery and velocity</h2>
      <LastMessage
        lastMessage={
          telemetryData ? JSON.stringify(telemetryData) : "(no message yet)"
        }
      />
    </Main>
  );
};

const Main = ({ children }: { children: ReactNode }) => {
  return <main className="px-sm">{children}</main>;
};

export const ThingPage = ({ thingName }: { thingName: string }) => {
  const currentAuth = useCurrentAuth();

  if (
    currentAuth.authSessionState.isLoading ||
    currentAuth.authenticatorState.isLoading
  ) {
    return <Main>Loading...</Main>;
  }

  if (currentAuth.authSessionState.hasError) {
    return <Main>{currentAuth.authSessionState.errorMessage}</Main>;
  }
  if (currentAuth.authenticatorState.hasError) {
    return <Main>{currentAuth.authenticatorState.errorMessage}</Main>;
  }

  return <ThingDashboard thingName={thingName} />;
};
