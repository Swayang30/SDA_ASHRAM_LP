"use client";

import { motion } from "framer-motion";
import LogoReveal from "./LogoReveal";

/**
 * The intro is a single phase — the logo feature — and it holds until the
 * visitor chooses to enter: the "Enter Site" button fades in once the logo
 * animation has landed, and only clicking it reveals the site.
 */
export default function IntroSequence({
  onComplete,
}: {
  onComplete: () => void;
}) {
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

      {/* Enter the site — appears once the logo animation has settled */}
      <motion.div
        className="absolute inset-x-0 bottom-[8vh] z-110 flex justify-center"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          onClick={onComplete}
          className="group flex items-center gap-2.5 rounded-full bg-maroon px-8 py-3.5 font-sans text-sm font-medium uppercase tracking-[0.18em] text-ivory shadow-warm transition-colors duration-300 hover:bg-orange focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-orange"
          aria-label="Enter site"
        >
          Enter Site
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
      </motion.div>
    </div>
  );
}
