/**
 * useRelativeTime.ts
 *
 * `formatRelativeTime` (lib/date/formatRelativeTime.ts) is a pure function
 * of `Date.now()` at the instant it's called — it has no memory of when it
 * was last called and nothing re-invokes it as real time passes. A
 * component that calls it once during render will show "23 hours ago"
 * forever, until *something else* causes that component to re-render.
 *
 * This hook is that "something else": a `setInterval`-driven tick that
 * forces a re-render on a cadence appropriate to how coarse the display
 * granularity already is (minutes/hours/days — see formatRelativeTime),
 * so the string comes back and gets recomputed periodically instead of
 * going stale for an entire session.
 *
 * This is a legitimate `useEffect` — subscribing to a timer is
 * synchronizing with an external clock, not fetching data, so it's not
 * something React Query models. Same category of necessary exception as a
 * window keydown listener (see VaultPreviewModal's useKeydownToClose).
 */
import { useEffect, useState } from "react";
import { formatRelativeTime } from "../../../lib/date/formatRelativeTime";

// 60s is already finer than formatRelativeTime's own smallest displayed
// unit (1 minute) — no point ticking faster than the text could possibly
// change.
const TICK_MS = 60_000;

export function useRelativeTime(isoDate: string): string {
  const [, forceTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => forceTick((n) => n + 1), TICK_MS);
    return () => clearInterval(id);
  }, []);

  return formatRelativeTime(isoDate);
}
