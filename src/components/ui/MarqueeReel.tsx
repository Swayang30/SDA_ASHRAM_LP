"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export interface ReelTile {
  id: string;
  label: string;
  img: string;
  /** Small scope line under the title (only used by the "below" caption). */
  subtitle?: string;
  /** When set, the whole tile becomes a link to this route. */
  href?: string;
  /** Overrides the generated link label. */
  ariaLabel?: string;
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
 *
 * Two caption shapes:
 *  - "overlay" (default) — caption sits on the image; used by galleries.
 *  - "below"             — title + subtitle sit under the thumbnail on the
 *                          page background; used by the programme cards.
 *
 * Tiles with an `href` become whole-tile links. Because the strip is also a
 * drag surface, a drag that travels more than a few pixels swallows the click
 * so swiping never navigates by accident.
 */
export default function MarqueeReel({
  items,
  speed = 0.5,
  reverse = false,
  aspect = "aspect-[4/5]",
  tileClassName = "w-48 md:w-56",
  className = "",
  rounded = "rounded-2xl",
  sizes = "(max-width: 768px) 45vw, 224px",
  caption = "overlay",
  ariaLabel = "Auto-scrolling image reel (drag to browse)",
}: {
  items: ReelTile[];
  /** px per frame (~60fps). */
  speed?: number;
  reverse?: boolean;
  aspect?: string;
  tileClassName?: string;
  className?: string;
  rounded?: string;
  /** Keep in step with `tileClassName` so large tiles don't fetch small art. */
  sizes?: string;
  caption?: "overlay" | "below";
  /** Describes the strip's contents — override when it isn't a photo reel. */
  ariaLabel?: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  // Shared with the click handler so a drag can cancel the navigation.
  const dragged = useRef(false);

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
      dragged.current = false;
      el.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!state.dragging) return;
      const dx = e.clientX - state.startX;
      // Past this threshold it's a swipe, not a click on a tile.
      if (Math.abs(dx) > 6) dragged.current = true;
      el.scrollLeft = state.startScroll - dx;
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
  const below = caption === "below";

  return (
    <div
      ref={scroller}
      className={`marquee no-scrollbar cursor-grab overflow-x-auto touch-pan-y select-none active:cursor-grabbing ${className}`}
      role="group"
      aria-label={ariaLabel}
    >
      <div className="flex w-max items-start gap-4 md:gap-6">
        {loop.map((item, i) => {
          // The second copy exists only to make the loop seamless — hide it
          // from assistive tech and take its link out of the tab order.
          const isClone = i >= items.length;
          const media = (
            <div
              className={`relative ${aspect} overflow-hidden ${rounded} bg-maroon/10 shadow-warm-sm`}
            >
              <Image
                src={item.img}
                alt={below ? "" : item.label}
                fill
                draggable={false}
                sizes={sizes}
                className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105"
              />
              {!below && (
                <>
                  <div className="absolute inset-0 bg-linear-to-t from-maroon/70 via-transparent to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-3 font-sans text-xs font-medium tracking-wide text-white">
                    {item.label}
                  </figcaption>
                </>
              )}
            </div>
          );

          const text = below ? (
            <figcaption className="mt-4">
              <h3 className="font-serif text-[1.3rem] leading-snug text-maroon md:text-[1.45rem]">
                {item.label}
              </h3>
              {item.subtitle && (
                <p className="mt-1.5 font-sans text-[0.68rem] uppercase leading-relaxed tracking-[0.14em] text-cocoa/60">
                  {item.subtitle}
                </p>
              )}
            </figcaption>
          ) : null;

          return (
            <figure
              key={`${item.id}-${i}`}
              className={`group relative shrink-0 ${tileClassName}`}
              aria-hidden={isClone}
            >
              {item.href ? (
                <Link
                  href={item.href}
                  tabIndex={isClone ? -1 : undefined}
                  aria-label={item.ariaLabel ?? item.label}
                  draggable={false}
                  onClick={(e) => {
                    if (dragged.current) e.preventDefault();
                  }}
                  className="block rounded-2xl transition-transform duration-500 ease-soft hover:-translate-y-2 focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-orange"
                >
                  {media}
                  {text}
                </Link>
              ) : (
                <>
                  {media}
                  {text}
                </>
              )}
            </figure>
          );
        })}
      </div>
    </div>
  );
}
