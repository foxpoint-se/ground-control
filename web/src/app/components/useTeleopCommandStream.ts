import { useCallback, useEffect, useRef, useState } from "react";

const STREAM_INTERVAL_MS = 100;

export type TeleopCommands = {
  motor: number;
  rudderX: number;
  rudderY: number;
};

type TeleopPublishers = {
  publishMotor: (value: number) => void;
  publishRudderX: (value: number) => void;
  publishRudderY: (value: number) => void;
  streamRudderY: boolean;
};

const ZERO_COMMANDS: TeleopCommands = { motor: 0, rudderX: 0, rudderY: 0 };

export const useTeleopCommandStream = ({
  publishMotor,
  publishRudderX,
  publishRudderY,
  streamRudderY,
}: TeleopPublishers) => {
  const commandsRef = useRef<TeleopCommands>({ ...ZERO_COMMANDS });
  const publishersRef = useRef({
    publishMotor,
    publishRudderX,
    publishRudderY,
    streamRudderY,
  });
  const activeRef = useRef(false);
  const [active, setActive] = useState(false);

  publishersRef.current = {
    publishMotor,
    publishRudderX,
    publishRudderY,
    streamRudderY,
  };

  useEffect(() => {
    if (!streamRudderY) {
      commandsRef.current.rudderY = 0;
    }
  }, [streamRudderY]);

  const publishCurrent = useCallback(() => {
    const { motor, rudderX, rudderY } = commandsRef.current;
    const pubs = publishersRef.current;
    pubs.publishMotor(motor);
    pubs.publishRudderX(rudderX);
    if (pubs.streamRudderY) {
      pubs.publishRudderY(rudderY);
    }
  }, []);

  useEffect(() => {
    if (!active) {
      return;
    }
    publishCurrent();
    const id = window.setInterval(publishCurrent, STREAM_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [active, publishCurrent, streamRudderY]);

  const setMotor = useCallback((value: number) => {
    commandsRef.current.motor = value;
    if (activeRef.current) {
      publishersRef.current.publishMotor(value);
    }
  }, []);

  const setRudderX = useCallback((value: number) => {
    commandsRef.current.rudderX = value;
    if (activeRef.current) {
      publishersRef.current.publishRudderX(value);
    }
  }, []);

  const setRudderY = useCallback((value: number) => {
    if (!publishersRef.current.streamRudderY) {
      commandsRef.current.rudderY = 0;
      return;
    }
    commandsRef.current.rudderY = value;
    if (activeRef.current) {
      publishersRef.current.publishRudderY(value);
    }
  }, []);

  const start = useCallback(() => {
    activeRef.current = true;
    setActive(true);
  }, []);

  const publishZeros = useCallback(() => {
    commandsRef.current = { ...ZERO_COMMANDS };
    const pubs = publishersRef.current;
    pubs.publishMotor(0);
    pubs.publishRudderX(0);
    pubs.publishRudderY(0);
  }, []);

  const stop = useCallback(() => {
    activeRef.current = false;
    setActive(false);
    publishZeros();
  }, [publishZeros]);

  useEffect(() => {
    return () => {
      if (!activeRef.current) {
        return;
      }
      activeRef.current = false;
      publishZeros();
    };
  }, [publishZeros]);

  return { setMotor, setRudderX, setRudderY, start, stop };
};
