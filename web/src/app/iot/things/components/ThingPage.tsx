"use client";

import { ReactNode, useState } from "react";
import { useCurrentAuth } from "../../components/authContext";
import { useSubscribeToTopic } from "./useSubscribeToTopic";
import { NavBar } from "../../components/NavBar";
import { useRouter } from "next/navigation";
import { Gamepad } from "../../components/Gamepad";

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
    <>
      <Main>
        <Gamepad />
        <h1 className="text-3xl font-bold mb-md">{thingName}</h1>
        <h2 className="text-xl font-bold mb-sm">Battery and velocity</h2>
        <LastMessage
          lastMessage={
            telemetryData ? JSON.stringify(telemetryData) : "(no message yet)"
          }
        />
      </Main>
    </>
  );
};

const Main = ({ children }: { children: ReactNode }) => {
  return <main className="px-sm">{children}</main>;
};

export const ThingPage = ({ thingName }: { thingName: string }) => {
  const currentAuth = useCurrentAuth();
  const router = useRouter();
  const [isFullScreen, setIsFullScreen] = useState(false);

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

  const doSignOut = currentAuth.authenticatorState.data.signOut;

  const handleSignOutClick = () => {
    router.push("/");
    setTimeout(() => {
      doSignOut();
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

  // TODO: the menu in the navbar loads slower than previous menu.
  // maybe refactor the context into to different ones.
  // that way the username and signout button can be visible early, and the rest later on.

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
      <ThingDashboard thingName={thingName} />
    </>
  );
};
