import { useLocalStorage } from "usehooks-ts";

const storeKey = "clicked-routes";

type ClickedRouteCoord = {
  lat: number;
  lon: number;
};

export type ClickedRoute = {
  name: string;
  path: ClickedRouteCoord[];
};

export const useLocalStorageBackends = (
  prefilledRoutes: ClickedRoute[]
): {
  routes: ClickedRoute[];
  onAdd: (b: ClickedRoute) => void;
  onDelete: (b: ClickedRoute) => void;
} => {
  const [value, setValue] = useLocalStorage<ClickedRoute[]>(
    storeKey,
    prefilledRoutes,
    {
      initializeWithValue: false, // To avoid errors from mismatch when server rendering. Probably only happens during yarn dev.
    }
  );

  const onAdd = (b: ClickedRoute) => {
    setValue((prev) => [...prev, b]);
  };

  const onDelete = (b: ClickedRoute) => {
    setValue((prev) => {
      const newList = prev.filter((p) => p.name !== b.name);
      return newList;
    });
  };

  return { routes: value, onAdd, onDelete };
};
