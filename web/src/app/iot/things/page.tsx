"use client";

import { useSearchParams } from "next/navigation";
import { ThingPage } from "./components/ThingPage";
import { SignedInMenu } from "../components/SignedInMenu";
import { Breadcrumbs } from "../components/Breadcrumbs";

const Page = () => {
  const searchParams = useSearchParams();

  const thing = searchParams.get("thing");

  if (thing) {
    return <ThingPage thingName={thing} />;
  }

  return <ThingsListPage />;
};

const ThingsListPage2 = () => {
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

const ThingsListPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SignedInMenu />
      <div className="max-w-screen-2xl px-sm mx-auto w-full grow">
        <Breadcrumbs
          currentPage="My things"
          crumbs={[{ label: "IoT", href: "/iot" }]}
        />
        <main>
          <h1 className="text-5xl font-bold mb-md">My things</h1>
          <p>
            This page is mostly here for completeness. We can put all kinds of
            operations here.
          </p>
        </main>
      </div>
    </div>
  );
};

export default Page;
