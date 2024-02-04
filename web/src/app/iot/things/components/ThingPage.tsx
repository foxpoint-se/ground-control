"use client";

import { useEelPublisher, useEelSubscriber } from "./useSubscribeToTopic";
import { Gamepad, GamepadListeners } from "../../components/Gamepad";
import { useCurrentAuthSession } from "../../components/authContext";
import { SignedInMenu } from "../../components/SignedInMenu";
import { Breadcrumbs } from "../../components/Breadcrumbs";

const LastMessage = ({ lastMessage }: { lastMessage: string }) => {
  return (
    <div>
      <span className="mr-md">Last message:</span>
      <span className="font-bold">{lastMessage}</span>
    </div>
  );
};

type AWSMessage = {
  message: string;
};

const ThingDashboard = ({ thingName }: { thingName: string }) => {
  const awsMessage1 = useEelSubscriber<AWSMessage>(thingName, "test1");
  const awsMessage2 = useEelSubscriber<AWSMessage>(thingName, "test2");
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
      <div className="mt-sm">
        <h2 className="text-xl font-bold mb-sm">Test 1</h2>
        <LastMessage
          lastMessage={
            awsMessage1 ? JSON.stringify(awsMessage1) : "(no message yet)"
          }
        />
        <h2 className="text-xl font-bold mb-sm">Test 2</h2>
        <LastMessage
          lastMessage={
            awsMessage2 ? JSON.stringify(awsMessage2) : "(no message yet)"
          }
        />
      </div>
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

// TODO:
// snygga till UI lite? JAPP
// menyn liksom JAPP
// lite marginal JAPP
// snygga till subscribe lite grann också. JAPP
// antingen med flera subscriptions (kolla network om det blir fler grejer då)
// eller typ såhär: https://github.com/aws-amplify/amplify-js/issues/1025
// och sen, plocka upp cmd från ålen.
// testa på tvålen
