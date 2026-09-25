/**
 * GoogleAuthButton.tsx
 *
 * Dumb presentational component: the Google sign-in/sign-up button, its
 * loading spinner, and a cycling hint line underneath so users know
 * something is happening (and stay a little excited) during the OAuth
 * redirect instead of staring at a static "Connecting..." label.
 *
 * No auth/network logic lives here — that stays in the parent (Landing.tsx),
 * this component just renders based on props.
 */

import type { ImgHTMLAttributes } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useCyclingText } from "../../../hooks/useCyclingText";
import { GOOGLE_AUTH_LOADING_MESSAGES } from "../constants/messages";

function ImageWithFallback({
  fallbackSrc,
  onError,
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & { fallbackSrc?: string }) {
  return (
    <img
      onError={(e) => {
        if (fallbackSrc && e.currentTarget.src !== fallbackSrc) {
          e.currentTarget.src = fallbackSrc;
        }
        onError?.(e);
      }}
      {...props}
    />
  );
}

interface GoogleAuthButtonProps {
  isSignIn: boolean;
  isLoading: boolean;
  onClick: () => void;
}

const GoogleAuthButton = ({ isSignIn, isLoading, onClick }: GoogleAuthButtonProps) => {
  const hint = useCyclingText(GOOGLE_AUTH_LOADING_MESSAGES, isLoading);

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl text-sm font-bold bg-[#e2e8f0] text-slate-900 hover:bg-white transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <ImageWithFallback
            src="https://www.gstatic.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
            fallbackSrc="https://developers.google.com/static/identity/images/g-logo.png"
            alt="Google logo"
            className="w-5 h-5 object-contain"
          />
        )}
        {isLoading ? "Connecting..." : isSignIn ? "Sign in with Google" : "Sign up with Google"}
      </button>

      {/* Cycling hint text — only takes up space once loading starts, so it
          doesn't shift layout for the default (idle) state. Each message
          crossfades in/out via framer-motion (already used elsewhere on
          this page) rather than a Tailwind animate-in utility, since the
          project doesn't have the tailwindcss-animate plugin installed. */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.p
            key={hint}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="mt-3 text-center text-xs font-medium text-slate-400"
          >
            {hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GoogleAuthButton;
