"use client";

import { useState } from "react";
import {
  useMotorPublisher,
  useRudderXPublisher,
  useRudderYPublisher,
  useTest1Subscriber,
  useTest2Subscriber,
} from "./useSubscribeToTopic";
import { Gamepad, GamepadListeners } from "../../../components/new/Gamepad";
import { useCurrentAuthSession } from "../../components/authContext";
import { SignedInMenu } from "../../components/SignedInMenu";
import { Breadcrumbs } from "../../../components/new/Breadcrumbs";

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
  const [awsMessage1, setAwsMessage1] = useState<AWSMessage>();
  const [awsMessage2, setAwsMessage2] = useState<AWSMessage>();

  useTest1Subscriber(thingName, setAwsMessage1);
  useTest2Subscriber(thingName, setAwsMessage2);

  const { publishMotorCmd } = useMotorPublisher(thingName);
  const { publishRudderXCmd } = useRudderXPublisher(thingName);
  const { publishRudderYCmd } = useRudderYPublisher(thingName);

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
      right: {
        x: {
          onChange: async (newValue: number) => {
            publishRudderXCmd({ data: newValue });
          },
        },
        y: {
          onChange: async (newValue: number) => {
            publishRudderYCmd({ data: newValue });
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
      <SignedInMenu
        breadcrumbs={
          <Breadcrumbs
            currentPage={thingName}
            crumbs={[
              { label: "IoT", href: "/iot" },
              { label: "My things", href: "/iot/things" },
            ]}
          />
        }
      />
      <div className="max-w-screen-2xl px-sm mx-auto w-full grow">
        <main>
          <ThingDashboardLoader thingName={thingName} />
        </main>
      </div>
    </div>
  );
};
