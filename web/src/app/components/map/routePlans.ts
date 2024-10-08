import { Coordinate } from "../mapTypes";

const vintervikenSmall: Coordinate[] = [
  { lat: 59.311068, lon: 17.98679 },
  { lat: 59.311059, lon: 17.985079 },
  { lat: 59.311433, lon: 17.985117 },
  { lat: 59.311311, lon: 17.986748 },
  { lat: 59.311795, lon: 17.987684 },
];

const vintervikenLarge: Coordinate[] = [
  { lat: 59.311026, lon: 17.986756 },
  { lat: 59.31104, lon: 17.984958 },
  { lat: 59.310873, lon: 17.983209 },
  { lat: 59.31081, lon: 17.981679 },
  { lat: 59.31079, lon: 17.98088 },
  { lat: 59.31104, lon: 17.981057 },
  { lat: 59.311196, lon: 17.98255 },
  { lat: 59.311324, lon: 17.98417 },
  { lat: 59.311437, lon: 17.985371 },
  { lat: 59.3113, lon: 17.986847 },
  { lat: 59.31176, lon: 17.987668 },
];

const rotholmen: Coordinate[] = [
  { lat: 59.309092, lon: 17.978828 },
  { lat: 59.309294, lon: 17.978061 },
  { lat: 59.309569, lon: 17.977337 },
  { lat: 59.30983, lon: 17.976662 },
  { lat: 59.310199, lon: 17.975841 },
  { lat: 59.310559, lon: 17.975032 },
  { lat: 59.310928, lon: 17.974224 },
  { lat: 59.311298, lon: 17.973417 },
  { lat: 59.311674, lon: 17.972976 },
  { lat: 59.312075, lon: 17.972505 },
  { lat: 59.312386, lon: 17.972599 },
  { lat: 59.31269, lon: 17.972685 },
  { lat: 59.312858, lon: 17.973651 },
  { lat: 59.313017, lon: 17.974606 },
  { lat: 59.313135, lon: 17.975546 },
  { lat: 59.313236, lon: 17.976366 },
  { lat: 59.313164, lon: 17.976981 },
  { lat: 59.313094, lon: 17.977546 },
  { lat: 59.31293, lon: 17.977983 },
  { lat: 59.312767, lon: 17.978388 },
  { lat: 59.312429, lon: 17.97877 },
  { lat: 59.312088, lon: 17.979161 },
  { lat: 59.311649, lon: 17.979021 },
  { lat: 59.311245, lon: 17.978882 },
  { lat: 59.31087, lon: 17.978794 },
  { lat: 59.3105, lon: 17.97871 },
  { lat: 59.309999, lon: 17.97882 },
  { lat: 59.309504, lon: 17.978918 },
  { lat: 59.309161, lon: 17.979273 },
  { lat: 59.308595, lon: 17.97985 },
];

const eolshall1 = [
  { lat: 59.30858304267948, lon: 17.971779406070713 },
  { lat: 59.308632327987006, lon: 17.972149550914768 },
  { lat: 59.30871173194333, lon: 17.97256261110306 },
  { lat: 59.30887875345319, lon: 17.971961796283725 },
  { lat: 59.308796611829536, lon: 17.971495091915134 },
];

const eolshall2 = [
  { lat: 59.308621442378765, lon: 17.971397042122206 },
  { lat: 59.308758345671464, lon: 17.97214763221964 },
  { lat: 59.308971913707566, lon: 17.97204040506289 },
  { lat: 59.30892262889519, lon: 17.971520353352474 },
];

const dummyRoute: Coordinate[] = [
  { lat: 59.30938741468102, lon: 17.975370883941654 },
  { lat: 59.30978752690931, lon: 17.97597169876099 },
  { lat: 59.30937966322808, lon: 17.976068258285526 },
];

export type Route = {
  path: Coordinate[];
  name: string;
};

export const routes: Route[] = [
  {
    name: "Vinterviken Small",
    path: vintervikenSmall,
  },
  {
    name: "Vinterviken Large",
    path: vintervikenLarge,
  },
  {
    name: "Rotholmen",
    path: rotholmen,
  },
  {
    name: "Dummy route",
    path: dummyRoute,
  },
  {
    name: "Eolshäll 1",
    path: eolshall1,
  },
  {
    name: "Eolshäll 2",
    path: eolshall2,
  },
];
