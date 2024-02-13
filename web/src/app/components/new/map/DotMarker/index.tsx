import dynamic from "next/dynamic";
import { MarkerProps } from "react-leaflet";

const ClientOnlyDotMarker = dynamic(
  () => import("./ClientOnlyDotMarker").then((module) => module.default),
  {
    ssr: false,
  }
);

const DotMarker = (props: MarkerProps) => {
  return <ClientOnlyDotMarker {...props} />;
};

export default DotMarker;
