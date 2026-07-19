"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { LotusBloom } from "@/components/brand/LotusDecor";
import type { NavItem } from "@/data/site";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Full-screen menu overlay. Renders the nav items large in the serif with a
 * staggered rise-in, supports nested `children`, traps focus, and closes on
 * Esc / backdrop / link / X. Reduced-motion → instant, no stagger.
 */
export default function MenuOverlay({
  open,
  onClose,
  items,
  reduced,
}: {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  reduced: boolean;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  // Focus first link on open; trap Tab across all [data-nav-focus] elements
  // (the header hamburger + the overlay links); Esc closes.
  useEffect(() => {
    if (!open) return;

    const panelFirst = document.querySelector<HTMLElement>(
      "#site-menu [data-nav-focus]"
    );
    panelFirst?.focus();

    const getFocusables = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>("[data-nav-focus]")
      ).filter((el) => el.offsetParent !== null);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const list = getFocusables();
      if (!list.length) return;
      const idx = list.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey) {
        if (idx <= 0) {
          e.preventDefault();
          list[list.length - 1].focus();
        }
      } else if (idx === list.length - 1) {
        e.preventDefault();
        list[0].focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setExpanded(null);
  }, [open]);

  const listVariants: Variants = {
    hidden: {},
    show: {
      transition: reduced ? {} : { staggerChildren: 0.07, delayChildren: 0.12 },
    },
  };
  const itemVariants: Variants = {
    hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 0.5, ease: EASE },
    },
  };

  return (
    <motion.div
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
      onClick={onClose}
      className="fixed inset-0 z-[60] overflow-y-auto"
    >
      {/* warm cream/maroon backdrop + faint lotus pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#6a1a03,#3f0d00)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <LotusBloom className="absolute -left-10 top-10 h-72 w-72" fill="var(--color-ivory)" />
        <LotusBloom className="absolute right-0 top-1/3 h-96 w-96" fill="var(--color-gold)" />
        <LotusBloom className="absolute bottom-6 left-1/3 h-80 w-80" fill="var(--color-ivory)" />
      </div>

      {/* nav list */}
      <motion.nav
        variants={listVariants}
        initial="hidden"
        animate="show"
        onClick={(e) => e.stopPropagation()}
        className="relative flex min-h-full flex-col items-center justify-center gap-2 px-6 py-28 text-center"
      >
        {items.map((item) => {
          const isOpen = expanded === item.label;
          return (
            <motion.div
              key={item.href}
              variants={itemVariants}
              className="w-full max-w-md"
            >
              <div className="flex items-center justify-center gap-3">
                <a
                  href={item.href}
                  data-nav-focus
                  onClick={onClose}
                  className="rounded font-serif text-4xl leading-tight text-ivory transition-colors hover:text-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange md:text-5xl"
                >
                  {item.label}
                </a>

                {item.children && item.children.length > 0 && (
                  <button
                    type="button"
                    data-nav-focus
                    aria-expanded={isOpen}
                    aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.label} submenu`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpanded(isOpen ? null : item.label);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-ivory/70 transition-colors hover:bg-ivory/10 hover:text-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                  >
                    <motion.svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: reduced ? 0 : 0.25 }}
                      aria-hidden
                    >
                      <path d="M6 9l6 6 6-6" />
                    </motion.svg>
                  </button>
                )}
              </div>

              {/* nested children */}
              {item.children && item.children.length > 0 && (
                <motion.ul
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col items-center gap-1 pb-2 pt-3">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <a
                          href={child.href}
                          data-nav-focus
                          onClick={onClose}
                          className="rounded font-sans text-lg tracking-wide text-ivory/75 transition-colors hover:text-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </div>
                </motion.ul>
              )}
            </motion.div>
          );
        })}
      </motion.nav>
    </motion.div>
  );
}
