"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when the user has requested reduced motion.
 * Defaults to `false` on the server / first paint so animated components
 * mount in their pre-animation state; flips synchronously on mount.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

/** Synchronous read for imperative code (guards inside effects). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
