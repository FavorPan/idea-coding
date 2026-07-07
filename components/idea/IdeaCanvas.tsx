"use client";

import { useEffect, useRef } from "react";

// Mirrors the board animation from the original src/main.js: an animated point-cloud
// on a <canvas> behind the hero, respecting prefers-reduced-motion.
const COLORS = ["#225CFF", "#18A058", "#FF6A3D", "#111827"];

interface Point {
  x: number;
  y: number;
  r: number;
  c: string;
  speed: number;
}

export function IdeaCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let points: Point[] = [];
    let frameId = 0;
    let frame = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      if (!canvas || !context) return;
      const ratio = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      points = Array.from({ length: Math.max(22, Math.floor(width / 45)) }, (_, index) => ({
        x: (index * 97) % Math.max(width, 1),
        y: 80 + ((index * 139) % Math.max(height - 120, 1)),
        r: 2 + (index % 5),
        c: COLORS[index % COLORS.length],
        speed: 0.25 + (index % 4) * 0.08,
      }));
    }

    function draw() {
      if (!context) return;
      frame += 0.012;
      context.clearRect(0, 0, width, height);

      const gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "rgba(255,255,255,0.92)");
      gradient.addColorStop(0.45, "rgba(242,247,255,0.82)");
      gradient.addColorStop(1, "rgba(246,248,251,0.96)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      context.strokeStyle = "rgba(20, 29, 45, 0.07)";
      context.lineWidth = 1;
      for (let x = 0; x < width; x += 52) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }
      for (let y = 0; y < height; y += 52) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }

      const moved = points.map((point, index) => ({
        ...point,
        x: (point.x + Math.cos(frame + index) * 16 + width) % width,
        y: point.y + Math.sin(frame * point.speed + index * 0.8) * 18,
      }));

      moved.forEach((a, index) => {
        moved.slice(index + 1, index + 4).forEach((b) => {
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance < 210) {
            context.globalAlpha = 0.16;
            context.strokeStyle = a.c;
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.stroke();
          }
        });
      });

      context.globalAlpha = 1;
      moved.forEach((point) => {
        context.fillStyle = point.c;
        context.beginPath();
        context.arc(point.x, point.y, point.r, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = "rgba(255,255,255,0.8)";
        context.stroke();
      });

      if (!reduceMotion) {
        frameId = requestAnimationFrame(draw);
      }
    }

    resize();
    draw();
    window.addEventListener("resize", resize, { passive: true });
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas className="idea-canvas" ref={canvasRef} aria-hidden="true" />;
}
