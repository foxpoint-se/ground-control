"use client";

import { useState } from "react";
import { useCurrentAuthSession } from "../../components/authContext";
import { SignedInMenu } from "../../components/SignedInMenu";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { IotGamepad } from "./IotGamepad";
import { IotMap } from "./IotMap";
import { IotDrivingControls } from "./IotDrivingControls";
import { IotBatteryStatus } from "./IotBatteryStatus";
import { IotImuStatus } from "./IotImuStatus";
import { IotNavStatus } from "./IotNavStatus";
import { IotTankControls } from "./IotTankControls";
import { IotLeakageStatus } from "./IotLeakageStatus";
import { IotTankStatus } from "./IotTankStatus";
import { IotPitchDepthControls } from "./IotPitchDepthControls";

const ThingDashboard = ({ thingName }: { thingName: string }) => {
  const [isYAxisEnabled, setYAxisEnabled] = useState(true);

  return (
    <>
      <section className="grid grid-cols-12 gap-sm">
        <div className="col-span-12">
          <div className="max-w-2xl">
            <IotGamepad isYAxisEnabled={isYAxisEnabled} thingName={thingName} />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-8">
          <IotMap thingName={thingName} />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <div className="grid grid-cols-2 gap-sm">
            <div className="col-span-2">
              <IotDrivingControls
                thingName={thingName}
                isYAxisEnabled={isYAxisEnabled}
                onYAxisEnabledChange={setYAxisEnabled}
              />
            </div>
            <div className="col-span-2">
              <IotNavStatus thingName={thingName} />
            </div>
            <div className="col-span-1 space-y-sm">
              <IotBatteryStatus thingName={thingName} />
              <IotLeakageStatus thingName={thingName} />
            </div>
            <div className="col-span-1">
              <IotImuStatus thingName={thingName} />
            </div>
            <div className="col-span-2 space-y-sm">
              <IotTankControls thingName={thingName} />
              <IotPitchDepthControls thingName={thingName} />
              <IotTankStatus thingName={thingName} />
            </div>
          </div>
        </div>
      </section>
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
            crumbs={[{ label: "IoT", href: "/iot" }]}
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
