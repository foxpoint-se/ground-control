import { ControlPanel } from "../components/control-panel/ControlPanel";

type RosBackend = "local" | "lan" | "vpn";
const backendUrl: Record<RosBackend, string> = {
  local: "ws://localhost:9090",
  lan: "ws://192.168.1.118:9090",
  // vpn: "ws://172.27.208.110:9090",
  vpn: "ws://10.66.66.3:9090", // I think this does not work, and that you should use the `local` route instead.
};

export const RosPage = ({ backend }: { backend: RosBackend }) => {
  const wsBackendUrl = backendUrl[backend];

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex bg-neutral-200 mb-2 p-2">
        <h1 className="text-2xl">ROS {wsBackendUrl}</h1>
      </div>
      <div className="p-4 grow flex">
        <ControlPanel transportType="ros" wsBackendUrl={wsBackendUrl} />
      </div>
    </main>
  );
};
