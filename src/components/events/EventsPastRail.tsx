"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import EventCard from "@/components/events/EventCard";
import type { PastEvent, eventsUi } from "@/data/site";

/** Must match the `pin-desktop` @custom-variant in globals.css. */
const PIN_QUERY =
  "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

/** Live `matchMedia` state without setState-in-effect. */
function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    [query]
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

interface RailState {
  /** Snapped step index — the spotlit card. */
  step: number;
  /** Index range of cards fully inside the viewport at this step. */
  first: number;
  last: number;
}

interface EventsPastRailProps {
  /** Block 1 — eyebrow, h2, hairline. Rendered inside the pinned box. */
  header: ReactNode;
  events: PastEvent[];
  ui: typeof eventsUi.past;
  months: readonly string[];
}

/**
 * Block 2 — the past-events rail.
 *
 * Desktop (`pin-desktop`): the box pins for `(count - 1) * 70vh` and the
 * scroll advances ONE card per step with snapping. Each step walks a
 * spotlight down the rail (the active card is full-scale and clear, the
 * rest sit back under a warm veil) while the track eases a short distance so
 * the fifth card arrives by the last step. That is deliberately not the
 * continuous scrub of the Sakha Ashrams section above it.
 *
 * Tablet / mobile: no pin — the same track is an Embla carousel with snap
 * and edge peek. Reduced motion (any width): Embla is inactive and the track
 * is a plain responsive grid with every card in normal flow. Nothing is
 * `inert` outside the desktop pin.
 *
 * State is derived (`useSyncExternalStore`) or set from GSAP / Embla
 * callbacks — no `setState` inside an effect body.
 */
export default function EventsPastRail({
  header,
  events,
  ui,
  months,
}: EventsPastRailProps) {
  const count = events.length;
  const steps = Math.max(1, count - 1);

  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  /** Step whose card link should receive focus once it is no longer inert. */
  const focusStepRef = useRef<number | null>(null);

  const isPin = useMediaQuery(PIN_QUERY);
  const isReduced = useMediaQuery(REDUCED_QUERY);

  const [rail, setRail] = useState<RailState>({
    step: 0,
    first: 0,
    last: count - 1,
  });

  /* ---------------- Embla (tablet / mobile only) ---------------- */
  const [emblaRef, embla] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    breakpoints: {
      [PIN_QUERY]: { active: false },
      [REDUCED_QUERY]: { active: false },
    },
  });

  const subscribeEmbla = useCallback(
    (cb: () => void) => {
      if (!embla) return () => {};
      embla.on("select", cb);
      embla.on("reInit", cb);
      return () => {
        embla.off("select", cb);
        embla.off("reInit", cb);
      };
    },
    [embla]
  );
  const emblaSnap = useSyncExternalStore(
    subscribeEmbla,
    () =>
      embla
        ? `${embla.selectedScrollSnap()}|${embla.canScrollPrev()}|${embla.canScrollNext()}`
        : `0|false|${count > 1}`,
    () => `0|false|${count > 1}`
  );
  const [emblaIndexRaw, emblaPrevRaw, emblaNextRaw] = emblaSnap.split("|");
  const emblaIndex = Number(emblaIndexRaw);
  const emblaCanPrev = emblaPrevRaw === "true";
  const emblaCanNext = emblaNextRaw === "true";

  /* ---------------- GSAP pin (desktop only) ---------------- */
  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track || count < 2) return;

    const mm = gsap.matchMedia();

    mm.add(PIN_QUERY, () => {
      const cards = Array.from(
        track.querySelectorAll<HTMLElement>("[data-rail-card]")
      );
      const veils = cards.map((c) =>
        c.querySelector<HTMLElement>("[data-rail-veil]")
      );
      if (cards.length !== count) return;

      // The track is `w-max` at this breakpoint, so offsetWidth IS the
      // content width; the peeking card fully arrives by the final step.
      const distance = () => Math.max(0, track.offsetWidth - window.innerWidth);
      const stepDistance = () => distance() / steps;

      const visibleAt = (step: number): RailState => {
        const x = -stepDistance() * step;
        const vw = window.innerWidth;
        let first = -1;
        let last = -1;
        cards.forEach((card, i) => {
          const left = card.offsetLeft + x;
          const right = left + card.offsetWidth;
          if (left >= -1 && right <= vw + 1) {
            if (first === -1) first = i;
            last = i;
          }
        });
        // The spotlit card is always reachable, whatever the measurement says.
        if (first === -1) {
          first = step;
          last = step;
        }
        return { step, first, last };
      };

      let lastStep = -1;
      const sync = (progress: number) => {
        if (fillRef.current) {
          gsap.set(fillRef.current, { scaleX: progress });
        }
        const step = Math.round(progress * steps);
        if (step !== lastStep) {
          lastStep = step;
          setRail(visibleAt(step));
        }
      };

      // Initial spotlight: card 0 clear, the rest veiled and set back.
      gsap.set(cards.slice(1), { scale: 0.96 });
      gsap.set(veils.slice(1), { opacity: 1 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut", duration: 1 },
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${Math.round(steps * 0.7 * window.innerHeight)}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.5,
          invalidateOnRefresh: true,
          // `inertia: false` snaps to the NEAREST step rather than where the
          // scroll velocity would carry it — one card per step, never a
          // flick that overshoots to the end.
          snap: {
            snapTo: 1 / steps,
            duration: 0.3,
            ease: "power2.out",
            inertia: false,
          },
          onUpdate: (self) => sync(self.progress),
          onRefresh: (self) => {
            lastStep = -1;
            sync(self.progress);
          },
        },
      });

      for (let i = 1; i <= steps; i++) {
        const at = i - 1;
        tl.to(track, { x: () => -stepDistance() * i }, at)
          .to(cards[i - 1], { scale: 0.96 }, at)
          .to(veils[i - 1], { opacity: 1 }, at)
          .to(cards[i], { scale: 1 }, at)
          .to(veils[i], { opacity: 0 }, at);
      }

      stRef.current = tl.scrollTrigger ?? null;

      return () => {
        stRef.current = null;
        tl.scrollTrigger?.kill();
        tl.kill();
        gsap.set([track, ...cards], { clearProps: "transform" });
        gsap.set(veils, { clearProps: "opacity" });
        if (fillRef.current) gsap.set(fillRef.current, { clearProps: "transform" });
      };
    });

    return () => mm.revert();
  }, [count, steps]);

  // After a keyboard step the previously focused card may have gone inert
  // (focus drops to <body>). Move focus to the spotlit card's link as soon
  // as React has rendered it focusable again — DOM focus only, no setState.
  useEffect(() => {
    const target = focusStepRef.current;
    if (target === null || target !== rail.step) return;
    focusStepRef.current = null;
    const card = trackRef.current?.querySelectorAll<HTMLElement>("[data-rail-card]")[target];
    card?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
  }, [rail.step]);

  /* ---------------- Controls ---------------- */
  const scrollToStep = useCallback(
    (index: number, focusCard = false) => {
      const st = stRef.current;
      if (!st) return;
      const target = Math.min(steps, Math.max(0, index));
      focusStepRef.current = focusCard ? target : null;
      const y = st.start + (st.end - st.start) * (target / steps);
      const lenis = (
        window as unknown as {
          __lenis?: { scrollTo: (t: number, o?: { duration?: number }) => void };
        }
      ).__lenis;
      if (lenis) lenis.scrollTo(y, { duration: 0.9 });
      else window.scrollTo({ top: y, behavior: "smooth" });
    },
    [steps]
  );

  const goPrev = () => {
    if (isPin) scrollToStep(rail.step - 1);
    else embla?.scrollPrev();
  };
  const goNext = () => {
    if (isPin) scrollToStep(rail.step + 1);
    else embla?.scrollNext();
  };

  // Arrow keys step the pinned rail from any focused card link, so every
  // card — including the peeking fifth — is reachable from the keyboard.
  const onTrackKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isPin) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollToStep(rail.step + 1, true);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollToStep(rail.step - 1, true);
    }
  };

  const index = isPin ? rail.step : emblaIndex;
  const canPrev = isPin ? rail.step > 0 : emblaCanPrev;
  const canNext = isPin ? rail.step < steps : emblaCanNext;
  const activeTitle = events[index]?.title ?? "";

  return (
    <div
      ref={pinRef}
      // Exactly one viewport tall while pinned so the pin-spacer swap causes
      // no layout jump; pt-24 keeps the heading clear of the fixed navbar.
      className="relative flex flex-col justify-center overflow-hidden pb-16 pt-24 md:pb-20 md:pt-28 pin-desktop:h-svh pin-desktop:pb-6 pin-desktop:pt-24"
    >
      {header}

      {/* progress affordance — hidden under reduced motion (the grid shows all) */}
      <div className="container-site relative mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 motion-reduce:hidden pin-desktop:mt-6">
        <p className="font-sans text-[0.68rem] uppercase tracking-[0.22em] text-ivory/60">
          {ui.label}
        </p>
        <p className="font-serif text-lg tabular-nums text-ivory">
          {pad(index + 1)}
          <span className="mx-2 text-gold">{ui.counterSeparator}</span>
          {pad(count)}
        </p>
        <div aria-hidden className="relative h-px min-w-24 flex-1 bg-gold/30">
          {/* desktop fill — GSAP-driven */}
          <div
            ref={fillRef}
            className="absolute inset-y-0 left-0 hidden w-full origin-left scale-x-0 bg-gold pin-desktop:block"
          />
          {/* carousel fill — React-driven */}
          <div
            className="absolute inset-y-0 left-0 bg-gold transition-[width] duration-500 ease-soft pin-desktop:hidden"
            style={{ width: `${((emblaIndex + 1) / count) * 100}%` }}
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <RailArrow dir="prev" label={ui.previous} onClick={goPrev} disabled={!canPrev} />
          <RailArrow dir="next" label={ui.next} onClick={goNext} disabled={!canNext} />
        </div>
        <p className="sr-only" aria-live="polite">
          {`${index + 1} of ${count}: ${activeTitle}`}
        </p>
      </div>

      {/*
        ONE track, three behaviours:
          reduced motion → responsive grid, every card in flow
          < lg           → Embla carousel (viewport = overflow-hidden wrapper)
          ≥ lg           → w-max element translated by GSAP inside the pin
        The left padding lines the first card up with `container-site`.
      */}
      <div
        ref={emblaRef}
        className="mt-8 overflow-hidden pin-desktop:mt-6 pin-desktop:flex pin-desktop:min-h-0 pin-desktop:flex-1 pin-desktop:items-center"
      >
        <div
          ref={trackRef}
          onKeyDown={onTrackKeyDown}
          className="relative flex touch-pan-y gap-5 px-6 pb-8 pt-2 will-change-transform md:gap-6 md:px-12 lg:px-[max(3rem,calc((100vw-1440px)/2+3rem))] pin-desktop:w-max pin-desktop:[--visible:3.35] xl:[--visible:4.35]! pin-desktop:[--card-w:min(calc((100vw_-_2*max(3rem,calc((100vw_-_1440px)/2+3rem))_-_4*1.5rem)/var(--visible)),calc(100svh_-_34rem))] motion-reduce:grid motion-reduce:grid-cols-1 motion-reduce:gap-6 sm:motion-reduce:grid-cols-2 lg:motion-reduce:grid-cols-3 xl:motion-reduce:grid-cols-5"
        >
          {events.map((event, i) => (
            <EventCard
              key={event.id}
              event={event}
              months={months}
              readMoreLabel={ui.readMore}
              inert={isPin && !isReduced && (i < rail.first || i > rail.last)}
              className="w-[76vw] shrink-0 sm:w-[calc(50%-0.75rem)] md:w-[calc(40%-0.9rem)] pin-desktop:w-(--card-w) motion-reduce:w-auto!"
            />
          ))}
        </div>
      </div>

      {/* affordance — desktop step hint / mobile swipe hint */}
      <p className="container-site mt-2 font-sans text-xs uppercase tracking-[0.22em] text-ivory/40 motion-reduce:hidden pin-desktop:mt-4">
        <span className="hidden pin-desktop:inline">{ui.railHint}</span>
        <span className="pin-desktop:hidden">{ui.swipeHint}</span>
      </p>
    </div>
  );
}

function RailArrow({
  dir,
  label,
  onClick,
  disabled,
}: {
  dir: "prev" | "next";
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/60 text-gold transition-colors duration-300 hover:bg-gold hover:text-maroon disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className={dir === "prev" ? "rotate-180" : ""}
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </button>
  );
}
