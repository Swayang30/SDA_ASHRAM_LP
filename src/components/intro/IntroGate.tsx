"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Lenis from "lenis";
import IntroSequence from "./IntroSequence";

const SESSION_KEY = "sda_intro_seen";

/**
 * Plays the cinematic intro once per browser session, then reveals the
 * homepage. Bypassed under reduced-motion. Locks scroll while the intro runs.
 */
export default function IntroGate() {
  // `null` = undecided (first render); false = skip; true = play.
  const [show, setShow] = useState<boolean | null>(null);
  const pathname = usePathname();

  // While undecided on the homepage, an opaque cover is part of the
  // server-rendered HTML — the site must never flash before the intro.
  const undecided = show === null && pathname === "/";

  useEffect(() => {
    // The intro shutter belongs to the homepage only — deep links to detail
    // pages open straight into content.
    if (pathname !== "/") {
      setShow(false);
      return;
    }
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const seen = sessionStorage.getItem(SESSION_KEY) === "1";

    if (reduce || seen) {
      setShow(false);
      return;
    }
    setShow(true);
  }, [pathname]);

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
      {(show === true || undecided) && (
        <motion.div
          key="intro-gate"
          // Solid brand ground under the intro — nothing behind it can peek
          // through, and the cover exists from the very first server paint.
          className="fixed inset-0 z-100 bg-[#F0E5D0]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {show === true && <IntroSequence onComplete={complete} />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
