"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LogoReveal from "./LogoReveal";
import IntroVideo from "./IntroVideo";
import { introConfig } from "@/data/site";

type Phase = "logo" | "video";

/** Orchestrates the intro phases and the Skip control. */
export default function IntroSequence({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("logo");

  const goVideo = useCallback(() => setPhase("video"), []);

  // Phase 1 timer → advance to the video reel.
  useEffect(() => {
    if (phase !== "logo") return;
    const t = window.setTimeout(goVideo, introConfig.LOGO_MS);
    return () => window.clearTimeout(t);
  }, [phase, goVideo]);

  const skip = useCallback(() => {
    if (phase === "logo") goVideo();
    else onComplete();
  }, [phase, goVideo, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] h-[100dvh] w-screen">
      <AnimatePresence mode="wait">
        {phase === "logo" ? (
          <motion.div
            key="logo"
            className="absolute inset-0"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <LogoReveal />
          </motion.div>
        ) : (
          <motion.div
            key="video"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <IntroVideo onEnded={onComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip control — always available */}
      <button
        onClick={skip}
        className="group absolute bottom-6 right-6 z-[110] flex items-center gap-2 rounded-full border border-white/30 bg-black/30 px-5 py-2.5 text-sm font-medium tracking-wide text-white/90 backdrop-blur-md transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
        aria-label="Skip intro"
      >
        {phase === "logo" ? "Skip" : "Enter site"}
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
