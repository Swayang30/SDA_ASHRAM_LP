"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MarqueeReel from "@/components/ui/MarqueeReel";
import { LotusBloom } from "@/components/brand/LotusDecor";
import type { OrgItem, OrgSection } from "@/data/site";

/** Renders one content section by `type` (text / list / timeline / gallery). */
function SectionBlock({ section }: { section: OrgSection }) {
  return (
    <section id={section.id} className="scroll-mt-28 border-t border-maroon/10 pt-10">
      <h2 className="font-serif text-[clamp(1.6rem,3.2vw,2.4rem)] font-medium text-maroon">
        {section.heading}
      </h2>

      {section.body?.map((p, i) => (
        <p
          key={i}
          className="mt-4 max-w-2xl font-sans text-base leading-[1.9] text-cocoa/80"
        >
          {p}
        </p>
      ))}

      {section.type === "list" && section.list && (
        <ul className="mt-5 max-w-2xl space-y-3">
          {section.list.map((item, i) => (
            <li key={i} className="flex items-start gap-3 font-sans text-base text-cocoa/80">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      )}

      {section.type === "timeline" && section.timeline && (
        <ol className="mt-7 max-w-2xl space-y-0">
          {section.timeline.map((t, i) => (
            <li key={i} className="relative flex gap-6 pb-8 last:pb-0">
              <div className="relative flex flex-col items-center">
                <span className="mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-orange bg-ivory" />
                {i < section.timeline!.length - 1 && (
                  <span className="w-px flex-1 bg-maroon/15" aria-hidden />
                )}
              </div>
              <div className="-mt-0.5">
                <span className="font-script text-2xl text-orange">{t.year}</span>
                <h3 className="mt-1 font-serif text-lg text-maroon">{t.title}</h3>
                {t.text && (
                  <p className="mt-1 font-sans text-sm leading-relaxed text-cocoa/70">
                    {t.text}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}

      {section.type === "gallery" && section.gallery && (
        <div className="mt-8">
          <MarqueeReel
            items={section.gallery}
            speed={0.45}
            tileClassName="w-44 md:w-52"
            aspect="aspect-[4/5]"
          />
        </div>
      )}
    </section>
  );
}

/**
 * Shared detail-page layout for every Organization card.
 * A sticky left side-menu (anchor nav) lists the sub-sections, with the content
 * scrolling on the right; the active item highlights on scroll (scroll-spy).
 * On mobile the menu collapses to a horizontal chip row.
 */
export default function DetailPageView({ item }: { item: OrgItem }) {
  const [active, setActive] = useState(item.sections[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    item.sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [item.sections]);

  return (
    <article className="bg-ivory">
      {/* hero band */}
      <header className="relative overflow-hidden bg-maroon text-ivory">
        <div className="absolute inset-0 opacity-30">
          <Image src={item.hero} alt="" fill sizes="100vw" className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-maroon via-maroon/70 to-maroon/40" />
        <LotusBloom
          className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 opacity-10"
          fill="var(--color-gold)"
        />
        <div className="container-site relative py-24 pt-32 md:py-28 md:pt-36">
          <nav aria-label="Breadcrumb" className="mb-5 font-sans text-sm text-ivory/70">
            <Link href="/" className="hover:text-orange">Home</Link>
            <span className="mx-2 text-ivory/40">/</span>
            <Link href="/organization" className="hover:text-orange">Organization</Link>
            <span className="mx-2 text-ivory/40">/</span>
            <span className="text-ivory">{item.title}</span>
          </nav>
          <p className="font-script text-3xl text-orange">{item.eyebrow}</p>
          <h1 className="mt-2 max-w-3xl font-serif text-[clamp(2.4rem,6vw,4rem)] font-medium leading-[1.05] tracking-tight">
            {item.title}
          </h1>
          <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-ivory/80">
            {item.subtitle}
          </p>
        </div>
      </header>

      {/* body — sticky side menu + content. grid-cols-1 (minmax(0,1fr)) on
          mobile stops the wide auto-scroll gallery from expanding the column
          and causing horizontal overflow. */}
      <div className="container-site grid grid-cols-1 gap-10 py-16 md:py-20 lg:grid-cols-[240px_1fr] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-4 font-sans text-xs uppercase tracking-[0.25em] text-cocoa/50">
            On this page
          </p>
          <nav aria-label="Section navigation">
            <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
              {item.sections.map((s) => {
                const isActive = active === s.id;
                return (
                  <li key={s.id} className="shrink-0">
                    <a
                      href={`#${s.id}`}
                      aria-current={isActive ? "true" : undefined}
                      className={`block whitespace-nowrap rounded-full px-4 py-2 font-sans text-sm transition-colors lg:rounded-lg lg:border-l-2 lg:px-3 ${
                        isActive
                          ? "bg-orange/10 text-maroon lg:border-orange lg:bg-transparent lg:font-medium"
                          : "text-cocoa/60 hover:text-maroon lg:border-transparent"
                      }`}
                    >
                      {s.heading}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* min-w-0 lets the 1fr track shrink so the wide auto-scroll gallery
            clips instead of blowing out the layout. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-0 space-y-12"
        >
          {item.sections.map((s) => (
            <SectionBlock key={s.id} section={s} />
          ))}

          <div className="border-t border-maroon/10 pt-10">
            <Link
              href="/organization"
              className="inline-flex items-center gap-2 font-sans text-sm font-medium text-orange hover:text-maroon"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="rotate-180">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
              Back to Organization Overview
            </Link>
          </div>
        </motion.div>
      </div>
    </article>
  );
}
