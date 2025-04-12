import { NavBar } from "../../../components/NavBar";
import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { useRosBridge } from "../../../ros-bridge/backend/components/rosBridge";
import { RosBridgeMap2 } from "./RosBridgeMap2";

export const Backend2Page = ({
  name,
  address,
}: {
  name: string;
  address: string;
}) => {
  const fullUrl = `ws://${address}:9090`;
  const { rosBridge } = useRosBridge(fullUrl);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar menuItems={[]}>
        <Breadcrumbs
          currentPage={`${name} (${fullUrl})`}
          crumbs={[{ label: "Ros Bridge 2", href: "/ros-bridge2" }]}
        />
      </NavBar>
      <div className="max-w-screen-2xl px-sm mx-auto w-full grow">
        <main>
          <section className="grid grid-cols-12 gap-sm">
            <div className="col-span-12">
              {rosBridge && <RosBridgeMap2 rosBridge={rosBridge} />}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
