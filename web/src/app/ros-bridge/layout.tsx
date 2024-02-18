import { ReactNode } from "react";

const RosBridgeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <footer className="py-2xl mt-lg"></footer>
    </>
  );
};

export default RosBridgeLayout;
