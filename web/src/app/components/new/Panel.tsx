import { ReactNode } from "react";

export const Panel = ({ children }: { children?: ReactNode }) => {
  return (
    <section className="p-xs bg-neutral-100 shadow-md rounded overflow-hidden">
      {children}
    </section>
  );
};
