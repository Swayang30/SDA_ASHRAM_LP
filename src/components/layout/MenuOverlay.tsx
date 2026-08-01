"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import ChakraLogo from "@/components/brand/ChakraLogo";
import { LotusBloom } from "@/components/brand/LotusDecor";
import { centralAddress, site, social, type NavItem } from "@/data/site";

const EASE = [0.22, 1, 0.36, 1] as const; // ≈ power3.out

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Right-hand slide-in menu panel (drawer).
 *
 * Deliberately NOT a full-bleed takeover: the page stays visible behind a
 * maroon scrim so you keep your bearings, and the nav lives in a narrow
 * column with its own brand lockup, close button and footer block. Nested
 * groups expand in place as an indented accordion — the panel is always one
 * scrollable column, never a second flyout.
 *
 * Motion is transform/opacity only: the panel translates in from the right
 * while the scrim cross-fades, then the items stagger in. Under
 * `prefers-reduced-motion` everything is a plain fade with no stagger.
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
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus the first control in the panel, trap Tab inside it, close on Esc.
  // The trap is scoped to the panel (not a global [data-nav-focus] sweep) so
  // the inert page behind can never receive focus, and collapsed accordion
  // links — which are `inert` — are skipped.
  useEffect(() => {
    if (!open) return;

    const getFocusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []
      ).filter(
        (el) => el.offsetParent !== null && !el.closest("[inert]")
      );

    getFocusables()[0]?.focus();

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

  // (No reset effect needed: this component only mounts while the panel is
  // open, so `expanded` starts fresh on every open.)

  const listVariants: Variants = {
    hidden: {},
    show: {
      // Items land just after the panel finishes travelling.
      transition: reduced
        ? {}
        : { staggerChildren: 0.045, delayChildren: 0.26 },
    },
  };
  const itemVariants: Variants = {
    hidden: reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: 18 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: reduced ? 0 : 0.42, ease: EASE },
    },
  };

  return (
    <div id="site-menu" className="fixed inset-0 z-80">
      {/* scrim — the page behind stays visible, just dimmed */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduced ? 0.15 : 0.4, ease: EASE }}
        onClick={onClose}
        // Literal rgba rather than `bg-maroon/45`: Tailwind v4 compiles the
        // opacity modifier to an oklab color-mix, which composites slightly
        // differently from the maroon tint specified for this scrim.
        className="absolute inset-0 bg-[rgba(84,17,0,0.45)] backdrop-blur-[3px]"
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        initial={reduced ? { opacity: 0 } : { x: "100%" }}
        animate={reduced ? { opacity: 1 } : { x: 0 }}
        exit={reduced ? { opacity: 0 } : { x: "100%" }}
        transition={{ duration: reduced ? 0.15 : 0.42, ease: EASE }}
        style={{ willChange: "transform" }}
        className="absolute inset-y-0 right-0 flex w-[min(86vw,400px)] flex-col overflow-hidden bg-[linear-gradient(180deg,#5e1502,#3c0c00)] shadow-[-24px_0_60px_-20px_rgba(0,0,0,0.55)] md:w-[min(400px,55vw)] md:rounded-l-3xl lg:w-[min(420px,32vw)]"
      >
        {/* hairline left edge in a lighter tone */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-px bg-ivory/15"
        />
        {/* lotus texture — small and faint so it reads as grain in a narrow column */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.045]">
          <LotusBloom className="absolute -left-8 top-24 h-36 w-36" fill="var(--color-ivory)" />
          <LotusBloom className="absolute -right-6 top-1/2 h-44 w-44" fill="var(--color-gold)" />
          <LotusBloom className="absolute bottom-24 left-6 h-32 w-32" fill="var(--color-ivory)" />
        </div>

        {/* ---- brand + close (pinned top) ---- */}
        <div className="relative flex shrink-0 items-start justify-between gap-4 border-b border-ivory/10 px-6 py-5 lg:px-8">
          <Link
            href="/#home"
            onClick={onClose}
            className="group flex items-center gap-2.5 rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
          >
            <span className="text-orange">
              <ChakraLogo
                className="h-8 w-8 shrink-0 transition-transform duration-500 group-hover:rotate-45"
                showMantra={false}
              />
            </span>
            <span className="font-serif text-[0.92rem] leading-tight tracking-wide text-ivory">
              {site.name}
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="-mr-1 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ivory/70 transition-colors hover:bg-ivory/10 hover:text-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* ---- nav (scrolls if it outgrows the panel) ---- */}
        <motion.nav
          variants={listVariants}
          initial="hidden"
          animate="show"
          aria-label="Main"
          className="relative flex-1 overflow-y-auto overscroll-contain px-6 py-7 lg:px-8"
        >
          <ul className="flex flex-col gap-y-4">
            {items.map((item) => {
              const hasChildren = !!item.children?.length;
              const isOpen = expanded === item.label;
              return (
                <motion.li key={item.href} variants={itemVariants}>
                  <div className="flex items-center justify-between gap-3">
                    <a
                      href={item.href}
                      onClick={onClose}
                      className="rounded font-serif text-[1.5rem] leading-tight text-ivory transition-colors hover:text-orange focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange lg:text-[1.9rem]"
                    >
                      {item.label}
                    </a>

                    {hasChildren && (
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.label} submenu`}
                        onClick={() => setExpanded(isOpen ? null : item.label)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ivory/60 transition-colors hover:bg-ivory/10 hover:text-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                      >
                        <motion.svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: reduced ? 0 : 0.28, ease: EASE }}
                          aria-hidden
                        >
                          <path d="M6 9l6 6 6-6" />
                        </motion.svg>
                      </button>
                    )}
                  </div>

                  {/* indented accordion — expands in place, never a flyout.
                      `inert` when collapsed so the hidden links are out of the
                      tab order and the accessibility tree. */}
                  {hasChildren && (
                    <motion.div
                      initial={false}
                      animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                      transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
                      inert={!isOpen}
                      className="overflow-hidden"
                    >
                      <ul className="mt-2.5 flex flex-col gap-2.5 border-l border-ivory/15 pl-4">
                        {item.children!.map((child) => (
                          <li key={child.href}>
                            <a
                              href={child.href}
                              onClick={onClose}
                              className="block rounded font-sans text-[0.95rem] leading-snug text-ivory/70 transition-colors hover:text-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                            >
                              {child.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </motion.li>
              );
            })}
          </ul>
        </motion.nav>

        {/* ---- footer block (pinned bottom) ---- */}
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.42 }}
          className="relative shrink-0 border-t border-ivory/10 px-6 py-5 lg:px-8"
        >
          <address className="space-y-1 wrap-break-word font-sans text-[0.8rem] not-italic text-ivory/65">
            {centralAddress.phone && (
              <p>
                <a
                  href={`tel:${centralAddress.phone.replace(/\s+/g, "")}`}
                  className="rounded transition-colors hover:text-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                >
                  {centralAddress.phone}
                </a>
              </p>
            )}
            {centralAddress.email && (
              <p>
                <a
                  href={`mailto:${centralAddress.email}`}
                  className="rounded transition-colors hover:text-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                >
                  {centralAddress.email}
                </a>
              </p>
            )}
          </address>

          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  className="rounded font-sans text-[0.7rem] uppercase tracking-[0.16em] text-ivory/50 transition-colors hover:text-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}
