import { ReactNode } from "react";

export const Panel = ({ children }: { children?: ReactNode }) => {
  return (
    <section className="p-sm bg-[#f7f7ff] shadow-sm rounded overflow-hidden">
      {children}
    </section>
  );
};
