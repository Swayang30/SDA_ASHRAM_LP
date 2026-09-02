import {
  ashramBySlug,
  type AshramItem,
  type CalendarEvent,
  type EventsContent,
  type PresentEvent,
} from "@/data/site";

/**
 * Hand-rolled date helpers for the Events section — no date library.
 *
 * Every date is an ISO `YYYY-MM-DD` string. ISO strings sort correctly as
 * plain strings, so comparisons are `<` / `>` and grouping keys are slices.
 * Anything that needs real calendar arithmetic goes through a *local* `Date`
 * (`new Date(y, m - 1, d)`) so no timezone shift can move a festival by a day.
 */

// ------------------------------------------------------------------ //
// Parsing / formatting                                                //
// ------------------------------------------------------------------ //
export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export interface YMD {
  year: number;
  /** 1–12 */
  month: number;
  day: number;
}

export function parseISO(iso: string): YMD {
  const [y, m, d] = iso.split("-").map(Number);
  return { year: y, month: m, day: d };
}

const pad2 = (n: number) => String(n).padStart(2, "0");

export function toISO(year: number, month: number, day: number): string {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

export function localDate(iso: string): Date {
  const { year, month, day } = parseISO(iso);
  return new Date(year, month - 1, day);
}

export function dateToISO(d: Date): string {
  return toISO(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

/** Today's date in the *runtime's* local timezone. */
export function todayISO(): string {
  return dateToISO(new Date());
}

export function addDays(iso: string, n: number): string {
  const d = localDate(iso);
  d.setDate(d.getDate() + n);
  return dateToISO(d);
}

/** 0 = Sunday … 6 = Saturday */
export function weekday(iso: string): number {
  return localDate(iso).getDay();
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/** `"2026-09-04"` → `"2026-09"` */
export function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

export function shiftMonth(key: string, delta: number): string {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
}

/** Clamp a day-of-month into another month (31 Jan → 28 Feb). */
export function sameDayInMonth(iso: string, key: string): string {
  const { day } = parseISO(iso);
  const [y, m] = key.split("-").map(Number);
  return toISO(y, m, Math.min(day, daysInMonth(y, m)));
}

/** `"29 July 2026"` */
export function formatDate(iso: string, months: readonly string[]): string {
  const { year, month, day } = parseISO(iso);
  return `${day} ${months[month - 1]} ${year}`;
}

/** `"Wednesday 29 July 2026"` */
export function formatDateLong(
  iso: string,
  months: readonly string[],
  weekdays: readonly string[]
): string {
  return `${weekdays[weekday(iso)]} ${formatDate(iso, months)}`;
}

/** `"29 Jul 2026"` — the card chip. */
export function formatDateShort(iso: string, months: readonly string[]): string {
  const { year, month, day } = parseISO(iso);
  return `${day} ${months[month - 1].slice(0, 3)} ${year}`;
}

/** `"1 – 5 September 2026"`, `"28 September – 3 October 2026"`, or a single date. */
export function formatDateRange(
  start: string,
  end: string | undefined,
  months: readonly string[]
): string {
  if (!end || end === start) return formatDate(start, months);
  const a = parseISO(start);
  const b = parseISO(end);
  if (a.year === b.year && a.month === b.month) {
    return `${a.day} – ${b.day} ${months[a.month - 1]} ${a.year}`;
  }
  if (a.year === b.year) {
    return `${a.day} ${months[a.month - 1]} – ${b.day} ${months[b.month - 1]} ${a.year}`;
  }
  return `${formatDate(start, months)} – ${formatDate(end, months)}`;
}

/** `"September 2026"` from a `"2026-09"` key. */
export function monthLabel(key: string, months: readonly string[]): string {
  const [y, m] = key.split("-").map(Number);
  return `${months[m - 1]} ${y}`;
}

// ------------------------------------------------------------------ //
// Month grid                                                          //
// ------------------------------------------------------------------ //
export interface MonthCell {
  iso: string;
  day: number;
}

/**
 * Sunday-first matrix of weeks for a month. Cells outside the month are
 * `null` so the grid can render blank, non-focusable padding.
 */
export function monthMatrix(key: string): (MonthCell | null)[][] {
  const [year, month] = key.split("-").map(Number);
  const lead = new Date(year, month - 1, 1).getDay();
  const total = daysInMonth(year, month);
  const cells: (MonthCell | null)[] = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let day = 1; day <= total; day++) {
    cells.push({ iso: toISO(year, month, day), day });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  const rows: (MonthCell | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

// ------------------------------------------------------------------ //
// Event grouping                                                      //
// ------------------------------------------------------------------ //

/** `"6:00 AM"` → minutes since midnight; unknown formats sort last. */
function timeToMinutes(time?: string): number {
  if (!time) return 24 * 60;
  const m = /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i.exec(time.trim());
  if (!m) return 24 * 60;
  let h = Number(m[1]) % 12;
  const min = Number(m[2] ?? 0);
  if ((m[3] ?? "").toUpperCase() === "PM") h += 12;
  return h * 60 + min;
}

export function sortEvents(events: readonly CalendarEvent[]): CalendarEvent[] {
  return [...events].sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      timeToMinutes(a.time) - timeToMinutes(b.time)
  );
}

export function groupByDate(
  events: readonly CalendarEvent[]
): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>();
  for (const ev of sortEvents(events)) {
    const list = map.get(ev.date);
    if (list) list.push(ev);
    else map.set(ev.date, [ev]);
  }
  return map;
}

/** Sorted, unique `"YYYY-MM"` keys that carry at least one event. */
export function eventMonths(events: readonly CalendarEvent[]): string[] {
  return [...new Set(events.map((e) => monthKey(e.date)))].sort();
}

export function eventsInMonth(
  events: readonly CalendarEvent[],
  key: string
): CalendarEvent[] {
  return sortEvents(events.filter((e) => monthKey(e.date) === key));
}

/**
 * Which month the calendar opens on: the current month if it has events,
 * otherwise the nearest future month with events, otherwise the last month
 * that had any. Falls back to the current month when nothing is scheduled.
 */
export function initialMonth(months: readonly string[], today: string): string {
  const current = monthKey(today);
  if (months.length === 0) return current;
  if (months.includes(current)) return current;
  return months.find((m) => m > current) ?? months[months.length - 1];
}

/** First calendar entry on or after `today`. */
export function nextCalendarEvent(
  events: readonly CalendarEvent[],
  today: string
): CalendarEvent | undefined {
  return sortEvents(events).find((e) => e.date >= today);
}

// ------------------------------------------------------------------ //
// Present event                                                       //
// ------------------------------------------------------------------ //
export type PresentStatus = "live" | "upcoming" | "past";

export function presentStatus(ev: PresentEvent, today: string): PresentStatus {
  const end = ev.endDate ?? ev.startDate;
  if (today < ev.startDate) return "upcoming";
  if (today > end) return "past";
  return "live";
}

// ------------------------------------------------------------------ //
// Ashram lookup                                                       //
// ------------------------------------------------------------------ //
const warned = new Set<string>();

/**
 * Resolve an `ashramSlug` against `ashrams` in site.ts. An unknown slug is
 * an authoring mistake: it is logged once (development only) and callers
 * fall back to printing the raw slug rather than crashing the page.
 */
export function getAshram(slug: string): AshramItem | undefined {
  const item = ashramBySlug[slug];
  if (!item && process.env.NODE_ENV !== "production" && !warned.has(slug)) {
    warned.add(slug);
    console.error(
      `[events] Unknown ashramSlug "${slug}". Add it to \`ashrams\` in src/data/site.ts or fix the event entry. Valid slugs: ${Object.keys(ashramBySlug).join(", ")}`
    );
  }
  return item;
}

export function ashramName(slug: string): string {
  return getAshram(slug)?.name ?? slug;
}

export function ashramHref(slug: string): string {
  return `/ashrams/${slug}`;
}

/**
 * Development-only sanity check for the whole events block. Never throws —
 * it reports every problem it finds so the page still renders.
 */
export function validateEventsContent(content: EventsContent): void {
  if (process.env.NODE_ENV === "production") return;
  const problems: string[] = [];
  const checkDate = (label: string, iso?: string) => {
    if (iso !== undefined && !ISO_DATE.test(iso)) {
      problems.push(`${label}: "${iso}" is not an ISO date (YYYY-MM-DD)`);
    }
  };
  const checkSlug = (label: string, slug: string) => {
    if (!ashramBySlug[slug]) problems.push(`${label}: unknown ashramSlug "${slug}"`);
  };
  content.past.forEach((e) => {
    checkDate(`past/${e.id}.date`, e.date);
    checkSlug(`past/${e.id}`, e.ashramSlug);
  });
  checkDate(`present/${content.present.id}.startDate`, content.present.startDate);
  checkDate(`present/${content.present.id}.endDate`, content.present.endDate);
  checkSlug(`present/${content.present.id}`, content.present.ashramSlug);
  content.calendar.forEach((e) => {
    checkDate(`calendar/${e.id}.date`, e.date);
    checkSlug(`calendar/${e.id}`, e.ashramSlug);
  });
  if (problems.length) {
    console.error(
      `[events] ${problems.length} problem(s) in eventsContent (src/data/site.ts):\n  - ${problems.join("\n  - ")}`
    );
  }
}
