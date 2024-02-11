import { NavBar } from "../../../components/new/NavBar";
import { Breadcrumbs } from "../../../components/new/Breadcrumbs";
import { ControlPanel } from "../../../components/control-panel/ControlPanel";

export const BackendPage = ({
  name,
  address,
}: {
  name: string;
  address: string;
}) => {
  const fullUrl = `ws://${address}:9090`;
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
          <ControlPanel transportType="ros" wsBackendUrl={fullUrl} />
        </main>
      </div>
    </div>
  );
};
