"use client";

import { useSyncExternalStore } from "react";
import { todayISO } from "./events";

const subscribe = () => () => {};

/**
 * Today's ISO date, hydration-safe.
 *
 * The homepage is prerendered, so the server's idea of "today" is the build
 * date. Server markup and the first client render both use that value; once
 * hydrated, `useSyncExternalStore` swaps in the visitor's real local date
 * without a mismatch warning, so "Happening now" and the calendar's month
 * stay correct even on a build that is days old.
 */
export function useToday(serverToday: string): string {
  return useSyncExternalStore(subscribe, todayISO, () => serverToday);
}
