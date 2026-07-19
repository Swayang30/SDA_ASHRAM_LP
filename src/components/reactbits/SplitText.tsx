"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

type SplitType = "chars" | "words" | "lines";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number; // ms stagger between units
  duration?: number;
  ease?: string;
  splitType?: SplitType;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  textAlign?: React.CSSProperties["textAlign"];
  tag?: "p" | "h1" | "h2" | "h3" | "h4" | "div" | "span" | "blockquote";
  onLetterAnimationComplete?: () => void;
}

/**
 * ReactBits SplitText — splits copy into chars / words / lines and animates
 * each unit in with a stagger via GSAP, firing once on scroll-enter.
 * Used in every text-heavy block. Use 'words' or 'lines' for paragraphs.
 */
export default function SplitText({
  text,
  className = "",
  delay = 60,
  duration = 0.6,
  ease = "power3.out",
  splitType = "words",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  textAlign,
  tag: Tag = "p",
  onLetterAnimationComplete,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Build the split DOM manually (no paid GSAP SplitText plugin required).
    const buildUnits = (): HTMLElement[] => {
      el.innerHTML = "";
      const words = text.split(" ");

      if (splitType === "chars") {
        const units: HTMLElement[] = [];
        words.forEach((word, wi) => {
          const wordWrap = document.createElement("span");
          wordWrap.style.display = "inline-block";
          wordWrap.style.whiteSpace = "nowrap";
          word.split("").forEach((ch) => {
            const s = document.createElement("span");
            s.style.display = "inline-block";
            s.style.willChange = "transform, opacity";
            s.textContent = ch;
            wordWrap.appendChild(s);
            units.push(s);
          });
          el.appendChild(wordWrap);
          if (wi < words.length - 1)
            el.appendChild(document.createTextNode(" "));
        });
        return units;
      }

      // words / lines both start from word spans
      const wordSpans: HTMLElement[] = [];
      words.forEach((word, wi) => {
        const s = document.createElement("span");
        s.style.display = "inline-block";
        s.style.willChange = "transform, opacity";
        s.textContent = word;
        el.appendChild(s);
        wordSpans.push(s);
        if (wi < words.length - 1)
          el.appendChild(document.createTextNode(" "));
      });

      if (splitType === "words") return wordSpans;

      // lines: group words sharing the same offsetTop, wrap each group.
      const lines: HTMLElement[][] = [];
      let lastTop: number | null = null;
      wordSpans.forEach((w) => {
        const top = w.offsetTop;
        if (lastTop === null || top !== lastTop) {
          lines.push([]);
          lastTop = top;
        }
        lines[lines.length - 1].push(w);
      });

      el.innerHTML = "";
      const lineWraps: HTMLElement[] = [];
      lines.forEach((group, gi) => {
        const outer = document.createElement("span");
        outer.style.display = "block";
        outer.style.overflow = "hidden";
        const inner = document.createElement("span");
        inner.style.display = "block";
        inner.style.willChange = "transform, opacity";
        group.forEach((w, i) => {
          inner.appendChild(w);
          if (i < group.length - 1)
            inner.appendChild(document.createTextNode(" "));
        });
        outer.appendChild(inner);
        el.appendChild(outer);
        if (gi < lines.length - 1) el.appendChild(document.createTextNode(" "));
        lineWraps.push(inner);
      });
      return lineWraps;
    };

    if (prefersReducedMotion()) {
      // Render plain text, fully visible.
      el.textContent = text;
      return;
    }

    const units = buildUnits();
    if (!units.length) return;

    const ctx = gsap.context(() => {
      gsap.set(units, from);
      gsap.to(units, {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        scrollTrigger: {
          trigger: el,
          // Fire when the block is `threshold` into view from the bottom.
          start: `top ${Math.round((1 - threshold) * 100)}%`,
          toggleActions: "play none none none",
          once: true,
        },
        onComplete: onLetterAnimationComplete,
      });
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, splitType]);

  const Component = Tag as React.ElementType;
  return (
    <Component
      ref={ref as React.Ref<HTMLElement>}
      className={`split-target ${className}`}
      style={textAlign ? { textAlign } : undefined}
    >
      {text}
    </Component>
  );
}
