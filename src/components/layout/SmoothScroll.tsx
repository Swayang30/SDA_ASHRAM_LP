"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * Initialises Lenis inertial scrolling and drives GSAP ScrollTrigger from it.
 * Wraps the whole app. Skips smoothing entirely under reduced-motion.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (prefersReducedMotion()) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    // Drive ScrollTrigger off Lenis' scroll event.
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Expose for components that need to programmatically stop/start (intro lock).
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    // Recompute trigger positions once fonts/images have settled.
    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 400);

    return () => {
      gsap.ticker.remove(raf);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(refreshId);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}
