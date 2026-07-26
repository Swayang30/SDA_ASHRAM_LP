"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export interface ReelTile {
  id: string;
  label: string;
  img: string;
}

/**
 * Auto-scrolling image / reel strip that is ALSO drag / swipe-able.
 *
 * Implementation: a native horizontal-scroll container (so touch + trackpad
 * swipe work for free) whose `scrollLeft` is advanced every frame. The items
 * are rendered twice and the offset wraps at the half-way point, so the loop is
 * seamless with no gaps. Auto-scroll pauses on hover and while the user drags,
 * and is disabled entirely under `prefers-reduced-motion` (the strip stays
 * static but remains swipeable).
 */
export default function MarqueeReel({
  items,
  speed = 0.5,
  reverse = false,
  aspect = "aspect-[4/5]",
  tileClassName = "w-48 md:w-56",
  className = "",
  rounded = "rounded-2xl",
}: {
  items: ReelTile[];
  /** px per frame (~60fps). */
  speed?: number;
  reverse?: boolean;
  aspect?: string;
  tileClassName?: string;
  className?: string;
  rounded?: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scroller.current;
    if (!el || items.length === 0) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // State shared with the loop.
    const state = { paused: false, dragging: false, startX: 0, startScroll: 0 };
    let raf = 0;

    // Seed the reverse direction near the middle so it can wrap either way.
    if (reverse) el.scrollLeft = el.scrollWidth / 2;

    const wrap = () => {
      const half = el.scrollWidth / 2;
      if (half <= 0) return;
      if (el.scrollLeft >= half) el.scrollLeft -= half;
      else if (el.scrollLeft <= 0) el.scrollLeft += half;
    };

    const step = () => {
      if (!reduce && !state.paused && !state.dragging) {
        el.scrollLeft += reverse ? -speed : speed;
        wrap();
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    // Pause on hover (pointer only — touch uses drag handlers below).
    const onEnter = () => (state.paused = true);
    const onLeave = () => (state.paused = false);

    // Pointer drag → scroll (mouse + pen + touch via Pointer Events).
    const onDown = (e: PointerEvent) => {
      state.dragging = true;
      state.startX = e.clientX;
      state.startScroll = el.scrollLeft;
      el.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!state.dragging) return;
      el.scrollLeft = state.startScroll - (e.clientX - state.startX);
      wrap();
    };
    const onUp = (e: PointerEvent) => {
      state.dragging = false;
      el.releasePointerCapture?.(e.pointerId);
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [items.length, speed, reverse]);

  if (items.length === 0) return null;
  // Two copies → seamless wrap at the half-way point.
  const loop = [...items, ...items];

  return (
    <div
      ref={scroller}
      className={`marquee no-scrollbar cursor-grab overflow-x-auto touch-pan-y select-none active:cursor-grabbing ${className}`}
      role="group"
      aria-label="Auto-scrolling image reel (drag to browse)"
    >
      <div className="flex w-max gap-4 md:gap-6">
        {loop.map((item, i) => (
          <figure
            key={`${item.id}-${i}`}
            className={`relative shrink-0 ${tileClassName}`}
            aria-hidden={i >= items.length}
          >
            <div
              className={`group relative ${aspect} overflow-hidden ${rounded} bg-maroon/10 shadow-warm-sm`}
            >
              <Image
                src={item.img}
                alt={item.label}
                fill
                draggable={false}
                sizes="(max-width: 768px) 45vw, 224px"
                className="object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon/70 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-3 font-sans text-xs font-medium tracking-wide text-white">
                {item.label}
              </figcaption>
            </div>
          </figure>
        ))}
      </div>
    </div>
  );
}
