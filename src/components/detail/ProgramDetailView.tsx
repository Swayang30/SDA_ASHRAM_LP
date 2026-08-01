"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import SplitText from "@/components/reactbits/SplitText";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  MEASURE,
  PROSE,
  SectionBlock,
  SectionNav,
  useActiveSection,
} from "@/components/detail/DetailSections";
import { LotusBloom } from "@/components/brand/LotusDecor";
import type { OrgSection, ProgramItem, ProgramSection } from "@/data/site";

/**
 * Adapts a `ProgramSection` onto the shared `OrgSection` shape that
 * `SectionBlock` renders, so programme pages reuse the Round-3 reading
 * typography instead of forking a second layout.
 */
function toSharedSection(s: ProgramSection): OrgSection {
  return {
    id: s.id,
    heading: s.heading,
    type: s.type === "gallery" ? "gallery" : s.type === "stats" ? "stats" : "text",
    body: s.body ? [s.body] : undefined,
    list: s.bullets,
    stats: s.stats,
    gallery: s.images?.map((img, i) => ({
      id: `${s.id}-${i}`,
      label: `${s.heading} — photograph ${i + 1}`,
      img,
    })),
  };
}

/** "Healthcare Activities" → { lead: "Healthcare", accent: "Activities" } */
function splitTitle(title: string) {
  const [lead, ...rest] = title.split(" ");
  return { lead, accent: rest.join(" ") || undefined };
}

function ProgramLink({
  item,
  dir,
}: {
  item: ProgramItem;
  dir: "prev" | "next";
}) {
  const isNext = dir === "next";
  return (
    <Link
      href={`/programs/${item.slug}`}
      className={`group flex flex-col gap-1 rounded-xl border border-maroon/10 p-4 transition-colors hover:border-orange/40 hover:bg-blush/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange ${
        isNext ? "sm:items-end sm:text-right" : ""
      }`}
    >
      <span className="font-sans text-[0.7rem] uppercase tracking-[0.2em] text-cocoa/50">
        {isNext ? "Next programme" : "Previous programme"}
      </span>
      <span className="flex items-center gap-2 font-serif text-[1.1rem] text-maroon group-hover:text-orange">
        {!isNext && (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="rotate-180">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        )}
        {item.title}
        {isNext && (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        )}
      </span>
    </Link>
  );
}

/**
 * Detail page for one programme, generated from `programs` in site.ts.
 *
 * The head sits on ivory (not the dark maroon band the org/ashram pages use)
 * because the brief's two-tone rule needs maroon on a light ground to stay
 * legible; the hero image follows as its own full-width band.
 */
export default function ProgramDetailView({
  item,
  prev,
  next,
}: {
  item: ProgramItem;
  prev: ProgramItem;
  next: ProgramItem;
}) {
  const sections = item.sections;
  // Memoised so the scroll-spy effect doesn't re-subscribe on every render.
  const ids = useMemo(() => sections.map((s) => s.id), [sections]);
  const active = useActiveSection(ids);
  const shared = useMemo(() => sections.map(toSharedSection), [sections]);
  const { lead, accent } = splitTitle(item.title);

  return (
    <article className="bg-ivory">
      {/* head */}
      <header className="relative overflow-hidden bg-ivory">
        <LotusBloom
          className="pointer-events-none absolute -right-16 -top-12 h-72 w-72 opacity-[0.06]"
          fill="var(--color-maroon)"
        />
        <div className="container-site relative pb-10 pt-28 md:pb-12 md:pt-32">
          <nav aria-label="Breadcrumb" className="mb-5 font-sans text-sm text-cocoa/60">
            <Link href="/" className="hover:text-orange">Home</Link>
            <span className="mx-2 text-cocoa/30">/</span>
            <Link href="/#mission" className="hover:text-orange">Our Work</Link>
            <span className="mx-2 text-cocoa/30">/</span>
            <span className="text-maroon">{item.title}</span>
          </nav>

          <SectionHeading as="h1" lead={lead} accent={accent} />

          {item.subtitle && (
            <p className="mt-4 font-sans text-[0.72rem] uppercase tracking-[0.2em] text-cocoa/55 md:text-[0.78rem]">
              {item.subtitle}
            </p>
          )}

          <SplitText
            tag="p"
            text={item.summary}
            splitType="lines"
            delay={40}
            duration={0.8}
            from={{ opacity: 0, y: 24 }}
            to={{ opacity: 1, y: 0 }}
            className={`mt-5 ${MEASURE} ${PROSE}`}
          />
        </div>
      </header>

      {/* hero image band */}
      {item.hero && (
        // max-h caps the band on wide screens — a bare 21:9 at 1440px is
        // ~620px tall and pushes the reading column off the first screen.
        <div className="relative aspect-video max-h-75 w-full overflow-hidden bg-maroon/10 md:aspect-21/9 md:max-h-105">
          <Image
            src={item.hero}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      {/* mobile anchor bar — outside the grid so it can stick down the page */}
      <SectionNav sections={shared} active={active} variant="bar" />

      <div className="container-site grid grid-cols-1 gap-y-10 py-12 md:py-14 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-14">
        <SectionNav sections={shared} active={active} variant="rail" />

        {/* min-w-0 lets the 1fr track shrink so the wide auto-scroll gallery
            clips instead of blowing out the layout. */}
        <div className="min-w-0 max-w-208 space-y-9 md:space-y-11">
          {shared.map((s) => (
            <SectionBlock key={s.id} section={s} />
          ))}

          <div className="border-t border-maroon/10 pt-7">
            <Link
              href="/#mission"
              className="inline-flex items-center gap-2 font-sans text-sm font-medium text-orange hover:text-maroon"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="rotate-180">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
              Back to all programmes
            </Link>

            <nav
              aria-label="More programmes"
              className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              <ProgramLink item={prev} dir="prev" />
              <ProgramLink item={next} dir="next" />
            </nav>
          </div>
        </div>
      </div>
    </article>
  );
}
