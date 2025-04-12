"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.glify";
import { TracedRoute } from "@/app/components/topics";

interface MapPanel2Props {
  tracedRoutes: TracedRoute[];
  onSendKnownPosition?: () => void;
  vehiclePosition?: { lat: number; lng: number };
  ghostPosition?: { lat: number; lng: number };
}

export const MapPanel2 = ({
  tracedRoutes,
  onSendKnownPosition,
  vehiclePosition,
  ghostPosition,
}: MapPanel2Props) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView([0, 0], 2);
    mapRef.current = map;

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Convert traced routes to GeoJSON features
    const features = tracedRoutes.flatMap((route) => {
      return route.path.map((point) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [point.coordinate.lon, point.coordinate.lat],
        },
        properties: {
          depth: point.depth,
        },
      }));
    });

    // Create GeoJSON data
    const geoJsonData = {
      type: "FeatureCollection",
      features,
    };

    // Clear existing glify layer
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Layer) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add new glify layer
    (window as any).L.glify.points({
      map: mapRef.current,
      data: geoJsonData,
    });
  }, [tracedRoutes]);

  return (
    <div className="h-[600px] w-full">
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
};
