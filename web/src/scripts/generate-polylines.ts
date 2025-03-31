const fs = require("fs");
const path = require("path");

// Sweden's approximate boundaries
const SWEDEN_BOUNDS = {
  minLat: 55.3,
  maxLat: 69.1,
  minLng: 10.8,
  maxLng: 24.2,
};

// Generate a random number between min and max
const random = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

// Generate a random color in hex format
const randomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Generate a random polyline with 3-6 points
const generatePolyline = (id: number) => {
  const numPoints = Math.floor(Math.random() * 4) + 3; // 3-6 points
  const coordinates = [];

  for (let i = 0; i < numPoints; i++) {
    coordinates.push([
      random(SWEDEN_BOUNDS.minLat, SWEDEN_BOUNDS.maxLat),
      random(SWEDEN_BOUNDS.minLng, SWEDEN_BOUNDS.maxLng),
    ]);
  }

  return {
    id: `polyline-${id}`,
    coordinates,
    color: randomColor(),
    weight: Math.floor(Math.random() * 3) + 1, // 1-3
  };
};

// Generate 100 polylines
const polylines = Array.from({ length: 100 }, (_, i) =>
  generatePolyline(i + 1)
);

// Create the data object
const data = {
  polylines,
};

// Write to file
const outputPath = path.join(__dirname, "../data/example-polylines.json");
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

console.log(
  `Generated ${polylines.length} polylines and saved to ${outputPath}`
);
