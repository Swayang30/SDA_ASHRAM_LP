import Image from "next/image";
import Link from "next/link";
import type { PastEvent } from "@/data/site";
import { ashramHref, ashramName, formatDateShort } from "@/lib/events";

interface EventCardProps {
  event: PastEvent;
  /** Month names from site.ts (`eventsUi.calendar.months`). */
  months: readonly string[];
  /** Accessible-name prefix, e.g. "Read about". */
  readMoreLabel: string;
  /**
   * True while the card is off-stage in the pinned desktop rail, so keyboard
   * focus can never scroll the user into the pinned void. Never set under
   * reduced motion (the rail passes `false`).
   */
  inert?: boolean;
  className?: string;
}

/**
 * Presentational past-event card: ivory surface, warm-duotone cover with a
 * gold date chip, Playfair title, ashram in tracked Poppins caps. The whole
 * card is one stretched link. `data-rail-*` hooks are what the desktop rail
 * animates — they carry no styling of their own.
 */
export default function EventCard({
  event,
  months,
  readMoreLabel,
  inert = false,
  className = "",
}: EventCardProps) {
  const ashram = ashramName(event.ashramSlug);
  const href = event.href ?? ashramHref(event.ashramSlug);
  const chip = formatDateShort(event.date, months);

  return (
    <article
      data-rail-card
      inert={inert}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-ivory text-maroon shadow-warm ${className}`}
    >
      {/* cover */}
      <div className="relative aspect-4/5 overflow-hidden bg-brown pin-desktop:aspect-square">
        <Image
          src={event.media.src}
          alt={event.media.alt}
          fill
          sizes="(max-width: 640px) 76vw, (max-width: 1024px) 45vw, 320px"
          className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.03] group-focus-within:scale-[1.03]"
        />
        {/* warm duotone: multiply tint + a maroon foot so the chip and title zone read */}
        <div
          aria-hidden
          className="absolute inset-0 bg-maroon/30 mix-blend-multiply"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-maroon/55 via-transparent to-transparent"
        />
        <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 font-sans text-[0.66rem] font-medium uppercase tracking-[0.16em] text-maroon">
          <time dateTime={event.date}>{chip}</time>
        </span>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-[1.2rem] leading-snug text-maroon sm:text-[1.3rem]">
          {/* Stretched link — the ::after covers the whole card. */}
          <Link
            href={href}
            aria-label={`${readMoreLabel} ${event.title} — ${chip}, ${ashram}`}
            className="rounded after:absolute after:inset-0 after:z-10 after:content-[''] focus-visible:outline-none"
          >
            {event.title}
          </Link>
        </h3>
        <p className="mt-2 font-sans text-[0.66rem] uppercase tracking-[0.18em] text-cocoa/60">
          {ashram}
        </p>
        <p className="mt-3 line-clamp-2 font-sans text-sm leading-relaxed text-cocoa/70 pin-desktop:hidden">
          {event.summary}
        </p>
        {/* gold underline — extends on hover / focus */}
        <span
          aria-hidden
          className="mt-4 block h-px w-8 bg-gold transition-[width] duration-500 ease-soft group-hover:w-full group-focus-within:w-full"
        />
      </div>

      {/* spotlight veil — opacity is driven by the desktop rail only */}
      <div
        data-rail-veil
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-maroon/35 opacity-0"
      />

      {/* focus ring for the whole card when its link is keyboard-focused */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-2xl ring-2 ring-gold ring-offset-2 ring-offset-maroon opacity-0 transition-opacity group-focus-within:opacity-100"
      />
    </article>
  );
}
