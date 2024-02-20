import dynamic from "next/dynamic";
import { VehicleMarkerProps } from "./ClientOnlyVehicleMarker";

const ClientOnlyDotMarker = dynamic(
  () => import("./ClientOnlyVehicleMarker").then((module) => module.default),
  {
    ssr: false,
  }
);

const VehicleMarker = (props: VehicleMarkerProps) => {
  return <ClientOnlyDotMarker {...props} />;
};

export default VehicleMarker;
