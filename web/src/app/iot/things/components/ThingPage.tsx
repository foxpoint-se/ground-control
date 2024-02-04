"use client";

import { useEelPublisher, useSubscribeToTopic } from "./useSubscribeToTopic";
import { Gamepad, GamepadListeners } from "../../components/Gamepad";
import { useCurrentAuthSession } from "../../components/authContext";
import { SignedInMenu } from "../../components/SignedInMenu";
import { Breadcrumbs } from "../../components/Breadcrumbs";

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
  const { publishMotorCmd } = useEelPublisher(thingName);

  // TODO: possibly throttle commands.
  // by how often or by rounding the values, from the gamepad,
  // since we can't be that granular anyway
  const gamepadListeners: GamepadListeners = {
    joystick: {
      left: {
        y: {
          onChange: async (newValue: number) => {
            publishMotorCmd({ data: newValue });
          },
        },
      },
    },
  };

  return (
    <>
      <h1 className="text-5xl font-bold mb-md">{thingName}</h1>
      <Gamepad listeners={gamepadListeners} />
      {/* <h1 className="text-3xl font-bold mb-md">{thingName}</h1> */}
      <h2 className="text-xl font-bold mb-sm">Battery and velocity</h2>
      {/* <LastMessage
          lastMessage={
            telemetryData ? JSON.stringify(telemetryData) : "(no message yet)"
          }
        /> */}
    </>
  );
};

const ThingDashboardLoader = ({ thingName }: { thingName: string }) => {
  const currentAuthSession = useCurrentAuthSession();

  if (currentAuthSession.isLoading) {
    return <div>Loading...</div>;
  }

  if (currentAuthSession.hasError) {
    return <div>{currentAuthSession.errorMessage}</div>;
  }

  return <ThingDashboard thingName={thingName} />;
};

export const ThingPage = ({ thingName }: { thingName: string }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <SignedInMenu />
      <div className="max-w-screen-2xl px-sm mx-auto w-full grow">
        <Breadcrumbs
          currentPage={thingName}
          crumbs={[
            { label: "IoT", href: "/iot" },
            { label: "My things", href: "/iot/things" },
          ]}
        />
        <main>
          <ThingDashboardLoader thingName={thingName} />
        </main>
      </div>
    </div>
  );
};
