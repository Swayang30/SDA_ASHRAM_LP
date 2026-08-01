"use client";

import Image from "next/image";
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
              <div className="relative h-56 overflow-hidden md:h-64">
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 1.15 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 6, ease: "easeOut" }}
                >
                  <Image
                    src={module.mapImage}
                    alt={`Map showing ${a.name}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 700px"
                    className="object-cover"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-maroon/5" />
                {/* pin */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="var(--color-orange)" aria-hidden className="drop-shadow-lg">
                    <path d="M12 2C7.6 2 4 5.6 4 10c0 5.4 7 11.5 7.3 11.7.4.3 1 .3 1.4 0C13 21.5 20 15.4 20 10c0-4.4-3.6-8-8-8Z" stroke="white" strokeWidth="1" />
                    <circle cx="12" cy="10" r="3" fill="white" />
                  </svg>
                </div>
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

                {href && (
                  <span className="mt-5 inline-flex items-center gap-2 font-sans text-sm font-medium text-orange">
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
