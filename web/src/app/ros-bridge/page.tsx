"use client";

import Link from "next/link";
import { SyntheticEvent, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { NavBar } from "../components/new/NavBar";
import { Breadcrumbs } from "../components/new/Breadcrumbs";

const BackendList = ({
  backends,
  onDelete,
}: {
  backends: Backend[];
  onDelete: (b: Backend) => void;
}) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Address</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {backends.length === 0 ? (
          <tr>
            <td className="text-center text-neutral-500" colSpan={4}>
              No items
            </td>
          </tr>
        ) : (
          <>
            {backends.map((b) => (
              <tr key={b.address}>
                <td width={50}>
                  <button
                    onClick={() => {
                      onDelete(b);
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
                <td>{b.name}</td>
                <td>{b.address}</td>
                <th className="text-right">
                  <Link
                    className="btn btn-sm btn-primary"
                    href={`/ros-bridge/backend/?name=${b.name}&address=${b.address}`}
                  >
                    Use backend
                  </Link>
                </th>
              </tr>
            ))}
          </>
        )}
      </tbody>
    </table>
  );
};

type Backend = {
  name: string;
  address: string;
};

const storeKey = "ros-bridge-backends";

const useLocalStorageBackends = (
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

const validateAddress = (value: string): string | undefined => {
  if (value.includes("ws://")) {
    return "Address must not include protocol";
  }
  if (value.includes(":9090")) {
    return "Address must not include port";
  }
};

const AddBackendForm = ({ onAdd }: { onAdd: (b: Backend) => void }) => {
  const [nameValue, setNameValue] = useState("");
  const [nameError, setNameError] = useState("");
  const [addressValue, setAddressValue] = useState("");
  const [addressError, setAddressError] = useState("");

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const addressValidation = validateAddress(addressValue);
    setAddressError("");
    if (addressValidation) {
      setAddressError(addressValidation);
      return;
    }
    const newBackend: Backend = {
      address: addressValue,
      name: nameValue,
    };
    setAddressValue("");
    setNameValue("");
    onAdd(newBackend);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-lg">
      <div className="flex flex-col space-y-sm">
        <div className="space-y-xs">
          <label htmlFor="backend-name">Name</label>
          <input
            name="backend-name"
            type="text"
            placeholder="My backend"
            className={`input input-bordered w-full ${
              nameError ? "input-error" : ""
            }`}
            onChange={(e) => {
              setNameValue(e.target.value);
            }}
            value={nameValue}
          />
          {nameError && <span className="text-error">{nameError}</span>}
        </div>
        <div className="space-y-xs">
          <label htmlFor="backend-address">Address</label>
          <input
            name="backend-address"
            type="text"
            placeholder="192.168.XX.YY"
            className={`input input-bordered w-full ${
              addressError ? "input-error" : ""
            }`}
            onChange={(e) => {
              setAddressValue(e.target.value);
            }}
            value={addressValue}
          />
          {addressError && <span className="text-error">{addressError}</span>}
        </div>
      </div>
      <div className="flex justify-end">
        <button
          className="btn"
          type="submit"
          disabled={!nameValue || !addressValue}
        >
          Add backend
        </button>
      </div>
    </form>
  );
};

const Page = () => {
  const [showForm, setShowForm] = useState(false);
  const { backends, onAdd, onDelete } = useLocalStorageBackends([]);

  const handleDelete = (b: Backend) => {
    onDelete(b);
  };

  const handleAdd = (b: Backend) => {
    onAdd(b);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar menuItems={[]}>
        <Breadcrumbs currentPage="Ros Bridge" crumbs={[]} />
      </NavBar>
      <div className="max-w-screen-2xl px-sm mx-auto w-full grow">
        <main className="py-xl">
          <div id="box" className="flex flex-col items-center space-y-xl">
            <h1 className="text-2xl font-bold">Pick a backend</h1>
            <div className="max-w-2xl w-full mb-lg">
              <BackendList backends={backends} onDelete={handleDelete} />
            </div>
            <div className="max-w-2xl w-full">
              {!showForm ? (
                <div className="flex flex-col items-center">
                  <button
                    className="btn"
                    onClick={() => {
                      setShowForm(!showForm);
                    }}
                  >
                    Add backend
                  </button>
                </div>
              ) : (
                <AddBackendForm onAdd={handleAdd} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
