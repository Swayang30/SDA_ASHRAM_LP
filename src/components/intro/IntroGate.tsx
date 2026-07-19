"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Lenis from "lenis";
import IntroSequence from "./IntroSequence";

const SESSION_KEY = "sda_intro_seen";

/**
 * Plays the cinematic intro once per browser session, then reveals the
 * homepage. Bypassed under reduced-motion. Locks scroll while the intro runs.
 */
export default function IntroGate() {
  // `null` = undecided (first render, avoids SSR flash); false = skip; true = play.
  const [show, setShow] = useState<boolean | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const seen = sessionStorage.getItem(SESSION_KEY) === "1";

    if (reduce || seen) {
      setShow(false);
      return;
    }
    setShow(true);
  }, []);

  // Lock scrolling while the intro is on screen.
  useEffect(() => {
    if (!show) return;
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [show]);

  const complete = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro-gate"
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <IntroSequence onComplete={complete} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
