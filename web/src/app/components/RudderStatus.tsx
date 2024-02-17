import { Canvas } from "./Canvas";

export type Coord2d = {
  x: number;
  y: number;
};

const translateCoordinatesToCanvas = (
  coord: Coord2d,
  origin: Coord2d,
  radius: number
): Coord2d => {
  return {
    x: coord.x * radius + origin.x,
    y: coord.y * radius + origin.y,
  };
};

export const XYVectorIndicator = ({
  vector = { x: 0, y: 0 },
  color,
}: {
  vector: Coord2d;
  color: "red" | "black";
}) => {
  const frameHeight = 100;
  const frameWidth = 100;

  const originY = frameHeight / 2;
  const originX = frameWidth / 2;

  const circleRadius = frameHeight / 2 - 2;

  const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.arc(originX, originY, circleRadius, 0, 2 * Math.PI);

    ctx.strokeStyle = "grey";

    ctx.lineWidth = 1;

    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(originX, originY);

    const { x, y } = translateCoordinatesToCanvas(
      vector,
      { x: originX, y: originY },
      circleRadius
    );

    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.stroke();
  };

  return <Canvas draw={draw} height={frameHeight} width={frameWidth} />;
};
