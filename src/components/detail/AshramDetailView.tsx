"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  MEASURE,
  PROSE,
  SectionBlock,
  SectionNav,
  useActiveSection,
} from "@/components/detail/DetailSections";
import MarqueeReel from "@/components/ui/MarqueeReel";
import { LotusBloom } from "@/components/brand/LotusDecor";
import type { AshramItem } from "@/data/site";

function KeyFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l-2 border-orange/40 pl-4">
      <dt className="font-sans text-[0.7rem] uppercase tracking-[0.2em] text-cocoa/50">
        {label}
      </dt>
      <dd className="mt-1 font-serif text-[1.15rem] leading-snug text-maroon">
        {value}
      </dd>
    </div>
  );
}

/**
 * Detail page for one ashram, generated from `ashrams[]` in site.ts.
 * Reuses the shared detail typography (DetailSections) so it reads exactly
 * like the Organization pages. Long-form copy can be added later by filling
 * in the item's optional `sections` — the nav and layout pick it up for free.
 */
export default function AshramDetailView({ item }: { item: AshramItem }) {
  // Memoised: `?? []` would otherwise mint a new array every render and make
  // the scroll-spy effect re-subscribe on each one.
  const sections = useMemo(() => item.sections ?? [], [item.sections]);
  const ids = useMemo(() => sections.map((s) => s.id), [sections]);
  const active = useActiveSection(ids);

  const facts = [
    { label: "Established", value: item.establishedYear },
    { label: "Location", value: item.location },
    { label: "Phone", value: item.phone },
    { label: "Resident sadhus", value: String(item.residentSadhus) },
    { label: "Head sadhu", value: item.headSadhu },
    ...(item.facts ?? []),
  ];

  const galleryTiles = item.gallery.map((img, i) => ({
    id: `${item.slug}-${i}`,
    label: `${item.name} — photograph ${i + 1}`,
    img,
  }));

  return (
    <article className="bg-ivory">
      {/* hero band */}
      <header className="relative overflow-hidden bg-maroon text-ivory">
        {item.hero && (
          <div className="absolute inset-0 opacity-30">
            <Image src={item.hero} alt="" fill sizes="100vw" className="object-cover" priority />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-maroon via-maroon/70 to-maroon/40" />
        <LotusBloom
          className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 opacity-10"
          fill="var(--color-gold)"
        />
        <div className="container-site relative py-16 pt-28 md:py-20 md:pt-32">
          <nav aria-label="Breadcrumb" className="mb-4 font-sans text-sm text-ivory/70">
            <Link href="/" className="hover:text-orange">Home</Link>
            <span className="mx-2 text-ivory/40">/</span>
            <Link href="/#sakha-ashrams" className="hover:text-orange">Sakha Ashrams</Link>
            <span className="mx-2 text-ivory/40">/</span>
            <span className="text-ivory">{item.name}</span>
          </nav>
          <p className="font-script text-3xl text-orange">{item.role}</p>
          <h1 className="mt-1.5 max-w-3xl font-serif text-[clamp(2.1rem,5vw,3.4rem)] font-medium leading-[1.08] tracking-tight">
            {item.name}
          </h1>
          {item.blurb && (
            <p className="mt-4 max-w-[62ch] font-sans text-[1rem] leading-[1.6] text-ivory/80 md:text-[1.0625rem]">
              {item.blurb}
            </p>
          )}
        </div>
      </header>

      {sections.length > 0 && (
        <SectionNav sections={sections} active={active} variant="bar" />
      )}

      <div className="container-site py-12 md:py-14">
        {/* key facts */}
        <motion.section
          aria-labelledby="key-facts"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            id="key-facts"
            className="font-sans text-xs uppercase tracking-[0.25em] text-cocoa/50"
          >
            Key facts
          </h2>
          <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {facts.map((f) => (
              <KeyFact key={f.label} label={f.label} value={f.value} />
            ))}
          </dl>

          {/* `break-words` + one line each matters: an email address is a
              single unbreakable token, and at 390px a long one overflows. */}
          {(item.address || item.email) && (
            <address className={`mt-8 ${MEASURE} ${PROSE} space-y-1 wrap-break-word not-italic`}>
              {item.address && <p>{item.address}</p>}
              <p>
                <a
                  href={`tel:${item.phone.replace(/\s+/g, "")}`}
                  className="hover:text-orange"
                >
                  {item.phone}
                </a>
              </p>
              {item.email && (
                <p>
                  <a href={`mailto:${item.email}`} className="hover:text-orange">
                    {item.email}
                  </a>
                </p>
              )}
            </address>
          )}
        </motion.section>

        {/* gallery */}
        <section aria-labelledby="ashram-gallery" className="mt-12 md:mt-14">
          <h2
            id="ashram-gallery"
            className="mb-5 font-sans text-xs uppercase tracking-[0.25em] text-cocoa/50"
          >
            Gallery
          </h2>
          {/* min-w-0 wrapper keeps the wide strip from blowing out the column */}
          <div className="min-w-0">
            <MarqueeReel
              items={galleryTiles}
              speed={0.45}
              tileClassName="w-44 md:w-56"
              aspect="aspect-[4/5]"
              sizes="(max-width: 768px) 45vw, 224px"
            />
          </div>
        </section>

        {/* long-form content — empty for now, clearly marked for the client */}
        {sections.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-y-10 md:mt-14 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-14">
            <SectionNav sections={sections} active={active} variant="rail" />
            <div className="min-w-0 max-w-208 space-y-9 md:space-y-11">
              {sections.map((s) => (
                <SectionBlock key={s.id} section={s} />
              ))}
            </div>
          </div>
        ) : (
          <section className="mt-12 border-t border-maroon/10 pt-8 md:mt-14">
            <h2 className="font-serif text-[1.45rem] font-medium text-maroon md:text-[1.75rem]">
              More about this ashram
            </h2>
            <p className={`mt-3 ${MEASURE} ${PROSE}`}>
              {/* TODO: add this ashram's story, daily schedule, festivals,
                  seva activities and visiting information. Populate the
                  optional `sections` array on this ashram in `src/data/site.ts`
                  and it renders here with the shared detail typography. */}
              Content for this ashram is being prepared — its history, daily
              schedule, festivals, seva activities and visiting information will
              appear here.{" "}
              <span className="text-cocoa/50">(TODO: client content)</span>
            </p>
          </section>
        )}

        <div className="mt-12 border-t border-maroon/10 pt-7">
          <Link
            href="/#sakha-ashrams"
            className="inline-flex items-center gap-2 font-sans text-sm font-medium text-orange hover:text-maroon"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="rotate-180">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
            Back to all ashrams
          </Link>
        </div>
      </div>
    </article>
  );
}
