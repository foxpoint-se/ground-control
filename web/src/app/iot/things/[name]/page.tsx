"use client";

import { usePathname, useParams } from "next/navigation";

type ThingPageParams = {
  name: string;
};

export default function Page() {
  const { name } = useParams() as ThingPageParams;

  return <p>Thing: {name}</p>;
}
