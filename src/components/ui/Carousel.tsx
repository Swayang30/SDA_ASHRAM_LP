"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import { motion } from "framer-motion";

interface CarouselProps {
  slides: React.ReactNode[];
  options?: EmblaOptionsType;
  /** Tailwind basis classes controlling how many slides show at once. */
  slideClassName?: string;
  gap?: string; // gap utility, e.g. "gap-6"
  className?: string;
  ariaLabel?: string;
  /** Show the orange circular arrows + counter. */
  controls?: boolean;
  counterClassName?: string;
}

function Arrow({
  dir,
  onClick,
  disabled,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous slide" : "Next slide"}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-orange text-white shadow-warm-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className={dir === "prev" ? "rotate-180" : ""}
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </motion.button>
  );
}

/** Embla drag/snap carousel with orange arrows and an active-orange dot counter. */
export default function Carousel({
  slides,
  options,
  slideClassName = "min-w-0 flex-[0_0_100%]",
  gap = "gap-6",
  className = "",
  ariaLabel = "Carousel",
  controls = true,
  counterClassName = "",
}: CarouselProps) {
  const [emblaRef, embla] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: false,
    ...options,
  });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelected(embla.selectedScrollSnap());
    setCanPrev(embla.canScrollPrev());
    setCanNext(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    setSnaps(embla.scrollSnapList());
    onSelect();
    embla.on("select", onSelect);
    embla.on("reInit", onSelect);
    return () => {
      embla.off("select", onSelect);
      embla.off("reInit", onSelect);
    };
  }, [embla, onSelect]);

  return (
    <div className={className}>
      <div
        className="overflow-hidden"
        ref={emblaRef}
        aria-roledescription="carousel"
        aria-label={ariaLabel}
      >
        <div className={`flex ${gap} touch-pan-y`}>
          {slides.map((s, i) => (
            <div
              key={i}
              className={slideClassName}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      {controls && (
        <div
          className={`mt-8 flex items-center gap-5 ${counterClassName}`}
        >
          <Arrow
            dir="prev"
            onClick={() => embla?.scrollPrev()}
            disabled={!canPrev}
          />
          <Arrow
            dir="next"
            onClick={() => embla?.scrollNext()}
            disabled={!canNext}
          />

          {/* dot counter */}
          <div className="flex items-center gap-2">
            {snaps.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === selected}
                onClick={() => embla?.scrollTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === selected
                    ? "w-6 bg-orange"
                    : "w-2 bg-maroon/25 hover:bg-maroon/40"
                }`}
              />
            ))}
          </div>

          <span className="ml-1 font-sans text-sm tabular-nums text-cocoa/60">
            {String(selected + 1).padStart(2, "0")}
            <span className="mx-1 text-cocoa/30">/</span>
            {String(slides.length).padStart(2, "0")}
          </span>
        </div>
      )}
    </div>
  );
}
