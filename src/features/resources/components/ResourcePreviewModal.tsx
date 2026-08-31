import { motion, AnimatePresence } from "motion/react";
import { Download, ExternalLink, RotateCw, X, FileText, File, BookOpen, AlertTriangle } from "lucide-react";
import type { VaultTheme } from "../constants/theme";

interface ResourcePreviewModalProps {
  open: boolean;
  onClose: () => void;
  theme: VaultTheme;
  title: string;
  fileType?: string;
  previewUrl: string | null;
  isLoading: boolean;
  error?: string | null;
  onDownload?: () => void;
  isDownloading?: boolean;
}

function getFormatIcon(fileType: string) {
  switch (fileType.toUpperCase()) {
    case "PDF":
      return <FileText className="w-8 h-8" />;
    case "EPUB":
      return <BookOpen className="w-8 h-8" />;
    case "DOC":
    case "DOCX":
      return <File className="w-8 h-8" />;
    default:
      return <FileText className="w-8 h-8" />;
  }
}

export default function ResourcePreviewModal({
  open,
  onClose,
  theme,
  title,
  fileType = "PDF",
  previewUrl,
  isLoading,
  error = null,
  onDownload,
  isDownloading = false,
}: ResourcePreviewModalProps) {
  const normalizedType = (fileType || "PDF").toUpperCase();
  const isPdf = normalizedType === "PDF";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="resource-preview-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
        >
          {/* Backdrop click to close */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Modal Container - Maximize screen real estate */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 15 }}
            transition={{ duration: 0.25, type: "spring", damping: 25 }}
            className="relative rounded-2xl flex flex-col w-full max-w-[97vw] h-[96vh] overflow-hidden border shadow-2xl z-10"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
              boxShadow: "0 25px 70px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Floating Top-Right Close / External Actions */}
            <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
              {isPdf && previewUrl && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all shadow-md backdrop-blur-md cursor-pointer"
                  title="Open in new window"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all shadow-md backdrop-blur-md cursor-pointer"
                onClick={onClose}
                aria-label="Close preview"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Body / Inline Document Viewer - Edge to Edge */}
            <div className="flex-1 min-h-0 relative p-0 bg-black/30 flex flex-col items-center justify-center overflow-hidden">
              {/* Non-PDF formats: Clean Preview Unavailable Card */}
              {!isPdf ? (
                <div
                  className="p-8 sm:p-10 rounded-2xl border max-w-md w-full text-center flex flex-col items-center shadow-lg mx-4"
                  style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center"
                    style={{ backgroundColor: theme.accentBg, color: theme.primary }}
                  >
                    {getFormatIcon(normalizedType)}
                  </div>
                  <h3 className="text-lg font-bold mb-1 truncate max-w-full" style={{ color: theme.textPrimary }} title={title}>
                    {title}
                  </h3>
                  <p className="text-sm font-semibold mb-2" style={{ color: theme.primary }}>
                    Preview unavailable ({normalizedType})
                  </p>
                  <p className="text-xs mb-6 leading-relaxed" style={{ color: theme.textSecondary }}>
                    This file format can't be previewed in the browser yet. Download to view on your device.
                  </p>
                  {onDownload && (
                    <button
                      onClick={onDownload}
                      disabled={isDownloading}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all hover:brightness-110 disabled:opacity-60 shadow-md"
                      style={{ backgroundColor: theme.primary, color: "#FFFFFF" }}
                    >
                      {isDownloading ? (
                        <RotateCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      {isDownloading ? "Preparing download..." : "Download document"}
                    </button>
                  )}
                </div>
              ) : isLoading ? (
                /* PDF Loading State */
                <div className="flex flex-col items-center justify-center gap-3">
                  <RotateCw className="w-8 h-8 animate-spin" style={{ color: theme.primary }} />
                  <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>
                    Loading preview...
                  </p>
                </div>
              ) : error ? (
                /* PDF Error State */
                <div
                  className="p-6 rounded-xl border max-w-md w-full text-center flex flex-col items-center mx-4"
                  style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
                >
                  <div
                    className="w-12 h-12 rounded-full mb-3 flex items-center justify-center"
                    style={{ backgroundColor: theme.accentBg }}
                  >
                    <AlertTriangle className="w-6 h-6 text-rose-400" />
                  </div>
                  <h3 className="text-sm font-bold mb-1" style={{ color: theme.textPrimary }}>
                    Unable to generate preview
                  </h3>
                  <p className="text-xs mb-4" style={{ color: theme.textMuted }}>
                    {error}
                  </p>
                  {onDownload && (
                    <button
                      onClick={onDownload}
                      disabled={isDownloading}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all hover:brightness-110 disabled:opacity-60"
                      style={{ backgroundColor: theme.primary, color: "#FFFFFF" }}
                    >
                      {isDownloading ? (
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      {isDownloading ? "Preparing..." : "Download file instead"}
                    </button>
                  )}
                </div>
              ) : previewUrl ? (
                /* Full PDF Viewer - Completely fills the container */
                <iframe
                  src={previewUrl}
                  title={title}
                  className="w-full h-full border-0 bg-white"
                  allow="fullscreen"
                />
              ) : null}
            </div>

            {/* Footer Bar */}
            <div
              className="flex items-center justify-between px-5 py-3 border-t shrink-0"
              style={{ borderColor: theme.border }}
            >
              <div className="flex items-center gap-2 min-w-0 pr-4">
                <span className="text-sm font-bold truncate" style={{ color: theme.textPrimary }} title={title}>
                  {title}
                </span>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0"
                  style={{ backgroundColor: theme.accentBg, color: theme.primary }}
                >
                  {normalizedType}
                </span>
              </div>

              <div className="flex items-center gap-3 ml-auto shrink-0">
                <button
                  type="button"
                  className="px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5 cursor-pointer"
                  style={{ borderColor: theme.border, color: theme.textSecondary }}
                  onClick={onClose}
                >
                  Close
                </button>

                {onDownload && (
                  <button
                    type="button"
                    onClick={onDownload}
                    disabled={isDownloading}
                    className="px-5 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all hover:brightness-110 disabled:opacity-60 cursor-pointer"
                    style={{ backgroundColor: theme.primary, color: "#FFFFFF" }}
                  >
                    {isDownloading ? (
                      <RotateCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    {isDownloading ? "Preparing..." : "Download"}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
