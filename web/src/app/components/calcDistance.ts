import { Coordinate } from "./topics";

export const calcCrowDistanceMeters = (
  coordinate1: Coordinate,
  coordinate2: Coordinate
): number => {
  const R = 6371000; // meters
  const dLat = toRadians(coordinate2.lat - coordinate1.lat);
  var dLon = toRadians(coordinate2.lon - coordinate1.lon);
  var lat1 = toRadians(coordinate1.lat);
  var lat2 = toRadians(coordinate2.lat);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
};

const toRadians = (degrees: number) => {
  return (degrees * Math.PI) / 180;
};
