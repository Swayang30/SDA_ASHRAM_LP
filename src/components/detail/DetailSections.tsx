"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import MarqueeReel from "@/components/ui/MarqueeReel";
import type { OrgBlock, OrgMedia, OrgSection } from "@/data/site";

/* ------------------------------------------------------------------ *
 *  Reading typography — one place, shared by every detail page.
 *
 *  The pages previously ran at ~1rem/1.9 with big gaps, which read airy and
 *  empty and made any real amount of copy scroll forever. These tokens hold
 *  more content comfortably: 16px mobile / 17px desktop at 1.6 line-height,
 *  on a ~70ch measure (the classic comfortable range), with a tight
 *  heading→paragraph relationship and generous space only BETWEEN sections.
 * ------------------------------------------------------------------ */

/** Body copy: 16px mobile → 17px desktop, line-height 1.6. */
export const PROSE =
  "font-sans text-[1rem] leading-[1.6] text-cocoa/80 md:text-[1.0625rem]";
/** Comfortable reading measure. */
export const MEASURE = "max-w-[70ch]";

function Paragraphs({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <>
      {items.map((p, i) => (
        <p key={i} className={`${PROSE} ${MEASURE} ${i === 0 ? "" : "mt-4"} ${className}`}>
          {p}
        </p>
      ))}
    </>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className={`mt-4 space-y-2.5 ${MEASURE}`}>
      {items.map((item, i) => (
        <li key={i} className={`flex items-start gap-3 ${PROSE}`}>
          <span
            className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-orange"
            aria-hidden
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Stats({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
      {items.map((s, i) => (
        <div key={i} className="border-l-2 border-orange/40 pl-4">
          <dt className="sr-only">{s.label}</dt>
          <dd>
            <span className="block font-serif text-[1.8rem] leading-none text-maroon md:text-[2.1rem]">
              {s.value}
            </span>
            <span
              className="mt-2 block font-sans text-[0.7rem] uppercase leading-snug tracking-[0.18em] text-cocoa/55"
              aria-hidden
            >
              {s.label}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Block({ block }: { block: OrgBlock }) {
  return (
    <div className="mt-8 first:mt-6">
      {block.subheading && (
        <h3 className="font-serif text-[1.15rem] font-medium text-maroon md:text-[1.25rem]">
          {block.subheading}
        </h3>
      )}
      {block.body && <div className={block.subheading ? "mt-2" : ""}><Paragraphs items={block.body} /></div>}
      {block.list && <Bullets items={block.list} />}
    </div>
  );
}

function MediaRow({ media }: { media: OrgMedia }) {
  const imageRight = media.side !== "left";
  return (
    <figure
      className={`mt-8 grid grid-cols-1 items-start gap-5 md:grid-cols-2 md:gap-7 ${
        imageRight ? "" : "md:[&>*:first-child]:order-2"
      }`}
    >
      <div className="min-w-0">
        {media.body && <Paragraphs items={media.body} className="max-w-none" />}
        {media.caption && (
          <figcaption className="mt-3 font-sans text-[0.8rem] leading-relaxed text-cocoa/55">
            {media.caption}
          </figcaption>
        )}
      </div>
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-maroon/10">
        <Image
          src={media.img}
          alt={media.alt}
          fill
          sizes="(max-width: 768px) 100vw, 420px"
          className="object-cover"
        />
      </div>
    </figure>
  );
}

/** Renders one content section by `type`, plus any blocks / media rows. */
export function SectionBlock({ section }: { section: OrgSection }) {
  return (
    <section
      id={section.id}
      className="scroll-mt-32 border-t border-maroon/10 pt-7 first:border-t-0 first:pt-0 md:pt-9"
    >
      <h2 className="font-serif text-[1.45rem] font-medium leading-tight text-maroon md:text-[1.75rem]">
        {section.heading}
      </h2>

      {section.lead && (
        <p
          className={`mt-2.5 ${MEASURE} font-sans text-[1.05rem] leading-[1.55] text-cocoa/65 md:text-[1.15rem]`}
        >
          {section.lead}
        </p>
      )}

      {section.body && (
        <div className="mt-3">
          <Paragraphs items={section.body} />
        </div>
      )}

      {/* Rendered on presence, not on `type`, so a section can pair prose with
          bullets (or a gallery) without having to pick just one shape. */}
      {section.list && section.list.length > 0 && <Bullets items={section.list} />}

      {section.stats && section.stats.length > 0 && <Stats items={section.stats} />}

      {section.type === "timeline" && section.timeline && (
        <ol className={`mt-6 ${MEASURE}`}>
          {section.timeline.map((t, i) => (
            <li key={i} className="relative flex gap-5 pb-6 last:pb-0">
              <div className="relative flex flex-col items-center">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-orange bg-ivory" />
                {i < section.timeline!.length - 1 && (
                  <span className="w-px flex-1 bg-maroon/15" aria-hidden />
                )}
              </div>
              <div>
                <span className="font-script text-xl text-orange">{t.year}</span>
                <h3 className="mt-0.5 font-serif text-[1.05rem] text-maroon md:text-[1.15rem]">
                  {t.title}
                </h3>
                {t.text && (
                  <p className={`mt-1 ${PROSE} text-[0.95rem] md:text-[1rem]`}>{t.text}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}

      {section.blocks?.map((b, i) => <Block key={i} block={b} />)}
      {section.media?.map((m, i) => <MediaRow key={i} media={m} />)}

      {section.gallery && section.gallery.length > 0 && (
        <div className="mt-7">
          <MarqueeReel
            items={section.gallery}
            speed={0.45}
            tileClassName="w-40 md:w-48"
            aspect="aspect-[4/5]"
            sizes="(max-width: 768px) 40vw, 192px"
          />
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ *
 *  Section navigation
 * ------------------------------------------------------------------ */

/** Scroll-spy: which section id is currently in the reading zone. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");

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
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

/**
 * The same anchor list in two shapes:
 *  - `bar`  (mobile) — a sticky, horizontally-scrollable chip bar that parks
 *    under the navbar while you read, leaving the content column full width.
 *  - `rail` (desktop) — the sticky side menu beside the content.
 *
 * They are rendered as two elements rather than one responsive element on
 * purpose: a sticky element can only travel within its own grid area, so the
 * mobile bar has to live OUTSIDE the content grid to stick down the page.
 * Whichever variant is inactive is `display:none`, so it leaves the
 * accessibility tree entirely — no duplicate nav for screen readers.
 */
export function SectionNav({
  sections,
  active,
  variant,
}: {
  sections: { id: string; heading: string }[];
  active: string;
  variant: "bar" | "rail";
}) {
  const bar = variant === "bar";

  return (
    <div
      className={
        bar
          ? "sticky top-19 z-30 border-y border-maroon/10 bg-ivory/92 backdrop-blur-md lg:hidden"
          : "hidden lg:sticky lg:top-28 lg:block lg:self-start"
      }
    >
      {!bar && (
        <p className="mb-3 font-sans text-xs uppercase tracking-[0.25em] text-cocoa/50">
          On this page
        </p>
      )}
      <nav aria-label="Section navigation" className={bar ? "container-site" : ""}>
        <ul
          className={
            bar
              ? "no-scrollbar flex gap-2 overflow-x-auto py-2.5"
              : "flex flex-col gap-0.5"
          }
        >
          {sections.map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id} className={bar ? "shrink-0" : "w-full"}>
                <a
                  href={`#${s.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={
                    bar
                      ? `block whitespace-nowrap rounded-full px-3.5 py-1.5 font-sans text-[0.82rem] transition-colors ${
                          isActive
                            ? "bg-orange/15 font-medium text-maroon"
                            : "text-cocoa/60 hover:text-maroon"
                        }`
                      : `block border-l-2 py-1.5 pl-3 pr-2 font-sans text-[0.85rem] leading-snug transition-colors ${
                          isActive
                            ? "border-orange font-medium text-maroon"
                            : "border-maroon/10 text-cocoa/60 hover:border-maroon/30 hover:text-maroon"
                        }`
                  }
                >
                  {s.heading}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
