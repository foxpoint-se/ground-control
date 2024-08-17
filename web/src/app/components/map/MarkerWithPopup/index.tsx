import dynamic from "next/dynamic";
import { MarkerWithPopupProps } from "./MarkerWithPopup";

const ClientOnlyDotMarker = dynamic(
  () => import("./MarkerWithPopup").then((module) => module.default),
  {
    ssr: false,
  }
);

const MarkerWithPopup = (props: MarkerWithPopupProps) => {
  return <ClientOnlyDotMarker {...props} />;
};

export default MarkerWithPopup;
