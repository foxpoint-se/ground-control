import { NavBar } from "../../../components/NavBar";
import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { RosBridgeMap } from "./RosBridgeMap";
import { useRosBridge } from "./rosBridge";
import { RosBridgeGamepad } from "./RosBridgeGamepad";
import { RosBridgeDrivingControls } from "./RosBridgeDrivingControls";
import { RosBridgeRudderStatus } from "./RosBridgeRudderStatus";
import { RosBridgeImuStatus } from "./RosBridgeImuStatus";
import { RosBridgeNavStatus } from "./RosBridgeNavStatus";
import { RosBridgeBatteryStatus } from "./RosBridgeBatteryStatus";
import { RosBridgeTankControls } from "./RosBridgeTankControls";
import { RosBridgePidControls } from "./RosBridgePidControls";
import { RosBridgeDepthAndPitch } from "./RosBridgeDepthAndPitch";
import { useState } from "react";
import { RosBridgeLeakageStatus } from "./RosBridgeLeakageStatus";
import { RosBridgeNamedMission } from "./RosBridgeNamedMission";

export const BackendPage = ({
  name,
  address,
}: {
  name: string;
  address: string;
}) => {
  const fullUrl = `ws://${address}:9090`;
  const { rosBridge } = useRosBridge(fullUrl);
  const [isYAxisEnabled, setYAxisEnabled] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar menuItems={[]}>
        <Breadcrumbs
          currentPage={`${name} (${fullUrl})`}
          crumbs={[{ label: "Ros Bridge", href: "/ros-bridge" }]}
        />
      </NavBar>
      <div className="max-w-screen-2xl px-sm mx-auto w-full grow">
        <main>
          <section className="grid grid-cols-12 gap-sm">
            <div className="col-span-12">
              <div className="max-w-2xl">
                {rosBridge && (
                  <RosBridgeGamepad
                    rosBridge={rosBridge}
                    isYAxisEnabled={isYAxisEnabled}
                  />
                )}
              </div>
            </div>
            <div className="col-span-12 lg:col-span-8 gap-sm flex flex-col">
              {rosBridge && <RosBridgeMap rosBridge={rosBridge} />}
              {rosBridge && <RosBridgeNamedMission rosBridge={rosBridge} />}
            </div>
            <div className="col-span-12 lg:col-span-4">
              {rosBridge && (
                <div className="grid grid-cols-2 gap-sm">
                  <div className="col-span-2">
                    <RosBridgeDrivingControls
                      rosBridge={rosBridge}
                      isYAxisEnabled={isYAxisEnabled}
                      onYAxisEnabledChange={setYAxisEnabled}
                    />
                  </div>
                  <div className="col-span-2">
                    <RosBridgeNavStatus rosBridge={rosBridge} />
                  </div>
                  <div className="col-span-1 flex flex-col space-y-sm">
                    <RosBridgeRudderStatus rosBridge={rosBridge} />
                    <RosBridgeBatteryStatus rosBridge={rosBridge} />
                    <RosBridgeLeakageStatus rosBridge={rosBridge} />
                  </div>
                  <div className="col-span-1">
                    <RosBridgeImuStatus rosBridge={rosBridge} />
                  </div>
                  <div className="col-span-2">
                    <RosBridgeTankControls rosBridge={rosBridge} />
                  </div>
                  <div className="col-span-2">
                    <RosBridgePidControls rosBridge={rosBridge} />
                  </div>
                  <div className="col-span-2">
                    <RosBridgeDepthAndPitch rosBridge={rosBridge} />
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
