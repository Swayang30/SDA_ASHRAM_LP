import SectionHeading from "@/components/ui/SectionHeading";
import { LotusBloom } from "@/components/brand/LotusDecor";
import EventsPastRail from "@/components/events/EventsPastRail";
import EventsPresent from "@/components/events/EventsPresent";
import EventsCalendar from "@/components/events/EventsCalendar";
import { eventsContent, eventsUi } from "@/data/site";
import type { EventsModule } from "@/data/modules";
import { todayISO, validateEventsContent } from "@/lib/events";

/**
 * "Events" — three blocks on a deep-maroon ground:
 *   1. header (script eyebrow, h2, gold hairline)   ┐ pinned together on
 *   2. past-events rail (stepped, snapping)          ┘ desktop
 *   3. present event + month calendar — normal flow, reveals on enter
 *
 * Content: `eventsContent` / `eventsUi` in src/data/site.ts.
 * Position: `kind: "events"` in src/data/modules.ts.
 */
export default function EventsSection({ module }: { module: EventsModule }) {
  // Development-only: unknown ashram slugs / malformed dates are logged,
  // never thrown, so the page still renders.
  validateEventsContent(eventsContent);

  // The page is prerendered; the client components correct this to the
  // visitor's real date after hydration (see src/lib/useToday.ts).
  const serverToday = todayISO();
  const headingId = `${module.id}-heading`;

  const header = (
    <div className="container-site relative">
      <div className="pin-desktop:flex pin-desktop:items-end pin-desktop:justify-between pin-desktop:gap-10">
        <div>
          <p className="mb-2 font-script text-3xl text-gold md:text-4xl lg:mb-1">
            {eventsContent.eyebrow}
          </p>
          <SectionHeading
            id={headingId}
            lead={eventsContent.heading}
            accent={eventsContent.headingAccent}
            leadClassName="text-ivory"
            accentClassName="italic text-gold"
          />
        </div>
        {eventsContent.intro ? (
          <p className="mt-3 max-w-xl font-sans text-[0.95rem] leading-relaxed text-ivory/70 pin-desktop:mt-0 pin-desktop:max-w-sm pin-desktop:pb-2">
            {eventsContent.intro}
          </p>
        ) : null}
      </div>
      {/* gold hairline — the wireframe's rule */}
      <div
        aria-hidden
        className="mt-8 h-px w-full bg-linear-to-r from-gold via-gold/60 to-gold/0 pin-desktop:mt-6"
      />
    </div>
  );

  return (
    <section
      id={module.id}
      aria-labelledby={headingId}
      className="relative scroll-mt-24 overflow-hidden bg-maroon text-ivory"
    >
      <LotusBloom
        className="pointer-events-none absolute -left-20 top-24 h-80 w-80 opacity-[0.07]"
        fill="var(--color-gold)"
      />

      <EventsPastRail
        header={header}
        events={eventsContent.past}
        ui={eventsUi.past}
        months={eventsUi.calendar.months}
      />

      {/* Block 3 — normal flow; the pin above releases straight into it */}
      <div className="container-site relative pb-24 pt-6 md:pb-32 md:pt-10">
        <div className="grid gap-14 lg:grid-cols-[55fr_45fr] lg:items-start lg:gap-16 xl:gap-20">
          <EventsPresent
            event={eventsContent.present}
            calendar={eventsContent.calendar}
            serverToday={serverToday}
            ui={eventsUi.present}
            months={eventsUi.calendar.months}
          />
          <EventsCalendar
            events={eventsContent.calendar}
            serverToday={serverToday}
            ui={eventsUi.calendar}
          />
        </div>
      </div>
    </section>
  );
}
