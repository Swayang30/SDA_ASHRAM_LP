"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import type { CardsModule, CardLink } from "@/data/modules";

const bgClass = {
  ivory: "bg-ivory",
  cream: "bg-cream texture-paper",
  blush: "bg-blush",
} as const;

/** One overview card — image + title + blurb, links to a detail page. */
export function OverviewCard({ card }: { card: CardLink }) {
  const external = card.href === "#";
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="h-full"
    >
      <Link
        href={card.href}
        aria-disabled={external}
        className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-warm-sm transition-shadow duration-500 hover:shadow-warm focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-orange"
      >
        <div className="relative aspect-9/11 overflow-hidden">
          <Image
            src={card.img}
            alt={card.title}
            fill
            sizes="(max-width: 768px) 80vw, 360px"
            className="object-cover transition-transform duration-700 ease-soft group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-maroon/60 via-transparent to-transparent" />
          {card.script && (
            <span className="absolute left-4 top-4 font-script text-2xl text-white drop-shadow">
              {card.script}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-serif text-2xl text-maroon">{card.title}</h3>
          <p className="mt-2 flex-1 font-sans text-sm leading-relaxed text-cocoa/70">
            {card.blurb}
          </p>
          <span className="mt-5 inline-flex items-center gap-2 font-sans text-sm font-medium text-orange">
            Explore
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
      </Link>
    </motion.div>
  );
}

/** Generic "cards linking to detail pages" section — the event-page pattern. */
export default function CardSection({ module }: { module: CardsModule }) {
  return (
    <section
      id={module.id}
      className={`relative scroll-mt-24 py-24 md:py-32 ${bgClass[module.bg ?? "ivory"]}`}
    >
      <div className="container-site">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 font-script text-3xl text-orange">{module.eyebrow}</p>
            <SectionHeading lead={module.heading.lead} accent={module.heading.accent} />
          </div>
          {module.intro && (
            <Reveal className="max-w-sm">
              <p className="font-sans text-sm leading-relaxed text-cocoa/70">
                {module.intro}
              </p>
            </Reveal>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {module.cards.map((card, i) => (
            <Reveal key={card.id} i={i}>
              <OverviewCard card={card} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
