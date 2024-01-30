"use client";

import { useParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useCurrentAuth } from "../../components/authContext";
import { PubSub } from "@aws-amplify/pubsub";
import { useSubscribeToTopic } from "./components/useSubscribeToTopic";

type ThingPageParams = {
  name: string;
};

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
  return <main className="px-md">{children}</main>;
};

export default function Page() {
  const { name } = useParams() as ThingPageParams;

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

  return <ThingDashboard thingName={name} />;
}
