"use client";

import { ReactNode, useState } from "react";
import { useEelPublisher, useSubscribeToTopic } from "./useSubscribeToTopic";
import { NavBar } from "../../components/NavBar";
import { useRouter } from "next/navigation";
import { Gamepad, GamepadListeners } from "../../components/Gamepad";
import {
  useAmplifyAuth,
  useCurrentAuthSession,
} from "../../components/authContext";

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
      <Main>
        <Gamepad listeners={gamepadListeners} />
        <h1 className="text-3xl font-bold mb-md">{thingName}</h1>
        <h2 className="text-xl font-bold mb-sm">Battery and velocity</h2>
        {/* <LastMessage
          lastMessage={
            telemetryData ? JSON.stringify(telemetryData) : "(no message yet)"
          }
        /> */}
      </Main>
    </>
  );
};

const Main = ({ children }: { children: ReactNode }) => {
  return <main className="px-sm">{children}</main>;
};

export const ThingPage = ({ thingName }: { thingName: string }) => {
  const amplifyAuth = useAmplifyAuth();
  // TODO: do we need to wait for this one??!?! depends on if the pubsub client needs credentials
  const currentAuthSession = useCurrentAuthSession();
  const router = useRouter();
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (amplifyAuth.isLoading) {
    return <Main>Loading...</Main>;
  }

  if (amplifyAuth.hasError) {
    return <Main>{amplifyAuth.errorMessage}</Main>;
  }

  const handleSignOutClick = () => {
    router.push("/");
    setTimeout(() => {
      amplifyAuth.data.signOut();
    }, 100);
  };

  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
      setIsFullScreen(true);
    }
  };
  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const fullScreenLabel = isFullScreen ? "Exit fullscreen" : "Fullscreen";
  const fullScreenAction = isFullScreen ? exitFullscreen : enterFullscreen;

  // TODO: maybe submenu to select widgets?
  return (
    <>
      <NavBar
        menuItems={[
          {
            label: fullScreenLabel,
            callback: fullScreenAction,
            hasCallback: true,
          },
          {
            label: "Sign out",
            callback: handleSignOutClick,
            hasCallback: true,
          },
        ]}
      />
      {/* TODO: do we need to wait for auth session before rendering this? */}
      <ThingDashboard thingName={thingName} />
    </>
  );
};
