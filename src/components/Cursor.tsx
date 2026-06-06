"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let rx = -100, ry = -100;
    let dx = -100, dy = -100;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      dx = e.clientX; dy = e.clientY;
      dot.style.left = dx + "px";
      dot.style.top  = dy + "px";
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      rx = lerp(rx, dx, 0.12);
      ry = lerp(ry, dy, 0.12);
      ring.style.left = rx + "px";
      ring.style.top  = ry + "px";
      rafId = requestAnimationFrame(animate);
    };
    animate();

    const addHover    = () => ring.classList.add("hovered");
    const removeHover = () => ring.classList.remove("hovered");

    const targets = document.querySelectorAll("a, button, [data-hover]");
    targets.forEach(el => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      targets.forEach(el => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", removeHover);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
