"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

interface ScrollFloatProps {
  children: ReactNode;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
}

/**
 * ReactBits ScrollFloat — splits text into characters and floats each up
 * (yPercent + scaleY/scaleX ease) as it scrolls into view, scrubbed by
 * ScrollTrigger. Used on every section heading via <SectionHeading>.
 */
export default function ScrollFloat({
  children,
  scrollContainerRef,
  containerClassName = "",
  textClassName = "",
  animationDuration = 1,
  ease = "back.out(1.6)",
  scrollStart = "center bottom+=50%",
  scrollEnd = "bottom bottom-=40%",
  stagger = 0.03,
}: ScrollFloatProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  const chars = useMemo(() => {
    const text = typeof children === "string" ? children : "";
    const NBSP = " ";
    return text.split("").map((c, i) => (
      <span className="sf-char inline-block will-change-transform" key={i}>
        {c === " " ? NBSP : c}
      </span>
    ));
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const charEls = el.querySelectorAll<HTMLElement>(".sf-char");
    if (!charEls.length) return;

    if (prefersReducedMotion()) {
      gsap.set(charEls, { opacity: 1, yPercent: 0, scaleY: 1, scaleX: 1 });
      return;
    }

    const scroller = scrollContainerRef?.current ?? undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        charEls,
        {
          opacity: 0,
          yPercent: 120,
          scaleY: 2.3,
          scaleX: 0.7,
          transformOrigin: "50% 0%",
        },
        {
          duration: animationDuration,
          ease,
          opacity: 1,
          yPercent: 0,
          scaleY: 1,
          scaleX: 1,
          stagger,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: scrollStart,
            end: scrollEnd,
            scrub: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [
    animationDuration,
    ease,
    scrollStart,
    scrollEnd,
    stagger,
    scrollContainerRef,
  ]);

  return (
    <span
      ref={containerRef}
      className={`scrollfloat-target inline-block overflow-hidden pb-[0.12em] ${containerClassName}`}
    >
      <span className={`inline-block leading-[1.1] ${textClassName}`}>
        {chars}
      </span>
    </span>
  );
}
