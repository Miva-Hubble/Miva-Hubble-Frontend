import { useState } from "react";
import { Download, Eye, File, FileText, Heart, BookOpen, RotateCw, User } from "lucide-react";
import type { Resource } from "../../../types/resource";
import type { VaultTheme } from "../constants/theme";
import { useResourceDownload } from "../hooks/useResourceDownload";
import { ImageWithFallback } from "./ImageWithFallback";
import ResourcePreviewModal from "./ResourcePreviewModal";

// Fixed book-cover dimensions (2:3 ratio) — closely matches real book
// proportions while staying compact in a dense grid. Only applied when a
// real cover exists; cards without one skip the image slot entirely.
const COVER_WIDTH = 80;
const COVER_HEIGHT = 80;

function getFileIcon(fileType: string) {
  switch (fileType.toUpperCase()) {
    case "PDF":
      return <FileText className="w-5 h-5" />;
    case "EPUB":
      return <BookOpen className="w-5 h-5" />;
    case "DOC":
    case "DOCX":
      return <File className="w-5 h-5" />;
    default:
      return <FileText className="w-5 h-5" />;
  }
}

function formatCount(value: number): string {
  return value > 1000 ? `${(value / 1000).toFixed(1)}k` : String(value);
}

interface ResourceCardProps {
  resource: Resource;
  theme: VaultTheme;
}

export default function ResourceCard({ resource, theme }: ResourceCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const {
    isDownloading,
    isPreviewing,
    isPreviewOpen,
    previewUrl,
    error,
    download,
    preview,
    closePreview,
  } = useResourceDownload();
  const hasCover = Boolean(resource.coverImageUrl);

  return (
    <>
      <article
        className="rounded-2xl border overflow-hidden flex flex-col transition-all duration-300 hover:border-slate-600 hover:bg-white/[0.02]"
        style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
      >
        {/* Icon/heart row */}
        <div className="flex justify-between items-start p-5 pb-0 gap-3">
          {hasCover ? (
            <div
              className="relative shrink-0 overflow-hidden rounded-lg"
              style={{ width: COVER_WIDTH, height: COVER_HEIGHT, backgroundColor: theme.accentBg }}
            >
              <ImageWithFallback
                src={resource.coverImageUrl!}
                alt={resource.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: theme.accentBg, color: theme.textSecondary }}
            >
              {getFileIcon(resource.fileType)}
            </div>
          )}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-1.5 rounded-full transition-colors hover:bg-white/10 cursor-pointer ${
              isLiked ? "text-rose-500" : "text-slate-400 hover:text-rose-400"
            } shrink-0`}
            aria-label="Save to favorites"
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500" : ""}`} />
          </button>
        </div>

        <div className="p-5 pt-4 flex flex-col flex-1">
          <div className="text-[11px] font-bold tracking-wider uppercase mb-2" style={{ color: theme.textMuted }}>
            {resource.courseCode} · {resource.fileType}
          </div>

          <h3 className="text-base font-bold mb-2 leading-snug line-clamp-2" style={{ color: theme.textPrimary }}>
            {resource.title}
          </h3>
          <p className="text-xs line-clamp-2 mb-4" style={{ color: theme.textSecondary }}>
            {resource.courseName}
          </p>

          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-[11px] font-medium px-2 py-1 rounded"
              style={{ backgroundColor: theme.accentBg, color: theme.textSecondary }}
            >
              Level {resource.level}
            </span>
            <span
              className="text-[11px] font-medium px-2 py-1 rounded"
              style={{ backgroundColor: theme.accentBg, color: theme.textSecondary }}
            >
              CS
            </span>
          </div>

          <div className="flex-1" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: theme.accentBg, color: theme.textSecondary }}
              >
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold" style={{ color: theme.textPrimary }}>
                {resource.uploadedBy}
              </span>
            </div>
          </div>

          {/* Stats row - displays exact server values without client-side spoofing */}
          <div className="flex items-center justify-between mb-4 text-[11px]" style={{ color: theme.textMuted }}>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{formatCount(resource.stats?.views ?? 0)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-3.5 h-3.5" />
                <span>{formatCount(resource.stats?.downloads ?? 0)}</span>
              </div>
            </div>
            <span>{resource.timestamp}</span>
          </div>

          {error && !isPreviewOpen && (
            <p className="text-[11px] mb-2" style={{ color: "#F87171" }} role="alert">
              {error}
            </p>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => download(resource.id, resource.title)}
              disabled={isDownloading}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-60 cursor-pointer"
              style={{ backgroundColor: theme.primary, color: "#FFFFFF" }}
            >
              {isDownloading ? <RotateCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isDownloading ? "Preparing..." : "Download"}
            </button>
            <button
              onClick={() => preview(resource.id, resource.fileType)}
              disabled={isPreviewing}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5 disabled:opacity-60 cursor-pointer"
              style={{ borderColor: theme.border, color: theme.textSecondary }}
            >
              {isPreviewing ? <RotateCw className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
              {isPreviewing ? "Opening..." : "Preview"}
            </button>
          </div>
        </div>
      </article>

      <ResourcePreviewModal
        open={isPreviewOpen}
        onClose={closePreview}
        theme={theme}
        title={resource.title}
        fileType={resource.fileType}
        previewUrl={previewUrl}
        isLoading={isPreviewing}
        error={error}
        onDownload={() => download(resource.id, resource.title)}
        isDownloading={isDownloading}
      />
    </>
  );
}
