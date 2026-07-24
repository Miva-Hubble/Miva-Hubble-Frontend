/**
 * useCyclingText.ts
 *
 * Cycles through a list of messages at a fixed interval while `active` is
 * true — used for things like "keep the user excited" hint text under a
 * button during a slow async call (OAuth redirect, file upload, etc).
 *
 * Pure UI-timing concern, no knowledge of auth/network/business logic, so
 * it's reusable anywhere a "here's what's happening, hang tight" hint is
 * useful, not just the Google sign-in button.
 */

import { useEffect, useState } from "react";

export const useCyclingText = (
  messages: readonly string[],
  active: boolean,
  intervalMs: number = 1800,
): string => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Reset to the first message whenever cycling stops, so the next time
    // it starts (e.g. a retry) it begins from the beginning, not wherever
    // it happened to be left off.
    if (!active || messages.length <= 1) {
      setIndex(0);
      return;
    }

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [active, messages, intervalMs]);

  return messages[index] ?? "";
};
