"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Lenis from "lenis";
import ChakraLogo from "@/components/brand/ChakraLogo";
import MenuOverlay from "@/components/layout/MenuOverlay";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { nav, site } from "@/data/site";

// Flip to true to make the bar translucent at all scroll positions.
const ALWAYS_TRANSLUCENT = false;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const pathname = usePathname();
  // Only the homepage has a full-height dark hero to sit transparently over;
  // every other route uses the frosted bar from the top so it stays readable.
  const isHome = pathname === "/";
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // Scroll state → frosted bar (reused hero threshold).
  useEffect(() => {
    const onScroll = () =>
      setScrolled(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll + stop Lenis while the menu is open.
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [open]);

  // Return focus to the hamburger when the menu closes.
  useEffect(() => {
    if (wasOpen.current && !open) hamburgerRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  // Single source of truth for the two appearance states.
  const frosted = ALWAYS_TRANSLUCENT || !isHome || scrolled;
  // Light tint reads over the dark hero and over the open overlay.
  const lightTint = open || !frosted;

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className={`fixed inset-x-0 top-0 z-70 transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-soft ${
          frosted && !open
            ? "border-b border-maroon/10 bg-[rgba(255,251,240,0.72)] shadow-warm-sm backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="container-site grid grid-cols-[1fr_auto_1fr] items-center py-4">
          {/* LEFT — spacer sized to match the right controls (keeps brand centered) */}
          <span aria-hidden className="h-11 w-11 justify-self-start" />

          {/* CENTER — brand */}
          <a
            href="/#home"
            aria-label={`${site.name} — home`}
            onClick={() => setOpen(false)}
            className="group flex items-center justify-center gap-3 justify-self-center rounded focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-orange"
          >
            <span className="text-orange">
              <ChakraLogo className="h-9 w-9 shrink-0 transition-transform duration-500 group-hover:rotate-45 sm:h-10 sm:w-10" showMantra={false} />
            </span>
            <span
              className={`whitespace-nowrap font-serif text-sm font-medium tracking-wide transition-colors duration-300 sm:text-lg ${
                lightTint ? "text-white" : "text-maroon"
              }`}
            >
              Swami Debananda Ashram
            </span>
          </a>

          {/* RIGHT — hamburger */}
          <button
            ref={hamburgerRef}
            data-nav-focus
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="site-menu"
            className={`relative flex h-11 w-11 items-center justify-center justify-self-end rounded-full transition-colors duration-300 hover:bg-current/5 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-orange ${
              lightTint ? "text-white" : "text-maroon"
            }`}
          >
            <span className="sr-only">Menu</span>
            <span className="relative block h-4 w-6">
              <motion.span
                className="absolute left-0 top-0 block h-0.5 w-6 rounded-full bg-current"
                animate={open ? { y: 7, rotate: 45 } : { y: 0, rotate: 0 }}
                transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "center" }}
              />
              <motion.span
                className="absolute left-0 top-1.75 block h-0.5 w-6 rounded-full bg-current"
                animate={open ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: reduced ? 0 : 0.2 }}
              />
              <motion.span
                className="absolute left-0 top-3.5 block h-0.5 w-6 rounded-full bg-current"
                animate={open ? { y: -7, rotate: -45 } : { y: 0, rotate: 0 }}
                transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "center" }}
              />
            </span>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <MenuOverlay
            open={open}
            onClose={() => setOpen(false)}
            items={nav}
            reduced={reduced}
          />
        )}
      </AnimatePresence>
    </>
  );
}
