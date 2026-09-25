import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, AlertTriangle, RotateCw } from "lucide-react";
import type { VaultTheme } from "../constants/theme";
import { useVaultResourceUrl } from "../hooks/useVaultResourceUrl";

// Formats the browser can't render natively but Google's viewer can embed
// without us needing a document-rendering library of our own.
const OFFICE_VIEWER_FORMATS = new Set(["DOC", "DOCX"]);

interface VaultPreviewModalProps {
  open: boolean;
  onClose: () => void;
  resourceId: string;
  title: string;
  fileFormat: string;
  theme: VaultTheme;
  onDownload: () => void;
  isDownloading: boolean;
}

/**
 * Owns nothing but "has this exact iframe src finished loading" — remounted
 * fresh via `key={src}` on every src change (see the call site below), so
 * `isFrameLoading` always starts `true` for a new src with no effect needed
 * to reset it. This is the useEffect-free replacement for the old
 * `useEffect(() => setIsFrameLoading(true), [open, previewUrl])`.
 */
function PreviewFrame({ src, title, bg }: { src: string; title: string; bg: string }) {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: bg }}>
          <RotateCw className="w-6 h-6 animate-spin" style={{ color: "inherit" }} />
        </div>
      )}
      <iframe src={src} title={title} className="w-full h-full border-0" onLoad={() => setIsLoading(false)} />
    </>
  );
}

export default function VaultPreviewModal({
  open,
  onClose,
  resourceId,
  title,
  fileFormat,
  theme,
  onDownload,
  isDownloading,
}: VaultPreviewModalProps) {
  // React Query owns the fetch/loading/error state for the signed preview
  // URL, gated on `open` — no `useEffect` needed to kick off or reset a
  // fetch when the modal opens or `resourceId` changes; the query key
  // already scopes that (see useVaultResourceUrl).
  const { url: previewUrl, isLoading: isUrlLoading, isError, errorMessage, refetch } = useVaultResourceUrl(
    resourceId,
    "preview",
    open
  );

  // Subscribing to a browser-level keydown event is a genuine "synchronize
  // with an external system" effect — the one kind of side effect React
  // Query doesn't replace, since it isn't a data fetch. This is the only
  // useEffect left in this component.
  useKeydownToClose(open, onClose);

  const format = fileFormat.toUpperCase();
  const isOffice = OFFICE_VIEWER_FORMATS.has(format);
  const canRenderInline = Boolean(previewUrl) && (format === "PDF" || isOffice);

  const iframeSrc = !previewUrl
    ? undefined
    : isOffice
      ? `https://docs.google.com/gview?url=${encodeURIComponent(previewUrl)}&embedded=true`
      : previewUrl;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
        >
          <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full max-w-[1800px] h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            style={{ backgroundColor: theme.surface, border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div
              className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b shrink-0"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            >
              <h2 className="text-sm sm:text-base font-semibold truncate" style={{ color: theme.textPrimary }}>
                {title}
              </h2>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={onDownload}
                  disabled={isDownloading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-950 disabled:opacity-60 cursor-pointer"
                  style={{ backgroundColor: theme.primary }}
                >
                  <Download className={`w-3.5 h-3.5 ${isDownloading ? "animate-spin" : ""}`} />
                  {isDownloading ? "Preparing…" : "Download"}
                </button>
                <button
                  onClick={onClose}
                  aria-label="Close preview"
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-4 h-4" style={{ color: theme.textSecondary }} />
                </button>
              </div>
            </div>

            <div className="relative flex-1" style={{ backgroundColor: theme.bg }}>
              {isUrlLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <RotateCw className="w-6 h-6 animate-spin" style={{ color: theme.textMuted }} />
                </div>
              )}

              {isError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-3 px-6">
                  <AlertTriangle className="w-6 h-6" style={{ color: theme.textMuted }} />
                  <p className="text-sm max-w-xs" style={{ color: theme.textSecondary }}>
                    {errorMessage || "Couldn't load this preview."}
                  </p>
                  <button
                    onClick={() => refetch()}
                    className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                    style={{ backgroundColor: theme.accentBg, color: theme.textPrimary }}
                  >
                    Try again
                  </button>
                </div>
              )}

              {!isUrlLoading && !isError && previewUrl && !canRenderInline && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-3 px-6">
                  <AlertTriangle className="w-6 h-6" style={{ color: theme.textMuted }} />
                  <p className="text-sm max-w-xs" style={{ color: theme.textSecondary }}>
                    Preview isn't available for this file type. Download it to view.
                  </p>
                  <button
                    onClick={onDownload}
                    disabled={isDownloading}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 disabled:opacity-60 cursor-pointer"
                    style={{ backgroundColor: theme.primary }}
                  >
                    {isDownloading ? "Preparing…" : "Download instead"}
                  </button>
                </div>
              )}

              {!isUrlLoading && !isError && canRenderInline && iframeSrc && (
                // Keyed by src: a new signed URL (or a switch between PDF and
                // the Google Office viewer) mounts a brand new PreviewFrame,
                // which is what gives it a fresh `isLoading = true` with zero
                // effects — see the component's own doc comment above.
                <PreviewFrame key={iframeSrc} src={iframeSrc} title={title} bg={theme.bg} />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// The one unavoidable useEffect in this file: subscribing to a window-level
// keydown event is synchronizing with an external system (the browser),
// not fetching data, so React Query has no bearing on it. Isolated into its
// own tiny hook so it reads as a deliberate, self-contained exception rather
// than a leftover data-fetching effect.
// ---------------------------------------------------------------------------
function useKeydownToClose(active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, onClose]);
}
