/**
 * ErrorBanner.tsx
 *
 * SHARED "dumb" feedback component (per STRUCTURE.md conventions: no
 * business logic, no knowledge of *why* an error happened — just how to
 * display one). Any feature can drop this in wherever a recoverable async
 * error needs to be shown near the action that triggered it.
 *
 * Usage:
 *   {errorMessage && (
 *     <ErrorBanner
 *       message={errorMessage}
 *       onRetry={handleComplete}
 *     />
 *   )}
 */

import { AlertCircle } from "lucide-react";

interface ErrorBannerProps {
  /** Human-readable message — already passed through getUserFriendlyError. */
  message: string;
  /** Optional heading shown above the message. Defaults to a generic title. */
  title?: string;
  /** Optional retry handler. Omit to render the banner without a retry action. */
  onRetry?: () => void;
  /** Label for the retry button. */
  retryLabel?: string;
  className?: string;
}

const ErrorBanner = ({
  message,
  title = "Something went wrong",
  onRetry,
  retryLabel = "Try again",
  className = "",
}: ErrorBannerProps) => {
  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 ${className}`}
    >
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

      <div className="flex-1">
        <p className="text-sm font-medium text-red-800">{title}</p>
        <p className="mt-1 text-sm text-red-700">{message}</p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 text-sm font-medium text-red-800 underline underline-offset-2 hover:text-red-900"
          >
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorBanner;
