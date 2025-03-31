"use client";

import { NavBar } from "../components/NavBar";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import polylinesData from "../../data/example-polylines-1000.json";

const MapTest2Page = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const glifyRef = useRef<any>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      mapRef.current &&
      !leafletMapRef.current
    ) {
      // Dynamically import Leaflet and leaflet.glify to avoid SSR issues
      Promise.all([import("leaflet"), import("leaflet.glify")]).then(
        ([L, glifyModule]) => {
          // Check WebGL support
          const hasWebGL = !!window.WebGLRenderingContext;
          console.log("WebGL support:", hasWebGL);
          if (!hasWebGL) {
            console.error(
              "WebGL is not supported in this browser. Leaflet.glify requires WebGL support."
            );
            return;
          }

          console.log("Glify module:", glifyModule);
          console.log("Glify module keys:", Object.keys(glifyModule));
          console.log("Glify default export:", glifyModule.default);

          // Initialize the map
          leafletMapRef.current = L.map(mapRef.current!).setView(
            [62.0, 15.0],
            5
          );

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(leafletMapRef.current);

          // Convert polylines to GeoJSON format
          const features = (polylinesData as any).polylines.map(
            (polyline: any) => ({
              type: "Feature",
              properties: {
                color: polyline.color,
                weight: polyline.weight,
              },
              geometry: {
                type: "LineString",
                coordinates: polyline.coordinates.map((coord: number[]) => [
                  coord[1],
                  coord[0],
                ]), // Convert [lat, lng] to [lng, lat]
              },
            })
          );

          const geojson = {
            type: "FeatureCollection",
            features,
          };

          // Function to convert hex color to RGB object
          const fromHex = (hex: string) => {
            if (hex.length < 6) return null;
            hex = hex.toLowerCase();

            if (hex[0] === "#") {
              hex = hex.substring(1, hex.length);
            }

            const r = parseInt(hex[0] + hex[1], 16),
              g = parseInt(hex[2] + hex[3], 16),
              b = parseInt(hex[4] + hex[5], 16);
            return {
              r: r / 255,
              g: g / 255,
              b: b / 255,
            };
          };

          console.log("GeoJSON data:", geojson);
          console.log(
            "First few coordinates:",
            geojson.features[0].geometry.coordinates.slice(0, 3)
          );

          // Create a new glify instance and use the lines method
          const glify = glifyModule.default;
          console.log("Glify instance:", glify);
          console.log("Available methods on glify:", Object.keys(glify));

          // Add default color and weight if not specified
          const glifyOptions = {
            map: leafletMapRef.current,
            data: geojson,
            color: (featureIndex: number) => {
              console.log("Feature index received:", featureIndex);
              const actualFeature = geojson.features[featureIndex];
              console.log("Actual feature from data:", actualFeature);
              const hexColor = actualFeature?.properties?.color;
              if (hexColor) {
                const rgbColor = fromHex(hexColor);
                console.log("Converted color:", rgbColor);
                return rgbColor;
              }
              return { r: 0, g: 0, b: 1 }; // Default blue color
            },
            weight: (featureIndex: number) => {
              const actualFeature = geojson.features[featureIndex];
              return actualFeature?.properties?.weight || 2;
            },
            latitudeKey: 1,
            longitudeKey: 0,
            click: (e: any, feature: any) => {
              console.log("Clicked polyline:", feature);
            },
          };

          console.log("Glify options:", glifyOptions);
          glifyRef.current = glify.lines(glifyOptions);
          console.log("Created glify instance:", glifyRef.current);
        }
      );
    }

    return () => {
      // Clean up glify layer
      if (glifyRef.current) {
        leafletMapRef.current?.removeLayer(glifyRef.current);
        glifyRef.current = null;
      }

      // Clean up map
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar menuItems={[]} />
      <div className="max-w-screen-2xl px-sm mx-auto w-full grow">
        <main className="py-xl">
          <div ref={mapRef} className="h-[600px] w-full" />
        </main>
      </div>
    </div>
  );
};

export default MapTest2Page;
