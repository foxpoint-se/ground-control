import { useState, useEffect } from "react";
import { NavigationMission } from "@/app/components/topics";

export interface SavedMission {
  id: string;
  name: string;
  description?: string;
  surfaceValue?: number;
  submergedValue?: number;
  mission: NavigationMission;
}

export const useLocalStorageRoutes2 = (initialValue: SavedMission[] = []) => {
  const [routes, setRoutes] = useState<SavedMission[]>(() => {
    if (typeof window === "undefined") return initialValue;
    const saved = localStorage.getItem("saved-routes");
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem("saved-routes", JSON.stringify(routes));
  }, [routes]);

  const addRoute = (route: SavedMission) => {
    setRoutes((prev) => [...prev, route]);
  };

  const deleteRoute = (route: SavedMission) => {
    setRoutes((prev) => prev.filter((r) => r.id !== route.id));
  };

  return { routes, addRoute, deleteRoute };
};
