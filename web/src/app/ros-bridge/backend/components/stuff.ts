import ROSLIB from "roslib";
import { createContext, useContext } from "react";

let connection;

const initConnection = (url: string) => {
  connection = new ROSLIB.Ros({ url });
};

const useConnection = () => {};

type WsBackendState = {
  url?: string;
};

export const WsBackendContext = createContext<WsBackendState>({});

type RosBackendState = {
  ros?: ROSLIB.Ros;
};

export const RosBackendContext = createContext<RosBackendState>({});

export const useWsBackend = (): WsBackendState => {
  const state = useContext(WsBackendContext);
  return state;
};

const useRosBridgeConnection = () => {
  const { url } = useWsBackend();
};

export const useRosBackend = (): RosBackendState => {
  const state = useContext(RosBackendContext);
  return state;
};
