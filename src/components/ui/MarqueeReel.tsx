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
  fadeEdges = true,
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
  /**
   * Soft-mask the strip's left/right edges (the `.marquee` mask in
   * globals.css). Pass `false` for a hard clip at the container edge.
   */
  fadeEdges?: boolean;
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

    /**
     * The scroll offset is accumulated HERE, in a float, and written out whole
     * each frame — never read back and incremented.
     *
     * `scrollLeft` snaps every write to the device-pixel grid, so a sub-pixel
     * `scrollLeft += 0.45` reads back unchanged: the strip never advances, and
     * the wrap below then bounces it between 0 and half the track forever —
     * two positions that render identically because the tiles are duplicated,
     * so the marquee looks frozen. Keeping the fraction in JS makes any
     * `speed` work at any devicePixelRatio.
     */
    const half = () => el.scrollWidth / 2;
    /** Fold any offset back into [0, half). */
    const wrap = (x: number) => {
      const h = half();
      return h > 0 ? ((x % h) + h) % h : 0;
    };

    // Seed the reverse direction near the middle so it can wrap either way.
    let offset = reverse ? half() : 0;

    const step = () => {
      if (!reduce && !state.paused && !state.dragging && half() > 0) {
        offset = wrap(offset + (reverse ? -speed : speed));
        el.scrollLeft = offset;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    // Pause on hover (pointer only — touch uses drag handlers below).
    const onEnter = () => (state.paused = true);
    const onLeave = () => (state.paused = false);

    /**
     * Pointer drag → scroll (mouse + pen + touch via Pointer Events).
     *
     * Deliberately NOT `setPointerCapture`: capturing on this scrollport
     * retargets pointerup to it, so the browser then fires `click` on the
     * scrollport rather than on the tile's <a> — the link shows its href on
     * hover but never navigates. The move/up pair lives on `window` instead,
     * which keeps a drag alive outside the strip without touching the click.
     */
    const onMove = (e: PointerEvent) => {
      if (!state.dragging) return;
      const dx = e.clientX - state.startX;
      // Past this threshold it's a swipe, not a click on a tile.
      if (Math.abs(dx) > 6) dragged.current = true;
      offset = wrap(state.startScroll - dx);
      el.scrollLeft = offset;
    };
    const onUp = () => {
      state.dragging = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
    const onDown = (e: PointerEvent) => {
      state.dragging = true;
      state.startX = e.clientX;
      state.startScroll = el.scrollLeft;
      dragged.current = false;
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerdown", onDown);

    return () => {
      cancelAnimationFrame(raf);
      onUp();
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
    };
  }, [items.length, speed, reverse]);

  if (items.length === 0) return null;
  // Two copies → seamless wrap at the half-way point.
  const loop = [...items, ...items];
  const below = caption === "below";

  return (
    <div
      ref={scroller}
      className={`${fadeEdges ? "marquee " : ""}no-scrollbar cursor-grab overflow-x-auto touch-pan-y select-none active:cursor-grabbing ${className}`}
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
                  // A clone still navigates on click, but must never take
                  // focus: focus inside an aria-hidden subtree is invisible to
                  // screen readers. Suppressing mousedown's default stops the
                  // focus without touching the click that follows it.
                  onMouseDown={isClone ? (e) => e.preventDefault() : undefined}
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
