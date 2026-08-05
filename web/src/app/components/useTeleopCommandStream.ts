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
    commandsRef.current.rudderY = value;
    if (activeRef.current && publishersRef.current.streamRudderY) {
      publishersRef.current.publishRudderY(value);
    }
  }, []);

  const start = useCallback(() => {
    activeRef.current = true;
    setActive(true);
  }, []);

  const stop = useCallback(() => {
    activeRef.current = false;
    setActive(false);
    commandsRef.current = { ...ZERO_COMMANDS };
    const pubs = publishersRef.current;
    pubs.publishMotor(0);
    pubs.publishRudderX(0);
    pubs.publishRudderY(0);
  }, []);

  return { setMotor, setRudderX, setRudderY, start, stop };
};
