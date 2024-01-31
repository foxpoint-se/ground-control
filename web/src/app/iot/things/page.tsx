"use client";

import { useSearchParams } from "next/navigation";
import { ThingPage } from "./components/ThingPage";

const Page = () => {
  const searchParams = useSearchParams();

  const thing = searchParams.get("thing");

  if (thing) {
    return <ThingPage thingName={thing} />;
  }

  return <ThingsListPage />;
};

const ThingsListPage = () => {
  return (
    <main className="px-md max-w-3xl mx-auto">
      <h1 className="text-5xl font-bold mb-md">My things</h1>
      <p>
        This page is mostly here for completeness. We can put all kinds of
        operations here.
      </p>
    </main>
  );
};

export default Page;
