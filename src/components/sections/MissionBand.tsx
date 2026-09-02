"use client";

import MarqueeReel from "@/components/ui/MarqueeReel";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { missionBand, programs } from "@/data/site";

/**
 * "Our mission in motion" — a standalone full-width motion band directly under
 * the hero slider. Deliberately NOT a boxed card section: it runs edge to edge
 * and flows out of the page background so the marquee reads as one continuous
 * movement rather than a widget. Content comes from `site.ts`.
 */
export default function MissionBand() {
  return (
    <section
      id="mission"
      aria-labelledby="mission-heading"
      className="relative w-full scroll-mt-24 overflow-hidden bg-ivory py-20 md:py-28 lg:py-32"
    >
      {/* soft warm wash so the band separates from the hero without a hard edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-blush/70 to-transparent"
      />

      <div className="container-site relative mb-10 md:mb-14">
        <Reveal>
          <p className="mb-3 font-script text-3xl text-orange md:text-4xl">
            {missionBand.eyebrow}
          </p>
          <div id="mission-heading">
            <SectionHeading
              lead={missionBand.heading.lead}
              accent={missionBand.heading.accent}
            />
          </div>
          <p className="mt-5 max-w-xl font-sans text-[0.95rem] leading-relaxed text-cocoa/70">
            {missionBand.intro}
          </p>
        </Reveal>
      </div>

      {/* Full-bleed strip of programme cards. Each card is a whole-card link to
          its /programs/[slug] page; the marquee still auto-scrolls, pauses on
          hover, and drags/swipes (a drag never triggers the link). */}
      <MarqueeReel
        items={programs.map((p) => ({
          id: p.slug,
          label: p.title,
          subtitle: p.subtitle,
          img: p.thumbnail,
          href: `/programs/${p.slug}`,
          ariaLabel: p.subtitle ? `${p.title} — ${p.subtitle}` : p.title,
        }))}
        speed={0.5}
        caption="below"
        ariaLabel="Our programmes (drag to browse)"
        tileClassName="w-56 sm:w-64 md:w-72 lg:w-80"
        aspect="aspect-[3/4]"
        rounded="rounded-3xl"
        sizes="(max-width: 640px) 60vw, (max-width: 1024px) 288px, 320px"
        fadeEdges={false}
      />
    </section>
  );
}
