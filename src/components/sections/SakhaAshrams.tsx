"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SectionHeading from "@/components/ui/SectionHeading";
import { LotusBloom } from "@/components/brand/LotusDecor";
import { ashrams, sakhaSection, type AshramItem } from "@/data/site";

/* ------------------------------------------------------------------ *
 *  Card
 * ------------------------------------------------------------------ */

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="font-sans text-[0.68rem] uppercase tracking-[0.18em] text-cocoa/45">
        {label}
      </dt>
      {/* wraps rather than truncates — sadhu names are the point of the card */}
      <dd className="mt-0.5 font-sans text-sm font-medium leading-snug text-maroon">
        {value}
      </dd>
    </div>
  );
}

function AshramCard({ item }: { item: AshramItem }) {
  return (
    <article
      className="group relative flex w-[78vw] max-w-90 shrink-0 snap-start flex-col overflow-hidden rounded-3xl bg-white shadow-warm-sm transition-shadow duration-500 hover:shadow-warm sm:w-85 lg:w-100 pin-desktop:h-full pin-desktop:max-h-140 pin-desktop:snap-align-none"
    >
      {/* cover */}
      {/* taller on mobile so a long ashram name still sits inside the cover;
          on lg the cover is the flexible part of the card — it absorbs
          whatever height the pinned viewport can spare, so the facts and the
          "View ashram" foot are never cropped */}
      <div className="relative aspect-4/3 overflow-hidden sm:aspect-video pin-desktop:aspect-auto pin-desktop:min-h-40 pin-desktop:flex-1">
        <Image
          src={item.card ?? item.gallery[0]}
          alt=""
          fill
          sizes="(max-width: 640px) 78vw, 400px"
          className="object-cover transition-transform duration-900 ease-soft group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-maroon/75 via-maroon/10 to-transparent" />
        <span className="absolute left-5 top-5 rounded-full bg-ivory/90 px-3 py-1 font-sans text-[0.68rem] font-medium uppercase tracking-[0.18em] text-maroon">
          {item.role}
        </span>
        <div className="absolute inset-x-5 bottom-4">
          <h3 className="font-serif text-[1.35rem] leading-tight text-white sm:text-[1.55rem]">
            {/* Stretched link: the ::after covers the whole card at z-0 so the
                gallery strip below (z-10) stays scrollable/draggable. */}
            <Link
              href={`/ashrams/${item.slug}`}
              aria-label={`${item.name} — ${item.location}. View ashram details`}
              className="rounded after:absolute after:inset-0 after:z-0 after:content-[''] focus-visible:outline-none"
            >
              {item.name}
            </Link>
          </h3>
          <p className="mt-1 font-sans text-xs text-white/80">{item.location}</p>
        </div>
      </div>

      {/* facts — natural height on lg (the cover flexes instead) */}
      <div className="flex flex-1 flex-col p-5 pin-desktop:flex-none">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5 border-b border-maroon/10 pb-4">
          <Fact label="Established" value={item.establishedYear} />
          <Fact label="Resident sadhus" value={String(item.residentSadhus)} />
          <Fact label="Head sadhu" value={item.headSadhu} />
          <Fact label="Phone" value={item.phone} />
        </dl>

        {/* gallery strip — scrollable, sits above the stretched link */}
        <div
          className="no-scrollbar relative z-10 -mx-1 mt-4 flex gap-2.5 overflow-x-auto px-1 pb-1"
          role="group"
          aria-label={`Photographs of ${item.name}`}
        >
          {item.gallery.map((src, i) => (
            <div
              key={i}
              className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-maroon/10"
            >
              <Image
                src={src}
                alt={`${item.name} photograph ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <span className="pointer-events-none mt-auto inline-flex items-center gap-2 pt-4 font-sans text-sm font-medium text-orange">
          View ashram
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>

      {/* focus ring for the whole card when its link is keyboard-focused */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl ring-2 ring-orange ring-offset-2 ring-offset-cream opacity-0 transition-opacity group-focus-within:opacity-100"
      />
    </article>
  );
}

/* ------------------------------------------------------------------ *
 *  Section
 * ------------------------------------------------------------------ */

/**
 * "Sakha Ashrams" — our ashrams in different places.
 *
 * Desktop (the `pin-desktop` variant): the section pins and the card track
 * travels right → left on scrub until the last card lands, then the section
 * releases. Distance is measured from the track's own width (it is `w-max`
 * when pinned, so offsetWidth IS the content width) and recomputed on
 * refresh, so pinning never jumps. The card cover flexes to absorb the
 * viewport height the facts don't need, so the card foot is never cropped.
 *
 * Mobile / reduced-motion: no pin — the very same track is a native
 * snap-scrolling swipe row at the cards' natural height.
 */
export default function SakhaAshrams() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;

    const mm = gsap.matchMedia();

    mm.add(
      // Must match the `pin-desktop` @custom-variant in globals.css.
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        // offsetWidth is exact because the track is `w-max` at this breakpoint.
        const distance = () =>
          Math.max(0, track.offsetWidth - window.innerWidth);

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set(track, { clearProps: "transform" });
        };
      }
    );

    // Placeholder art streams in after mount; without this the pin distance is
    // measured against a half-laid-out track and the last card never arrives.
    const root = rootRef.current;
    const imgs = Array.from(root?.querySelectorAll("img") ?? []);
    let pending = imgs.filter((img) => !img.complete).length;
    let refreshId = 0;
    const scheduleRefresh = () => {
      window.clearTimeout(refreshId);
      refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    };
    const onLoad = () => {
      pending -= 1;
      scheduleRefresh();
    };
    imgs.forEach((img) => {
      if (img.complete) return;
      img.addEventListener("load", onLoad, { once: true });
      img.addEventListener("error", onLoad, { once: true });
    });
    if (pending === 0) scheduleRefresh();

    return () => {
      window.clearTimeout(refreshId);
      imgs.forEach((img) => {
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onLoad);
      });
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id={sakhaSection.id}
      aria-labelledby="sakha-heading"
      className="relative scroll-mt-24 overflow-hidden bg-cream texture-paper"
    >
      <div
        ref={pinRef}
        // pin-desktop:pt-24 keeps the heading clear of the fixed navbar for
        // the whole time the section is pinned; the box is exactly one
        // viewport tall so the pin-spacer swap causes no layout jump.
        className="relative flex flex-col justify-center overflow-hidden py-20 md:py-24 pin-desktop:h-svh pin-desktop:pb-6 pin-desktop:pt-24"
      >
        <LotusBloom
          className="pointer-events-none absolute -right-16 -top-10 h-72 w-72 opacity-[0.07] lg:top-10"
          fill="var(--color-maroon)"
        />

        <div className="container-site relative mb-8 lg:mb-7">
          <p className="mb-2 font-script text-3xl text-orange md:text-4xl lg:mb-1">
            {sakhaSection.eyebrow}
          </p>
          <div id="sakha-heading">
            <SectionHeading
              lead={sakhaSection.heading.lead}
              accent={sakhaSection.heading.accent}
            />
          </div>
          <p className="mt-3 max-w-xl font-sans text-[0.95rem] leading-relaxed text-cocoa/70">
            {sakhaSection.intro}
          </p>
        </div>

        {/*
          ONE track, two behaviours:
            < lg  → native snap scroller (overflow-x-auto, constrained width)
            ≥ lg  → w-max element translated by GSAP, clipped by the pin wrapper
          The left padding lines the first card up with `container-site`.
        */}
        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-3 will-change-transform md:gap-7 md:px-12 lg:px-[max(3rem,calc((100vw-1440px)/2+3rem))] pin-desktop:min-h-0 pin-desktop:w-max pin-desktop:flex-1 pin-desktop:snap-none pin-desktop:overflow-x-visible pin-desktop:items-center pin-desktop:pb-0"
        >
          {ashrams.map((item) => (
            <AshramCard key={item.slug} item={item} />
          ))}
        </div>

        {/* affordance — desktop scrub hint / mobile swipe hint */}
        <p className="container-site mt-7 font-sans text-xs uppercase tracking-[0.22em] text-cocoa/40 lg:mt-6">
          <span className="hidden pin-desktop:inline">Scroll to travel between ashrams</span>
          <span className="pin-desktop:hidden">Swipe to browse ashrams</span>
        </p>
      </div>
    </section>
  );
}
