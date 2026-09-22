"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { OverviewCard } from "@/components/sections/CardSection";
import { ashramBySlug } from "@/data/site";
import type { ContactModule } from "@/data/modules";

const bgClass = {
  ivory: "bg-ivory",
  cream: "bg-cream texture-paper",
  blush: "bg-blush",
} as const;

/** Homepage §14 — Contact: the central address plus cards (Ashrams, Register). */
export default function ContactSection({ module }: { module: ContactModule }) {
  const a = module.address;
  // Derived from the ashram data so this link can never drift out of sync with
  // the Sakha section (§7) or the /ashrams/[slug] pages (§8).
  const detail = a.ashramSlug ? ashramBySlug[a.ashramSlug] : undefined;
  const href = detail ? `/ashrams/${detail.slug}` : undefined;

  return (
    <section
      id={module.id}
      className={`relative scroll-mt-24 py-24 md:py-32 ${bgClass[module.bg ?? "ivory"]}`}
    >
      <div className="container-site">
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 font-script text-3xl text-orange">{module.eyebrow}</p>
          <SectionHeading lead={module.heading.lead} accent={module.heading.accent} />
          {module.intro && (
            <p className="mt-5 font-sans text-sm leading-relaxed text-cocoa/70">
              {module.intro}
            </p>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* central address + map — the whole card is a link to the ashram's
              detail page (§5). The `after:` overlay makes the entire card the
              hit area while the phone/email stay individually clickable. */}
          <Reveal>
            <motion.div
              whileHover={href ? { y: -6 } : undefined}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-warm-sm transition-shadow duration-500 hover:shadow-warm has-[a:focus-visible]:outline has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-orange">
              {/* Live map. `z-10` lifts it above the stretched card link's
                  `after:` overlay — the same trick the address block below
                  uses — so the map can be panned and zoomed while the rest of
                  the card still opens the ashram page. An explicit
                  `rounded-t-2xl` is needed here because an iframe is not
                  reliably clipped by an ancestor's radius. */}
              <div className="relative z-10 h-56 overflow-hidden rounded-t-2xl md:h-64">
                <iframe
                  src={module.map.embedUrl}
                  title={module.map.title}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>

              <div className="flex flex-1 flex-col p-7">
                <p className="font-sans text-xs uppercase tracking-[0.25em] text-orange">
                  {a.role ?? "Central Address"}
                </p>
                <h3 className="mt-2 font-serif text-2xl text-maroon">
                  {href ? (
                    <Link
                      href={href}
                      aria-label={`${a.name} — view ashram details`}
                      className="after:absolute after:inset-0 after:z-0 after:content-[''] focus-visible:outline-none"
                    >
                      {a.name}
                    </Link>
                  ) : (
                    a.name
                  )}
                </h3>
                {/* break-words: emails are single unbreakable tokens */}
                <address className="relative z-10 mt-4 space-y-2 wrap-break-word font-sans text-sm not-italic text-cocoa/80">
                  <p>{a.address}</p>
                  {a.phone && (
                    <p>
                      <span className="text-cocoa/50">Phone: </span>
                      <a href={`tel:${a.phone.replace(/\s+/g, "")}`} className="hover:text-orange">
                        {a.phone}
                      </a>
                    </p>
                  )}
                  {a.email && (
                    <p>
                      <span className="text-cocoa/50">Email: </span>
                      <a href={`mailto:${a.email}`} className="hover:text-orange">
                        {a.email}
                      </a>
                    </p>
                  )}
                </address>

                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
                  {href && (
                    <span className="inline-flex items-center gap-2 font-sans text-sm font-medium text-orange">
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
                  )}
                  {/* `relative z-10` again — this one is a real link and has to
                      sit above the stretched card link to be clickable. */}
                  <a
                    href={module.map.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 inline-flex items-center gap-2 rounded font-sans text-sm font-medium text-orange hover:text-maroon focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-orange"
                  >
                    {module.map.linkLabel}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </Reveal>

          {/* the two cards: Ashrams + Name registration form */}
          <div className="grid gap-6 sm:grid-cols-2">
            {module.cards.map((card, i) => (
              <Reveal key={card.id} i={i}>
                <OverviewCard card={card} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
