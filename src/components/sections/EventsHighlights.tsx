"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Carousel from "@/components/ui/Carousel";
import Reveal from "@/components/ui/Reveal";
import { events, type EventItem } from "@/data/site";

function EventCard({ event }: { event: EventItem }) {
  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group h-full overflow-hidden rounded-2xl bg-white shadow-warm-sm transition-shadow duration-500 hover:shadow-warm"
    >
      <div className="relative aspect-9/11 overflow-hidden">
        <Image
          src={event.img}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 80vw, 320px"
          className="object-cover transition-transform duration-700 ease-soft group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-maroon/55 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 font-script text-2xl text-white drop-shadow">
          {event.script}
        </span>
      </div>
      <div className="p-6">
        <h3 className="font-serif text-2xl text-maroon">{event.title}</h3>
        <p className="mt-2 font-sans text-sm text-cocoa/70">{event.place}</p>
        <div className="mt-4 flex items-center gap-2 font-sans text-sm">
          <span className="font-medium text-orange">{event.date}</span>
        </div>
        <p className="mt-1 font-sans text-xs text-cocoa/60">{event.time}</p>
      </div>
    </motion.article>
  );
}

export default function EventsHighlights() {
  return (
    <section
      id="events"
      className="texture-paper relative bg-cream py-24 md:py-32"
    >
      <div className="container-site">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 font-script text-3xl text-orange">Upcoming</p>
            <SectionHeading lead="Events" accent="& Highlights" />
          </div>
          <Reveal className="max-w-sm">
            <p className="font-sans text-sm leading-relaxed text-cocoa/70">
              Gather with the sangha through the year — darshan, festivals, and
              sacred observances at the ashram.
            </p>
          </Reveal>
        </div>

        <Carousel
          ariaLabel="Events and highlights"
          slideClassName="min-w-0 flex-[0_0_82%] sm:flex-[0_0_46%] lg:flex-[0_0_30%]"
          slides={events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        />
      </div>
    </section>
  );
}
