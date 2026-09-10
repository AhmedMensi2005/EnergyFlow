import { useEffect, useRef } from "react";
import "./style.css";

// Reads brand colors straight from your CSS variables at runtime, so it
// stays in sync with your theme without hardcoding hex values here.
function readThemeColor(varName, fallback) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return value || fallback;
}

function EnergyFlowBackground({ opacity = 0.35, speed = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    const colors = [
      readThemeColor("--chart-green", "#10B981"),
      readThemeColor("--chart-cyan", "#06B6D4"),
      readThemeColor("--chart-blue", "#3B82F6"),
    ];

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas.parentElement);

    // ---- Perspective floor grid ----
    // Horizontal lines converge toward a vanishing point near the top,
    // scrolling slowly "toward the viewer" for a receding-floor feel.
    let gridOffset = 0;
    const horizonY = () => height * 0.25;
    const vanishX = () => width / 2;

    function drawGrid() {
      const rows = 14;
      const spacingBase = height * 0.9;

      ctx.strokeStyle = colors[1];

      for (let i = 0; i < rows; i++) {
        // Non-linear spacing: rows closer to the bottom are further apart —
        // this is what creates the perspective illusion.
        const t = ((i + gridOffset) % rows) / rows;
        const y = horizonY() + Math.pow(t, 2.2) * spacingBase;
        const lineOpacity = t * 0.18;

        ctx.globalAlpha = lineOpacity;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Converging vertical lines from bottom edge to the vanishing point
      const verticals = 9;
      for (let i = 0; i <= verticals; i++) {
        const xBottom = (width / verticals) * i;
        ctx.globalAlpha = 0.08;
        ctx.beginPath();
        ctx.moveTo(xBottom, height);
        ctx.lineTo(vanishX(), horizonY());
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    }

    // ---- Flowing energy streaks ----
    const streakCount = 6;
    const streaks = Array.from({ length: streakCount }, (_, i) => ({
      depth: 0.35 + Math.random() * 0.65, // 0.35 (far/dim/slow) -> 1 (near/bright/fast)
      offset: Math.random(),
      color: colors[i % colors.length],
      seed: Math.random() * 1000,
    }));

    function streakPath(streak, t) {
      // A wavy bezier-ish path drifting across the canvas, unique per streak
      const x = width * t;
      const y =
        height * 0.55 +
        Math.sin(t * Math.PI * 2 + streak.seed) * height * 0.18 * streak.depth +
        Math.sin(t * Math.PI * 5 + streak.seed) * height * 0.04;
      return { x, y };
    }

    function drawStreaks(time) {
      streaks.forEach((streak) => {
        const lineOpacity = 0.05 + streak.depth * 0.08;
        ctx.strokeStyle = streak.color;
        ctx.globalAlpha = lineOpacity;
        ctx.lineWidth = 1 + streak.depth;
        ctx.beginPath();

        for (let i = 0; i <= 40; i++) {
          const t = i / 40;
          const { x, y } = streakPath(streak, t);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Traveling glowing pulse along this streak
        const pulseT = ((time * 0.00006 * speed * streak.depth) + streak.offset) % 1;
        const { x, y } = streakPath(streak, pulseT);

        ctx.globalAlpha = 0.6 + streak.depth * 0.3;
        ctx.shadowBlur = 8 + streak.depth * 10;
        ctx.shadowColor = streak.color;
        ctx.fillStyle = streak.color;
        ctx.beginPath();
        ctx.arc(x, y, 1.5 + streak.depth * 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      ctx.globalAlpha = 1;
    }

    function frame(time) {
      ctx.clearRect(0, 0, width, height);

      gridOffset += 0.0025 * speed;
      drawGrid();
      drawStreaks(time);

      animationId = requestAnimationFrame(frame);
    }

    animationId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [speed]);

  return (
    <canvas
      ref={canvasRef}
      className="energy-flow-bg"
      style={{ opacity }}
    />
  );
}

export default EnergyFlowBackground;