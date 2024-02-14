import { NavBar } from "../../../components/new/NavBar";
import { Breadcrumbs } from "../../../components/new/Breadcrumbs";
import { Gamepad } from "../../../components/new/Gamepad";
import { ControlPanel } from "../../../components/control-panel/ControlPanel";
import { RosBridgeMap } from "./RosBridgeMap";
import { useRosBridge } from "./rosBridge";

const Battery = () => {
  return <div className="bg-slate-400">Battery</div>;
};

const Misc = () => {
  return (
    <div className="bg-slate-200 h-48 flex flex-col">
      <Battery />
    </div>
  );
};

export const BackendPage = ({
  name,
  address,
}: {
  name: string;
  address: string;
}) => {
  const fullUrl = "ws://localhost:9090";
  const { rosBridge } = useRosBridge("ws://localhost:9090");

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar menuItems={[]}>
        <Breadcrumbs
          currentPage={`${name} (${fullUrl})`}
          crumbs={[
            { label: "Ros Bridge", href: "/ros-bridge" },
            { label: "My backends", href: "/ros-bridge/backend" },
          ]}
        />
      </NavBar>
      <div className="max-w-screen-2xl px-sm mx-auto w-full grow">
        <main>
          <section className="grid grid-cols-12 gap-sm">
            <div className="col-span-12">
              <div className="max-w-xl">
                <Gamepad listeners={{}} />
              </div>
            </div>
            <div className="col-span-12 lg:col-span-8">
              {rosBridge && <RosBridgeMap rosBridge={rosBridge} />}
            </div>
            <div className="col-span-12 lg:col-span-4">
              <Misc />
            </div>
            <div className="col-span-12 lg:col-span-3"></div>
          </section>
          <hr className="mb-3xl" />
          {/* <ControlPanel transportType="ros" wsBackendUrl={fullUrl} /> */}
        </main>
      </div>
    </div>
  );
};
