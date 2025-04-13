"use client";

import { NavBar } from "../components/NavBar";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { useLocalStorageRoutes2, SavedMission } from "./useLocalStorageRoutes2";
import { useEffect, useState } from "react";

const RoutesTable = ({
  routes,
  onDelete,
}: {
  routes: SavedMission[];
  onDelete: (route: SavedMission) => void;
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Waypoints</th>
          <th>Total depth</th>
          <th>Surface value</th>
          <th>Submerged value</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {routes.length === 0 ? (
          <tr>
            <td className="text-center text-neutral-500" colSpan={8}>
              No saved routes
            </td>
          </tr>
        ) : (
          <>
            {routes.map((route) => (
              <tr key={route.id}>
                <td>{route.name}</td>
                <td>{route.description || "-"}</td>
                <td>{route.mission.assignments.length}</td>
                <td>
                  {route.mission.assignments
                    .reduce(
                      (sum, assignment) => sum + assignment.target_depth,
                      0
                    )
                    .toFixed(2)}{" "}
                  meters
                </td>
                <td>{route.surfaceValue?.toFixed(2) || "-"}</td>
                <td>{route.submergedValue?.toFixed(2) || "-"}</td>
                <td className="flex justify-end space-x-2">
                  <button className="btn btn-circle btn-outline btn-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      onDelete(route);
                    }}
                    className="btn btn-circle btn-outline btn-error btn-sm hover:text-neutral-100 active:text-neutral-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </>
        )}
      </tbody>
    </table>
  );
};

const Page = () => {
  const { routes, deleteRoute } = useLocalStorageRoutes2();

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar menuItems={[]}>
        <Breadcrumbs currentPage="My routes" crumbs={[]} />
      </NavBar>
      <div className="max-w-screen-2xl px-sm mx-auto w-full grow">
        <main className="py-xl">
          <div className="flex flex-col items-center space-y-xl">
            <h1 className="text-2xl font-bold">My routes</h1>
            <div className="max-w-4xl w-full">
              <RoutesTable routes={routes} onDelete={deleteRoute} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
