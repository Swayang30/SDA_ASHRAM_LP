"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
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
  //
  // Measure the scrollbar's width BEFORE hiding overflow and publish it as
  // `--scrollbar-lock`; body and this header pad by it (see `.lock-compensate`
  // in globals.css) so the page doesn't slide sideways when the scrollbar
  // disappears. The panel is `position: fixed` and so ignores that padding —
  // it stays flush against the real right edge.
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    const root = document.documentElement;
    const clear = () => {
      lenis?.start();
      document.body.style.overflow = "";
      root.style.removeProperty("--scrollbar-lock");
    };

    if (open) {
      const sbw = window.innerWidth - root.clientWidth;
      if (sbw > 0) root.style.setProperty("--scrollbar-lock", `${sbw}px`);
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      clear();
    }
    return clear;
  }, [open]);

  // Make the rest of the page inert while the panel is open — including this
  // header, since the close control now lives inside the panel.
  //
  // This lives in Navbar rather than MenuOverlay because MenuOverlay is still
  // mounted during its exit animation: cleaning up here on `open → false` runs
  // BEFORE the focus-return effect below (React flushes all cleanups first),
  // so the hamburger is focusable again by the time we focus it. Doing it in
  // MenuOverlay would leave the header inert and silently drop focus.
  useEffect(() => {
    if (!open) return;
    const targets = Array.from(document.body.children).filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement &&
        el.id !== "site-menu" &&
        el.tagName !== "SCRIPT"
    );
    targets.forEach((el) => {
      el.setAttribute("inert", "");
      el.setAttribute("aria-hidden", "true");
    });
    return () => {
      targets.forEach((el) => {
        el.removeAttribute("inert");
        el.removeAttribute("aria-hidden");
      });
    };
  }, [open]);

  // Return focus to the hamburger when the menu closes.
  useEffect(() => {
    if (wasOpen.current && !open) hamburgerRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  // Single source of truth for the two appearance states.
  const frosted = ALWAYS_TRANSLUCENT || !isHome || scrolled;
  // Light tint reads over the dark hero. The menu no longer covers the bar
  // with its own dark field — it sits behind the scrim — so opening the panel
  // must not restyle it (that read as a flash).
  const lightTint = !frosted;

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className={`lock-compensate fixed inset-x-0 top-0 z-70 transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-soft ${
          frosted && !open
            ? "border-b border-maroon/10 bg-[rgba(255,251,240,0.72)] shadow-warm-sm backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="container-site grid grid-cols-[1fr_auto_1fr] items-center py-4">
          {/* LEFT — spacer sized to match the right controls (keeps brand centered) */}
          <span aria-hidden className="h-11 w-11 justify-self-start" />

          {/* CENTER — brand */}
          <Link
            href="/#home"
            aria-label={`${site.name} — home`}
            onClick={() => setOpen(false)}
            className="group flex items-center justify-center gap-3 justify-self-center rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
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
          </Link>

          {/* RIGHT — hamburger */}
          <button
            ref={hamburgerRef}
            data-nav-focus
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="site-menu"
            className={`relative flex h-11 w-11 items-center justify-center justify-self-end rounded-full transition-colors duration-300 hover:bg-current/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange ${
              lightTint ? "text-white" : "text-maroon"
            }`}
          >
            <span className="sr-only">Menu</span>
            {/* Stays a hamburger: it sits behind the scrim while the panel is
                open, and the close control lives inside the panel — an X here
                would be a visible-but-inert control. */}
            <span className="relative block h-4 w-6">
              <span className="absolute left-0 top-0 block h-0.5 w-6 rounded-full bg-current" />
              <span className="absolute left-0 top-1.75 block h-0.5 w-6 rounded-full bg-current" />
              <span className="absolute left-0 top-3.5 block h-0.5 w-6 rounded-full bg-current" />
            </span>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <MenuOverlay
            key="site-menu"
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
