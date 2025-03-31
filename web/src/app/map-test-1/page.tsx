"use client";

import { NavBar } from "../components/NavBar";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import polylinesData from "../../data/example-polylines-1000.json";
import { LatLngTuple } from "leaflet";

// Fix for default marker icons in react-leaflet
const fixLeafletIcons = () => {
  if (typeof window !== "undefined") {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    // @ts-ignore
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      iconUrl: "/leaflet/marker-icon.png",
      shadowUrl: "/leaflet/marker-shadow.png",
    });
  }
};

interface PolylineData {
  id: string;
  coordinates: LatLngTuple[];
  color: string;
  weight: number;
}

const MapTest1Page = () => {
  const [polylines, setPolylines] = useState<PolylineData[]>(
    (polylinesData as any).polylines.map((polyline: any) => ({
      ...polyline,
      coordinates: polyline.coordinates.map(
        (coord: number[]) => coord as LatLngTuple
      ),
    }))
  );

  useEffect(() => {
    fixLeafletIcons();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar menuItems={[]} />
      <div className="max-w-screen-2xl px-sm mx-auto w-full grow">
        <main className="py-xl">
          <div className="h-[600px] w-full">
            <MapContainer
              center={[62.0, 15.0]}
              zoom={5}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {polylines.map((polyline) => (
                <Polyline
                  key={polyline.id}
                  positions={polyline.coordinates}
                  color={polyline.color}
                  weight={polyline.weight}
                />
              ))}
            </MapContainer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MapTest1Page;
