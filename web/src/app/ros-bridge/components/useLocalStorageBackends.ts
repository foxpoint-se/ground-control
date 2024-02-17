import { useLocalStorage } from "usehooks-ts";

const storeKey = "ros-bridge-backends";

export type Backend = {
  name: string;
  address: string;
};

export const useLocalStorageBackends = (
  prefilledBackends: Backend[]
): {
  backends: Backend[];
  onAdd: (b: Backend) => void;
  onDelete: (b: Backend) => void;
} => {
  const [value, setValue] = useLocalStorage<Backend[]>(
    storeKey,
    prefilledBackends,
    {
      initializeWithValue: false, // To avoid errors from mismatch when server rendering. Probably only happens during yarn dev.
    }
  );

  const onAdd = (b: Backend) => {
    setValue((prev) => [...prev, b]);
  };

  const onDelete = (b: Backend) => {
    setValue((prev) => {
      const newList = prev.filter((p) => p.address !== b.address);
      return newList;
    });
  };

  return { backends: value, onAdd, onDelete };
};
