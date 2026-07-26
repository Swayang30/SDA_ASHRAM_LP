"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { OverviewCard } from "@/components/sections/CardSection";
import type { ContactModule } from "@/data/modules";

const bgClass = {
  ivory: "bg-ivory",
  cream: "bg-cream texture-paper",
  blush: "bg-blush",
} as const;

/** Homepage §14 — Contact: the central address plus cards (Ashrams, Register). */
export default function ContactSection({ module }: { module: ContactModule }) {
  const a = module.address;
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
          {/* central address + map */}
          <Reveal>
            <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-warm-sm">
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
                <h3 className="mt-2 font-serif text-2xl text-maroon">{a.name}</h3>
                <address className="mt-4 space-y-2 font-sans text-sm not-italic text-cocoa/80">
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
              </div>
            </div>
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
