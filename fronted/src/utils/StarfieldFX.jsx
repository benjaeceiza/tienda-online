import { useEffect, useRef } from "react";

const StarfieldFX = ({
  targetRef,
  starCount = 260,
  maxSize = 1.4,
  speed = 0.35,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = targetRef?.current;
    if (!container) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // Estrellas distribuidas FULL
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * maxSize + 0.4,
      vx: speed * (0.3 + Math.random() * 0.4),
      vy: speed * (Math.random() * 0.2 - 0.1),
    }));

    const render = () => {
      // ❗ Fondo 100% transparente — NO se tapa tu background
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let s of stars) {
        s.x += s.vx;
        s.y += s.vy;

        // Flow infinito horizontal
        if (s.x > canvas.width) {
          s.x = -10;
          s.y = Math.random() * canvas.height;
        }

        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;

        // Glow MUY SUAVE — apenas ilumina un poquito, sin hacer fondo
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 3);
        g.addColorStop(0, "rgba(255,255,255,0.95)");
        g.addColorStop(1, "rgba(255,255,255,0)");

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 2.8, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(render);
    };

    render();

    return () => window.removeEventListener("resize", resize);
  }, [targetRef, starCount, maxSize, speed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        background: "transparent",  // por las dudas
      }}
    />
  );
};

export default StarfieldFX;
