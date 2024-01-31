"use client";

import { useParams } from "next/navigation";
import { ThingPage } from "../components/ThingPage";

type ThingPageParams = {
  name: string;
};

// TODO: don't link to this page until nextjs has support for it.
// At the moment you cannot use dynamic pages like /things/[name] when doing static export.
// When nextjs has added support for it, link to this page like described, and remove the
// link to /things/?thing={name}, as well as that part of the things/page.tsx.
// Follow progress here: https://github.com/vercel/next.js/issues/54393
export default function Page() {
  const { name } = useParams() as ThingPageParams;

  return <ThingPage thingName={name} />;
}
