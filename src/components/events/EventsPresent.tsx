"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { LotusBloom } from "@/components/brand/LotusDecor";
import type { CalendarEvent, PresentEvent, eventsUi } from "@/data/site";
import {
  ashramHref,
  formatDate,
  formatDateRange,
  getAshram,
  nextCalendarEvent,
  presentStatus,
} from "@/lib/events";
import { useToday } from "@/lib/useToday";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface EventsPresentProps {
  event: PresentEvent;
  calendar: CalendarEvent[];
  serverToday: string;
  ui: typeof eventsUi.present;
  months: readonly string[];
}

function PinIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="shrink-0"
    >
      <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

/**
 * Block 3, left column — the present event.
 *
 * `live`     → media, "Happening now" badge with a slow-pulsing gold dot.
 * `upcoming` → same panel, "Up next" badge, static dot, "Begins <date>".
 * `past`     → designed empty state pointing at the next calendar entry.
 *
 * Status is derived from the visitor's real date (see `useToday`), so a
 * prerendered page never advertises a festival that ended last week.
 */
export default function EventsPresent({
  event,
  calendar,
  serverToday,
  ui,
  months,
}: EventsPresentProps) {
  const today = useToday(serverToday);
  const reduced = useReducedMotion();
  const status = presentStatus(event, today);
  const ashram = getAshram(event.ashramSlug);
  const ashramLabel = ashram?.name ?? event.ashramSlug;

  if (status === "past") {
    const next = nextCalendarEvent(calendar, today);
    const nextAshram = next ? getAshram(next.ashramSlug) : undefined;
    return (
      <Reveal as="div" className="flex flex-col">
        <p className="font-sans text-[0.68rem] uppercase tracking-[0.22em] text-ivory/60">
          {ui.label}
        </p>
        <div className="relative mt-5 overflow-hidden rounded-3xl border border-gold/30 bg-ivory/5 p-8 sm:p-10">
          <LotusBloom
            className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 opacity-[0.12]"
            fill="var(--color-gold)"
          />
          <h3 className="relative font-serif text-2xl text-ivory sm:text-3xl">
            {ui.empty.title}
          </h3>
          <p className="relative mt-4 max-w-md font-sans text-[0.95rem] leading-relaxed text-ivory/70">
            {ui.empty.body}
          </p>
          {next ? (
            <div className="relative mt-8 border-t border-gold/30 pt-6">
              <p className="font-sans text-[0.66rem] uppercase tracking-[0.2em] text-gold">
                {ui.empty.nextLabel}
              </p>
              <p className="mt-2 font-serif text-xl text-ivory">
                {next.href ? (
                  <Link href={next.href} className="rounded hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">
                    {next.title}
                  </Link>
                ) : (
                  next.title
                )}
              </p>
              <p className="mt-1 font-sans text-sm text-ivory/70">
                <time dateTime={next.date}>{formatDate(next.date, months)}</time>
                {next.time ? ` · ${next.time}` : null}
              </p>
              <Link
                href={ashramHref(next.ashramSlug)}
                className="mt-3 inline-flex items-center gap-2 rounded font-sans text-sm font-medium text-gold hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              >
                <PinIcon />
                {nextAshram?.name ?? next.ashramSlug}
              </Link>
            </div>
          ) : null}
        </div>
      </Reveal>
    );
  }

  const live = status === "live";
  const badge = live ? ui.liveBadge : ui.upcomingBadge;
  const isVideo = event.media.kind === "video" && Boolean(event.media.poster);

  return (
    <div className="flex flex-col">
      <Reveal as="div">
        <p className="font-sans text-[0.68rem] uppercase tracking-[0.22em] text-ivory/60">
          {ui.label}
        </p>
        <div
          // Ambient media: the frame carries the accessible name (the event
          // title); the <video> itself is hidden from assistive tech.
          role="img"
          aria-label={event.title}
          className="relative mt-5 aspect-4/3 overflow-hidden rounded-3xl bg-brown shadow-warm"
        >
          {isVideo && reduced ? (
            // prefers-reduced-motion: no autoplay — show the poster still.
            <Image
              src={event.media.poster as string}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          ) : isVideo ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={event.media.src}
              poster={event.media.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              tabIndex={-1}
            />
          ) : (
            <Image
              src={event.media.src}
              alt={event.media.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          )}
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-maroon/60 via-transparent to-transparent"
          />
          <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-ivory/95 px-3.5 py-1.5 font-sans text-[0.66rem] font-medium uppercase tracking-[0.18em] text-maroon">
            <span className="relative flex h-2 w-2" aria-hidden>
              {live ? (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70 [animation-duration:2.6s]" />
              ) : null}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            {badge}
          </span>
        </div>
      </Reveal>

      <Reveal as="div" i={1} className="mt-7">
        <h3 className="font-serif text-[1.9rem] leading-tight text-ivory sm:text-[2.3rem]">
          {event.title}
        </h3>
        <p className="mt-3 font-sans text-sm uppercase tracking-[0.16em] text-gold">
          {live ? null : `${ui.beginsPrefix} `}
          <time dateTime={event.startDate}>
            {formatDateRange(event.startDate, event.endDate, months)}
          </time>
        </p>
        <p className="mt-2 flex flex-wrap items-center gap-x-2 font-sans text-sm text-ivory/75">
          <span>{ui.ashramPrefix}</span>
          <Link
            href={ashramHref(event.ashramSlug)}
            className="inline-flex items-center gap-1.5 rounded font-medium text-ivory underline-offset-4 hover:text-gold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            <PinIcon />
            {ashramLabel}
          </Link>
          {ashram?.location ? (
            <span className="text-ivory/55">· {ashram.location}</span>
          ) : null}
        </p>
        <p className="mt-5 max-w-xl font-sans text-[0.95rem] leading-relaxed text-ivory/75">
          {event.description}
        </p>
        <div className="mt-7">
          <Button
            variant="outline-white"
            href={event.cta?.href ?? ashramHref(event.ashramSlug)}
          >
            {event.cta?.label ?? ui.viewAshram}
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
