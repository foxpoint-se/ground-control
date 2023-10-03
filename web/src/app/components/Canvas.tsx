import { useEffect, useRef } from "react";

type CanvasProps = {
  draw: (ctx: CanvasRenderingContext2D, frameCount: number) => void;
  height: number;
  width: number;
};

export const Canvas = (props: CanvasProps) => {
  const { draw, height, width, ...rest } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        let frameCount = 0;
        let animationFrameId: number;

        const render = () => {
          frameCount++;
          draw(context, frameCount);
          animationFrameId = window.requestAnimationFrame(render);
        };
        render();

        return () => {
          window.cancelAnimationFrame(animationFrameId);
        };
      }
    }
  }, [draw]);

  return <canvas ref={canvasRef} height={height} width={width} {...rest} />;
};
