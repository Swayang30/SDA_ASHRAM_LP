"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import type { CalendarEvent, eventsUi } from "@/data/site";
import {
  addDays,
  ashramHref,
  eventMonths,
  eventsInMonth,
  formatDateLong,
  getAshram,
  groupByDate,
  initialMonth,
  monthKey,
  monthLabel,
  monthMatrix,
  sameDayInMonth,
  shiftMonth,
  weekday,
} from "@/lib/events";
import { useToday } from "@/lib/useToday";

interface EventsCalendarProps {
  events: CalendarEvent[];
  serverToday: string;
  ui: typeof eventsUi.calendar;
}

function MonthArrow({
  dir,
  label,
  onClick,
  disabled,
}: {
  dir: "prev" | "next";
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 text-maroon transition-colors duration-300 hover:bg-maroon hover:text-ivory disabled:pointer-events-none disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
    >
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
        className={dir === "prev" ? "rotate-180" : ""}
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </button>
  );
}

/**
 * Block 3, right column — month calendar.
 *
 * ARIA grid with roving tabindex: arrows move a day / a week, Home / End jump
 * to the row ends, PageUp / PageDown change month, Enter / Space select.
 * Navigation is unbounded — any month is reachable; a month with no events
 * renders its grid normally and the detail strip says so. The calendar opens
 * on the nearest month that carries events (see `initialMonth`). Month
 * changes are announced through the live heading; a visually-hidden list of
 * the month's events is the text fallback for screen-reader users.
 *
 * All state is set from user events. The only effect moves DOM focus after
 * a keyboard month change.
 */
export default function EventsCalendar({
  events,
  serverToday,
  ui,
}: EventsCalendarProps) {
  const today = useToday(serverToday);
  const headingId = useId();
  const gridRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef(false);

  const months = useMemo(() => eventMonths(events), [events]);
  const byDate = useMemo(() => groupByDate(events), [events]);

  // `null` = "derive from today" so a stale prerender can never pin the
  // calendar to the build month.
  const [viewMonth, setViewMonth] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);

  const month = viewMonth ?? initialMonth(months, today);
  const matrix = useMemo(() => monthMatrix(month), [month]);
  const monthEvents = useMemo(() => eventsInMonth(events, month), [events, month]);
  const label = monthLabel(month, ui.months);

  // Roving tabindex target: the focused day if it is in this month, else the
  // selected day, else today, else the 1st.
  const focusIso =
    focused && monthKey(focused) === month
      ? focused
      : selected && monthKey(selected) === month
        ? selected
        : monthKey(today) === month
          ? today
          : `${month}-01`;

  const moveTo = useCallback(
    (iso: string) => {
      const key = monthKey(iso);
      if (key !== month) setViewMonth(key);
      setFocused(iso);
      pendingFocus.current = true;
    },
    [month]
  );

  const changeMonth = (delta: number) => {
    const key = shiftMonth(month, delta);
    setViewMonth(key);
    setFocused(sameDayInMonth(focusIso, key));
  };

  const onGridKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Move from the cell that actually has focus (it may have been focused
    // by a click, a screen reader or a script), falling back to the roving cell.
    const origin = (e.target as HTMLElement).dataset.iso ?? focusIso;
    let next: string | null = null;
    switch (e.key) {
      case "ArrowLeft":
        next = addDays(origin, -1);
        break;
      case "ArrowRight":
        next = addDays(origin, 1);
        break;
      case "ArrowUp":
        next = addDays(origin, -7);
        break;
      case "ArrowDown":
        next = addDays(origin, 7);
        break;
      case "Home":
        next = addDays(origin, -weekday(origin));
        break;
      case "End":
        next = addDays(origin, 6 - weekday(origin));
        break;
      case "PageUp":
        next = sameDayInMonth(origin, shiftMonth(month, -1));
        break;
      case "PageDown":
        next = sameDayInMonth(origin, shiftMonth(month, 1));
        break;
      default:
        return;
    }
    e.preventDefault();
    if (next) moveTo(next);
  };

  // Move DOM focus to the roving cell after a keyboard move (no setState).
  useEffect(() => {
    if (!pendingFocus.current) return;
    pendingFocus.current = false;
    gridRef.current
      ?.querySelector<HTMLElement>(`[data-iso="${focusIso}"]`)
      ?.focus();
  });

  const selectedEvents = selected ? (byDate.get(selected) ?? []) : [];

  return (
    <Reveal>
      <p className="font-sans text-[0.68rem] uppercase tracking-[0.22em] text-ivory/60">
        {ui.label}
      </p>
      <div className="mt-5 rounded-3xl bg-ivory p-5 text-maroon shadow-warm sm:p-7">
        {/* month header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-sans text-[0.62rem] uppercase tracking-[0.2em] text-cocoa/50">
              {ui.heading}
            </p>
            <h3
              id={headingId}
              aria-live="polite"
              aria-atomic="true"
              className="mt-1 font-serif text-2xl text-maroon"
            >
              {label}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <MonthArrow
              dir="prev"
              label={ui.previousMonth}
              onClick={() => changeMonth(-1)}
              disabled={false}
            />
            <MonthArrow
              dir="next"
              label={ui.nextMonth}
              onClick={() => changeMonth(1)}
              disabled={false}
            />
          </div>
        </div>

        {/* grid */}
        <div
          ref={gridRef}
          role="grid"
          aria-labelledby={headingId}
          onKeyDown={onGridKeyDown}
          className="mt-5"
        >
          <div role="row" className="grid grid-cols-7">
            {ui.weekdays.map((d, i) => (
              <div
                key={d}
                role="columnheader"
                aria-label={ui.weekdaysLong[i]}
                className="py-2 text-center font-sans text-[0.62rem] uppercase tracking-[0.16em] text-cocoa/50"
              >
                {d}
              </div>
            ))}
          </div>
          {/* gold hairline grid: 1px gaps over a gold ground */}
          <div className="flex flex-col gap-px overflow-hidden rounded-xl border border-gold/35 bg-gold/35">
            {matrix.map((week, w) => (
              <div key={w} role="row" className="grid grid-cols-7 gap-px">
                {week.map((cell, c) => {
                  if (!cell) {
                    return (
                      <div
                        key={`pad-${w}-${c}`}
                        role="gridcell"
                        className="min-h-11 bg-ivory"
                      />
                    );
                  }
                  const dayEvents = byDate.get(cell.iso) ?? [];
                  const has = dayEvents.length > 0;
                  const isSelected = selected === cell.iso;
                  const isToday = today === cell.iso;
                  const name = [
                    formatDateLong(cell.iso, ui.months, ui.weekdaysLong),
                    isToday ? ui.todayLabel : null,
                    has
                      ? `${
                          dayEvents.length === 1
                            ? ui.eventCountOne
                            : ui.eventCountMany.replace("{n}", String(dayEvents.length))
                        }: ${dayEvents
                          .map(
                            (ev) =>
                              `${ev.title} at ${getAshram(ev.ashramSlug)?.name ?? ev.ashramSlug}`
                          )
                          .join("; ")}`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(", ");
                  return (
                    <button
                      key={cell.iso}
                      type="button"
                      role="gridcell"
                      data-iso={cell.iso}
                      tabIndex={cell.iso === focusIso ? 0 : -1}
                      aria-selected={isSelected}
                      aria-current={isToday ? "date" : undefined}
                      aria-label={name}
                      onClick={() => {
                        setSelected(cell.iso);
                        setFocused(cell.iso);
                      }}
                      // Keep the roving tabindex on whichever cell has focus.
                      onFocus={() => {
                        if (focused !== cell.iso) setFocused(cell.iso);
                      }}
                      className={`relative flex min-h-11 w-full flex-col items-center justify-center gap-0.5 py-1.5 font-sans text-sm tabular-nums transition-colors duration-300 focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orange ${
                        isSelected
                          ? "bg-maroon text-ivory"
                          : "bg-ivory text-maroon hover:bg-blush"
                      } ${isToday && !isSelected ? "font-semibold text-orange" : ""}`}
                    >
                      <span>{cell.day}</span>
                      <span
                        aria-hidden
                        className={`h-1.5 w-1.5 rounded-full ${
                          has ? "bg-gold" : "bg-transparent"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* detail strip */}
        <div className="mt-5 border-t border-gold/35 pt-5">
          {monthEvents.length === 0 ? (
            <p className="font-sans text-sm text-cocoa/65">{ui.noEventsThisMonth}</p>
          ) : selected ? (
            <motion.div
              key={selected}
              className="reveal-target"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-sans text-[0.66rem] uppercase tracking-[0.18em] text-cocoa/55">
                {ui.eventsOnPrefix}{" "}
                <time dateTime={selected} className="text-maroon">
                  {formatDateLong(selected, ui.months, ui.weekdaysLong)}
                </time>
              </p>
              {selectedEvents.length ? (
                <ul className="mt-3 space-y-4">
                  {selectedEvents.map((ev) => {
                    const ashram = getAshram(ev.ashramSlug);
                    return (
                      <li
                        key={ev.id}
                        className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                      >
                        <div className="min-w-0">
                          <p className="font-serif text-lg leading-snug text-maroon">
                            {ev.href ? (
                              <Link
                                href={ev.href}
                                className="rounded hover:text-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
                              >
                                {ev.title}
                              </Link>
                            ) : (
                              ev.title
                            )}
                          </p>
                          <p className="mt-0.5 font-sans text-sm text-cocoa/70">
                            {ev.time ?? ui.timeTba}
                          </p>
                        </div>
                        <div className="shrink-0 sm:text-right">
                          <Link
                            href={ashramHref(ev.ashramSlug)}
                            className="inline-flex items-center gap-1.5 rounded font-sans text-sm font-medium text-orange underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
                          >
                            {ashram?.name ?? ev.ashramSlug}
                          </Link>
                          {ashram?.location ? (
                            <p className="mt-0.5 font-sans text-xs text-cocoa/55">
                              {ashram.location}
                            </p>
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-3 font-sans text-sm text-cocoa/65">
                  {ui.noEventsOnDay}
                </p>
              )}
            </motion.div>
          ) : (
            <p className="font-sans text-sm text-cocoa/65">{ui.selectPrompt}</p>
          )}
        </div>

        {/* text fallback — the whole month, for screen readers */}
        <div className="sr-only">
          <h4>{`${ui.monthEventsList}: ${label}`}</h4>
          {monthEvents.length ? (
            <ul>
              {monthEvents.map((ev) => (
                <li key={ev.id}>
                  {`${formatDateLong(ev.date, ui.months, ui.weekdaysLong)} — ${ev.title}, ${ev.time ?? ui.timeTba}, `}
                  <Link href={ashramHref(ev.ashramSlug)}>
                    {getAshram(ev.ashramSlug)?.name ?? ev.ashramSlug}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>{ui.noEventsThisMonth}</p>
          )}
        </div>
      </div>
    </Reveal>
  );
}
