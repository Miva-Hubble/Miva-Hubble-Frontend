/**
 * ToastProvider.tsx
 *
 * SHARED, app-wide toast system (per STRUCTURE.md conventions, matching
 * ErrorBanner.tsx: no feature-specific business logic, just how to display
 * a transient message). Mounted once in App.tsx, above AppRoutes, so any
 * feature can call `useToast().showToast(...)` without prop-drilling.
 *
 * Deliberately dependency-free — no `sonner`/`react-hot-toast` in
 * package.json today, and this app only needs a handful of dismissible
 * banners, not a full toast library's feature surface. Uses
 * `framer-motion` (already a dependency, already used identically in
 * EditProfileModal) for the enter/exit animation.
 *
 * Usage:
 *   const { showToast } = useToast();
 *   showToast({ message: "Copied!", variant: "success" });
 */

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

type ToastVariant = "info" | "success" | "warning" | "error";

interface ToastInput {
  message: string;
  variant?: ToastVariant;
  /** Milliseconds before auto-dismiss. Defaults to 5000. Pass 0 to persist until manually dismissed. */
  durationMs?: number;
}

interface Toast extends Required<Omit<ToastInput, "durationMs">> {
  id: string;
  durationMs: number;
}

interface ToastContextValue {
  showToast: (toast: ToastInput) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<
  ToastVariant,
  { bg: string; border: string; text: string; icon: typeof Info }
> = {
  info: { bg: "bg-slate-800", border: "border-slate-600", text: "text-slate-100", icon: Info },
  success: { bg: "bg-emerald-900/90", border: "border-emerald-600", text: "text-emerald-100", icon: CheckCircle2 },
  warning: { bg: "bg-orange-900/90", border: "border-orange-500", text: "text-orange-100", icon: AlertTriangle },
  error: { bg: "bg-red-900/90", border: "border-red-600", text: "text-red-100", icon: AlertTriangle },
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ message, variant = "info", durationMs = 5000 }: ToastInput) => {
      const id = `toast-${nextId.current++}`;
      setToasts((prev) => [...prev, { id, message, variant, durationMs }]);

      if (durationMs > 0) {
        setTimeout(() => dismissToast(id), durationMs);
      }
    },
    [dismissToast],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="pointer-events-none fixed inset-x-0 top-4 z-[200] flex flex-col items-center gap-2 px-4">
        <AnimatePresence>
          {toasts.map((toast) => {
            const style = VARIANT_STYLES[toast.variant];
            const Icon = style.icon;

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border ${style.border} ${style.bg} p-4 shadow-2xl backdrop-blur-sm`}
                role="alert"
              >
                <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${style.text}`} />
                <p className={`flex-1 text-sm font-medium ${style.text}`}>{toast.message}</p>
                <button
                  type="button"
                  onClick={() => dismissToast(toast.id)}
                  className={`shrink-0 rounded-full p-1 hover:bg-white/10 ${style.text}`}
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};
