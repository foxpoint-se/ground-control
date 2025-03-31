"use client";

import { NavBar } from "../components/NavBar";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
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
  const [polylines, setPolylines] = useState<PolylineData[]>([]);
  const [renderTime, setRenderTime] = useState<number>(0);
  const [memoryUsage, setMemoryUsage] = useState<number>(0);

  useEffect(() => {
    fixLeafletIcons();

    // Performance measurement
    const startTime = performance.now();
    const startMemory = (window.performance as any).memory?.usedJSHeapSize || 0;

    // Convert polylines to Leaflet format
    console.log("Polylines data:", polylinesData);
    console.log(
      "First few coordinates:",
      (polylinesData as any).polylines[0].coordinates.slice(0, 3)
    );

    const newPolylines = (polylinesData as any).polylines.map(
      (polyline: any) => ({
        ...polyline,
        coordinates: polyline.coordinates.map(
          (coord: number[]) => coord as LatLngTuple
        ),
      })
    );

    setPolylines(newPolylines);

    // Measure performance after rendering
    const endTime = performance.now();
    const endMemory = (window.performance as any).memory?.usedJSHeapSize || 0;
    console.log(`React-Leaflet rendering time: ${endTime - startTime}ms`);
    console.log(`Memory usage: ${(endMemory - startMemory) / 1024 / 1024}MB`);
    console.log("Created polylines:", newPolylines.length);
    setRenderTime(endTime - startTime);
    setMemoryUsage((endMemory - startMemory) / 1024 / 1024);
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
          {renderTime > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              <p>Rendering time: {renderTime.toFixed(2)}ms</p>
              <p>Memory usage: {memoryUsage.toFixed(2)}MB</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MapTest1Page;
