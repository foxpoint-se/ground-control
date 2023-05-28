"use client";

import { useEffect, useState } from "react";
import { Button } from "../components/button/Button";
import { ControlPanel } from "../components/control-panel/ControlPanel";

const useLocalStorage = <T,>(
  name: string
): { value: T | undefined; set: (newValue: T) => void } => {
  const [value, setValue] = useState<T>();

  useEffect(() => {
    const currentValue = window.localStorage.getItem(name);
    if (currentValue) {
      const parsed = JSON.parse(currentValue) as T;
      setValue(parsed);
    }
  }, []);

  const set = (newValue: T) => {
    setValue(newValue);
    const valueString = JSON.stringify(newValue);
    window.localStorage.setItem(name, valueString);
  };

  return {
    value,
    set,
  };
};

type BackendFormProps = {
  onUpdate: (val?: string) => void;
};

const BackendForm = ({ onUpdate }: BackendFormProps) => {
  const { value: wsBackendUrl, set: setBackendUrl } =
    useLocalStorage<string>("wsBackendUrl");
  const [wsBackendUrlValue, setWsBackendUrlValue] = useState("");

  const handleUpdate = (val?: string) => {
    onUpdate(val);
  };

  useEffect(() => {
    handleUpdate(wsBackendUrl);
  }, [wsBackendUrl]);

  if (wsBackendUrl) {
    return (
      <div>
        <div>
          <Button onClick={() => setBackendUrl("")}>Reset backend</Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setBackendUrl(wsBackendUrlValue);
        handleUpdate(wsBackendUrlValue);
      }}
    >
      <input
        type="text"
        value={wsBackendUrlValue}
        className="mr-2"
        onChange={(e) => {
          setWsBackendUrlValue(e.target.value);
        }}
      />
      <input type="submit" value="Go" className="btn" />
    </form>
  );
};

export default function ROS() {
  const [wsBackendUrl, setWsBackendUrl] = useState<string>();

  return (
    <main className="flex min-h-screen flex-col p-4">
      <div className="flex">
        <h1>ROS {wsBackendUrl && <span>({wsBackendUrl})</span>}</h1>
      </div>
      <div className="mb-2">
        <BackendForm
          onUpdate={(val?: string) => {
            setWsBackendUrl(val || "");
          }}
        />
      </div>
      {!wsBackendUrl && <div>Please set a backend URL</div>}
      {wsBackendUrl && (
        <ControlPanel transportType="ros" wsBackendUrl={wsBackendUrl} />
      )}
    </main>
  );
}
