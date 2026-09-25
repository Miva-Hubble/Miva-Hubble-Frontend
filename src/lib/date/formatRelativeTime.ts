/**
 * formatRelativeTime.ts
 *
 * Converts an ISO timestamp (e.g. `createdAt` from the backend) into a
 * short relative string ("2 days ago", "1 month ago") — matching the
 * format the Vault UI already expects.
 *
 * Deliberately dependency-free: `date-fns` / `timeago.js` are not in
 * package.json today, and this feature doesn't need the full formatting
 * surface those libraries offer. If richer date handling (timezones,
 * calendar formatting, i18n) becomes a real requirement elsewhere in the
 * app, that's the point to introduce one and replace this — not before.
 */

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
const YEAR = DAY * 365;

export function formatRelativeTime(isoDate: string): string {
  const timestamp = new Date(isoDate).getTime();

  if (Number.isNaN(timestamp)) {
    return "Unknown date";
  }

  const diffSeconds = Math.round((Date.now() - timestamp) / 1000);

  if (diffSeconds < 0) return "Just now";
  if (diffSeconds < MINUTE) return "Just now";
  if (diffSeconds < HOUR) return pluralize(Math.floor(diffSeconds / MINUTE), "minute");
  if (diffSeconds < DAY) return pluralize(Math.floor(diffSeconds / HOUR), "hour");
  if (diffSeconds < WEEK) return pluralize(Math.floor(diffSeconds / DAY), "day");
  if (diffSeconds < MONTH) return pluralize(Math.floor(diffSeconds / WEEK), "week");
  if (diffSeconds < YEAR) return pluralize(Math.floor(diffSeconds / MONTH), "month");

  return pluralize(Math.floor(diffSeconds / YEAR), "year");
}

function pluralize(value: number, unit: string): string {
  const safeValue = Math.max(value, 1);
  return `${safeValue} ${unit}${safeValue === 1 ? "" : "s"} ago`;
}
