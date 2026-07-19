"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * Scroll-scrubbed vertical parallax. Decorative layers move slower/opposite to
 * the foreground (§8.3). `from`/`to` are px offsets over the element's travel.
 */
export default function Parallax({
  children,
  from = 60,
  to = -60,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  from?: number;
  to?: number;
  className?: string;
  as?: "div" | "span";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: from },
        {
          y: to,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [from, to]);

  const Tag = as;
  return (
    <Tag ref={ref as React.Ref<HTMLDivElement>} className={className}>
      {children}
    </Tag>
  );
}
