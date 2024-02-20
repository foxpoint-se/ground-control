"use client";

import { useSearchParams } from "next/navigation";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { NavBar } from "../../components/NavBar";
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
        <main className="flex flex-col items-center py-lg"></main>
      </div>
    </div>
  );
};

export default Page;
