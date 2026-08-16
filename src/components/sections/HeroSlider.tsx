"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import SplitText from "@/components/reactbits/SplitText";
import Button from "@/components/ui/Button";
import { useReducedMotion } from "@/lib/useReducedMotion";
import {
  heroSlides,
  heroSliderConfig,
  type HeroReelSlide,
  type HeroStillSlide,
} from "@/data/site";

/* ------------------------------------------------------------------ *
 * Background for a "still" slide — ken-burns photograph plus the darkening
 * needed for headline contrast. Transform/opacity only.
 * ------------------------------------------------------------------ */
function StillBackground({ slide }: { slide: HeroStillSlide }) {
  return (
    <>
      <div className="hero-kenburns absolute inset-0 h-[112%] w-full">
        <Image
          src={slide.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* darkening for headline contrast + soft ripple sheen */}
      <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/45 to-black/25" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/60 to-transparent" />
      <div className="hero-ripple pointer-events-none absolute inset-0 opacity-60" />
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Background for a "reel" slide — a purely visual media surface. It carries
 * NO text of any kind (no headline, no CTA, no placeholder lettering): while
 * the real film is pending it shows a wordless brand-toned gradient with a
 * slow breathe and a small centred play glyph.
 *
 * inset-0 + object-cover on the <video> are REQUIRED — a bare <video> sizes
 * itself to the file's intrinsic width and blows the page out horizontally.
 * ------------------------------------------------------------------ */
function ReelBackground({
  slide,
  active,
  reduced,
}: {
  slide: HeroReelSlide;
  active: boolean;
  reduced: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Hidden until the file actually exists; `onError` drops us back to the
  // gradient/poster surface so a missing reel is never a black box.
  const [videoOk, setVideoOk] = useState(true);

  // Only the visible reel plays — a hidden <video> decoding in the background
  // is wasted battery and can stutter the crossfade. Under reduced motion the
  // video is never rendered at all, so the poster still is what you see.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) v.play().catch(() => {});
    else v.pause();
  }, [active]);

  const showVideo = !reduced && videoOk;

  return (
    <>
      {/* wordless brand surface — the base layer under poster/video */}
      <div className="absolute inset-0 bg-linear-to-br from-[#2a1408] via-cocoa to-[#1a0d07]" />
      <div
        aria-hidden
        className="hero-reel-glow pointer-events-none absolute inset-0"
      />

      {/* optional poster still, cropped 16:9 across the slide */}
      {slide.poster && (
        <Image
          src={slide.poster}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      )}

      {showVideo && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={slide.poster}
          aria-hidden
          onError={() => setVideoOk(false)}
        >
          <source src={slide.video} type="video/mp4" />
        </video>
      )}

      {/* subtle vignette so the surface reads as film, not a flat panel */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_38%,rgba(0,0,0,0.55))]" />

      {/* small centred play glyph — shown only while the reel itself isn't
          rendering (missing file / reduced motion), never over the live film */}
      {!showVideo && (
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span
          aria-hidden
          className="flex h-20 w-20 items-center justify-center rounded-full border border-white/25 bg-white/5 backdrop-blur-[2px] md:h-24 md:w-24"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="ml-1 text-white/70"
            aria-hidden
          >
            <path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.8-6.86a1 1 0 0 0 0-1.7L9.53 4.29A1 1 0 0 0 8 5.14Z" />
          </svg>
        </span>
      </div>
      )}
    </>
  );
}

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={dir === "prev" ? "rotate-180" : ""}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * Full-viewport auto-advancing hero slider.
 *
 * Slide 1 is the original hero; slide 2 is the ashram reel that used to play
 * as intro phase 2. Slides are stacked and crossfaded with opacity/transform
 * only. Autoplay pauses on hover, on keyboard focus inside the slider, and
 * while the tab is hidden. Under `prefers-reduced-motion` there is no
 * autoplay and no fade — slide 1 shows statically and the controls still work.
 */
export default function HeroSlider() {
  const slides = heroSlides;
  const count = slides.length;
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (n: number) => setIndex(((n % count) + count) % count), // infinite both ways
    [count]
  );
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  // Autoplay.
  useEffect(() => {
    if (reduced || paused || count < 2) return;
    const t = window.setInterval(
      () => setIndex((i) => (i + 1) % count),
      heroSliderConfig.AUTOPLAY_MS
    );
    return () => window.clearInterval(t);
  }, [reduced, paused, count]);

  // Don't advance while the tab is in the background.
  useEffect(() => {
    const onVis = () => setPaused(document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  const fade = reduced ? 0 : heroSliderConfig.FADE_S;

  return (
    <section
      id="home"
      aria-roledescription="carousel"
      aria-label="Ashram highlights"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="relative h-svh min-h-170 w-full overflow-hidden bg-[#1a0d07] text-white"
    >
      {slides.map((slide, i) => {
        const active = i === index;
        return (
          <motion.div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}: ${slide.navLabel}`}
            aria-hidden={!active}
            inert={!active}
            initial={false}
            animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 1.03 }}
            transition={{ duration: fade, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: "opacity, transform" }}
            className={`absolute inset-0 ${active ? "" : "pointer-events-none"}`}
          >
            {slide.kind === "still" ? (
              <>
                <StillBackground slide={slide} />

                {/* pt clears the fixed navbar at every breakpoint */}
                <div className="container-site relative z-10 flex h-full items-center pb-28 pt-28 md:pb-32 md:pt-32">
                  <div className="max-w-3xl">
                    {slide.eyebrow && (
                      <p className="mb-3 font-script text-2xl text-orange md:text-3xl">
                        {slide.eyebrow}
                      </p>
                    )}

                    {/* SplitText re-runs its char animation whenever the slide
                        becomes active again — keyed on the visit count. */}
                    {active ? (
                      <SplitText
                        key={`${slide.id}-${index}`}
                        tag="h1"
                        text={slide.headline}
                        splitType="words"
                        delay={90}
                        duration={0.9}
                        from={{ opacity: 0, y: 80 }}
                        to={{ opacity: 1, y: 0 }}
                        className="font-serif text-[clamp(2.2rem,6.2vw,5.2rem)] font-medium leading-[1.06] tracking-tight text-white"
                      />
                    ) : (
                      <h1 className="font-serif text-[clamp(2.2rem,6.2vw,5.2rem)] font-medium leading-[1.06] tracking-tight text-white">
                        {slide.headline}
                      </h1>
                    )}

                    {slide.body && (
                      <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-white/75">
                        {slide.body}
                      </p>
                    )}

                    <div className="mt-9 flex flex-wrap items-center gap-4">
                      {slide.ctas.map((cta) => (
                        <Button key={cta.label} href={cta.href} variant={cta.variant}>
                          {cta.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Reel slide: media only. There is deliberately no content layer
              // here — the slide's accessible name comes from the aria-label
              // on this wrapper, not from any visible text.
              <ReelBackground slide={slide} active={active} reduced={reduced} />
            )}
          </motion.div>
        );
      })}

      {/* ---- controls ---------------------------------------------- */}
      <div className="container-site pointer-events-none absolute inset-x-0 bottom-0 z-20 pb-8 md:pb-10">
        <div className="pointer-events-auto flex items-center gap-5">
          {/* dots */}
          <div className="flex items-center gap-2.5" role="tablist" aria-label="Choose slide">
            {slides.map((slide, i) => {
              const active = i === index;
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Show slide ${i + 1}: ${slide.navLabel}`}
                  onClick={() => go(i)}
                  className="group flex h-8 items-center rounded-full focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-orange"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-500 ease-soft ${
                      active
                        ? "w-10 bg-orange"
                        : "w-4 bg-white/40 group-hover:bg-white/70"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <span className="h-px flex-1 bg-white/15" aria-hidden />

          {/* prev / next */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              aria-controls="home"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white/85 transition-colors hover:border-white/60 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-orange"
            >
              <Arrow dir="prev" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              aria-controls="home"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white/85 transition-colors hover:border-white/60 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-orange"
            >
              <Arrow dir="next" />
            </button>
          </div>
        </div>
      </div>

      {/* Live region so screen readers hear the slide change. */}
      <p className="sr-only" aria-live="polite">
        {`Slide ${index + 1} of ${count}: ${slides[index].navLabel}`}
      </p>
    </section>
  );
}
