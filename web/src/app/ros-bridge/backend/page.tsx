"use client";

import { useSearchParams } from "next/navigation";
import { Breadcrumbs } from "../../components/new/Breadcrumbs";
import { NavBar } from "../../components/new/NavBar";
import Link from "next/link";
import { BackendPage } from "./components/BackendPage";
import { useLocalStorageBackends } from "../components/useLocalStorageBackends";

const Page = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const { backends } = useLocalStorageBackends([]);

  const currentBackend = backends.find((b) => b.name === name);

  if (currentBackend) {
    return (
      <BackendPage
        name={currentBackend.name}
        address={currentBackend.address}
      />
    );
  }

  return <Empty />;
};

const Empty = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar menuItems={[]}>
        <Breadcrumbs
          currentPage="My backends"
          crumbs={[{ href: "/ros-bridge", label: "Ros Bridge" }]}
        />
      </NavBar>
      <div className="max-w-screen-2xl px-sm mx-auto w-full grow">
        <main className="flex flex-col items-center py-lg">
          <h1 className="text-5xl font-bold mb-md">Oops</h1>
          <p>
            This page is mostly here for completeness. Go back to select a
            backend.
          </p>
          <Link className="btn mt-lg" href="/ros-bridge">
            Back to backends
          </Link>
        </main>
      </div>
    </div>
  );
};

export default Page;
