"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  SectionBlock,
  SectionNav,
  useActiveSection,
} from "@/components/detail/DetailSections";
import { LotusBloom } from "@/components/brand/LotusDecor";
import type { OrgItem } from "@/data/site";

/**
 * Shared detail-page layout for every Organization card.
 *
 * Reading layout (see DetailSections for the type tokens): a ~70ch measure at
 * 16/17px · 1.6, tight heading→paragraph rhythm, and hairline dividers between
 * sections so a long page stays navigable instead of running airy and empty.
 * Desktop gets a sticky side rail; mobile gets a sticky top anchor bar and the
 * full column width for the copy.
 */
export default function DetailPageView({ item }: { item: OrgItem }) {
  // Memoised so the scroll-spy effect doesn't re-subscribe on every render.
  const ids = useMemo(() => item.sections.map((s) => s.id), [item.sections]);
  const active = useActiveSection(ids);

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
        <div className="container-site relative py-16 pt-28 md:py-20 md:pt-32">
          <nav aria-label="Breadcrumb" className="mb-4 font-sans text-sm text-ivory/70">
            <Link href="/" className="hover:text-orange">Home</Link>
            <span className="mx-2 text-ivory/40">/</span>
            <Link href="/organization" className="hover:text-orange">Organization</Link>
            <span className="mx-2 text-ivory/40">/</span>
            <span className="text-ivory">{item.title}</span>
          </nav>
          <p className="font-script text-3xl text-orange">{item.eyebrow}</p>
          <h1 className="mt-1.5 max-w-3xl font-serif text-[clamp(2.1rem,5vw,3.4rem)] font-medium leading-[1.08] tracking-tight">
            {item.title}
          </h1>
          <p className="mt-4 max-w-[62ch] font-sans text-[1rem] leading-[1.6] text-ivory/80 md:text-[1.0625rem]">
            {item.subtitle}
          </p>
        </div>
      </header>

      {/* mobile anchor bar — outside the grid so it can stick down the page */}
      <SectionNav sections={item.sections} active={active} variant="bar" />

      {/* body — sticky rail + content. grid-cols-1 (minmax(0,1fr)) on mobile
          stops the wide auto-scroll gallery from expanding the column and
          causing horizontal overflow. */}
      <div className="container-site grid grid-cols-1 gap-y-10 py-12 md:py-14 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-14">
        <SectionNav sections={item.sections} active={active} variant="rail" />

        {/* min-w-0 lets the 1fr track shrink so the wide auto-scroll gallery
            clips instead of blowing out the layout. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-0 max-w-208 space-y-9 md:space-y-11"
        >
          {item.sections.map((s) => (
            <SectionBlock key={s.id} section={s} />
          ))}

          <div className="border-t border-maroon/10 pt-7">
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
