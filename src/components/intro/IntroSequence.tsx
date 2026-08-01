"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import LogoReveal from "./LogoReveal";
import { introConfig } from "@/data/site";

/**
 * The intro is a single phase — the logo shutter — then the site reveals.
 * (The ashram reel that used to play as phase 2 now lives as slide 2 of the
 * hero slider, so visitors meet it in the page rather than in a gate.)
 */
export default function IntroSequence({
  onComplete,
}: {
  onComplete: () => void;
}) {
  useEffect(() => {
    const t = window.setTimeout(onComplete, introConfig.LOGO_MS);
    return () => window.clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-100 h-dvh w-screen">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.04 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <LogoReveal />
      </motion.div>

      {/* Skip straight to the site */}
      <button
        onClick={onComplete}
        className="group absolute bottom-6 right-6 z-110 flex items-center gap-2 rounded-full border border-maroon/25 bg-white/70 px-5 py-2.5 text-sm font-medium tracking-wide text-maroon backdrop-blur-md transition-colors hover:bg-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-orange"
        aria-label="Skip intro"
      >
        Skip
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform group-hover:translate-x-0.5"
          aria-hidden
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
