"use client";

import { useEffect, useRef } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
}

export default function GlitchText({ text, className = "" }: GlitchTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = "!<>-_\\/[]{}—=+*^?#░▒▓│┤╡╣║╗╝╛┐";
    let interval: ReturnType<typeof setInterval>;

    const scramble = () => {
      let iter = 0;
      clearInterval(interval);
      interval = setInterval(() => {
        el.querySelectorAll("[data-letter]").forEach((span, i) => {
          if (i < iter) {
            (span as HTMLElement).innerText = text[i];
          } else {
            (span as HTMLElement).innerText = chars[Math.floor(Math.random() * chars.length)];
          }
        });
        if (iter >= text.length) clearInterval(interval);
        iter += 0.35;
      }, 38);
    };

    el.addEventListener("mouseenter", scramble);
    return () => { el.removeEventListener("mouseenter", scramble); clearInterval(interval); };
  }, [text]);

  return (
    <span ref={ref} className={className} data-hover="true">
      {text.split("").map((char, i) => (
        <span key={i} data-letter={char}>{char === " " ? "\u00A0" : char}</span>
      ))}
    </span>
  );
}
