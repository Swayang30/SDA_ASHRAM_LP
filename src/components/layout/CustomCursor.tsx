"use client";

import { useEffect, useRef, useState } from "react";

/** Tasteful dot + trailing ring cursor; disabled on touch / reduced-motion. */
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    setEnabled(true);
    document.body.classList.add("has-custom-cursor");

    // Start off-screen and invisible — the cursor must NOT paint at a fixed
    // spot (e.g. screen-centre) before the pointer has actually moved.
    let mx = -100;
    let my = -100;
    let rx = mx;
    let ry = my;
    let raf = 0;
    let seen = false;

    const reveal = () => {
      if (seen) return;
      seen = true;
      dot.current?.classList.remove("opacity-0");
      ring.current?.classList.remove("opacity-0");
    };

    const onMove = (e: MouseEvent) => {
      if (!seen) {
        // Jump to the pointer on first move so it doesn't fly in from -100.
        rx = e.clientX;
        ry = e.clientY;
        reveal();
      }
      mx = e.clientX;
      my = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate(${mx}px, ${my}px)`;
      }
      const t = e.target as HTMLElement;
      const interactive = t.closest("a, button, input, [role='button']");
      ring.current?.classList.toggle("cursor-grow", !!interactive);
    };

    // Hide again when the pointer leaves the window.
    const onLeave = () => {
      dot.current?.classList.add("opacity-0");
      ring.current?.classList.add("opacity-0");
      seen = false;
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-200 -ml-1 -mt-1 h-2 w-2 rounded-full bg-orange opacity-0 mix-blend-difference"
      />
      <div
        ref={ring}
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-200 -ml-4 -mt-4 h-8 w-8 rounded-full border border-orange/70 opacity-0 transition-[width,height,margin,background-color] duration-300"
      />
    </>
  );
}
