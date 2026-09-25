import { useState } from "react";
import { Download, Eye, FileText, BookOpen, User, Heart, Clock } from "lucide-react";
import type { VaultResourceDto } from "../../../types/vaultResource";
import type { VaultTheme } from "../constants/theme";
import { useDownloadVaultResource } from "../hooks/useDownloadVaultResource";
import { useRelativeTime } from "../hooks/useRelativeTime";
import VaultPreviewModal from "./VaultPreviewModal";

/**
 * Card for GET /api/vault resources — the unified feed of admin-curated
 * Books and student-approved StudentResources (Gate 13). It must never call
 * the admin Books URL endpoint directly; both sources are fetched through
 * the same /api/vault/:id/url endpoint, which resolves the right table
 * server-side from `resource.source`.
 *
 * The signed preview URL itself is fetched by VaultPreviewModal via React
 * Query (`useVaultResourceUrl`, gated on `open`) — this card only owns
 * whether the modal is open, not the fetch. Download is the one genuinely
 * imperative action here (fetch a URL, immediately click an `<a download>`),
 * so it goes through `useMutation` (`useDownloadVaultResource`) instead.
 */
function formatCount(value: number): string {
  return value > 1000 ? `${(value / 1000).toFixed(1)}k` : String(value);
}

export function VaultResourceCard({ resource, theme }: { resource: VaultResourceDto; theme: VaultTheme }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { download, isDownloading, isError, errorMessage } = useDownloadVaultResource();
  const relativeTime = useRelativeTime(resource.createdAt);

  const isBook = resource.source === "BOOK";

  return <>
    <article className="rounded-3xl p-5 border flex flex-col" style={{ backgroundColor: theme.cardBg, borderColor: "rgba(255,255,255,.07)" }}>
    <div className="flex items-start justify-between gap-3">
      {resource.coverImageUrl ? (
        <img src={resource.coverImageUrl} alt="" className="w-10 h-10 rounded-2xl object-cover shrink-0" />
      ) : (
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: theme.accentBg, color: theme.primary }}>
          {isBook ? <BookOpen className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
        </div>
      )}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: `${theme.primary}1A`, color: theme.primary }}>{resource.resourceType.replace("_", " ")}</span>
        <button
          onClick={() => setIsLiked((prev) => !prev)}
          aria-label={isLiked ? "Remove from favorites" : "Save to favorites"}
          className={`p-1.5 rounded-full transition-colors hover:bg-white/10 cursor-pointer ${isLiked ? "text-rose-500" : "text-slate-400 hover:text-rose-400"}`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500" : ""}`} />
        </button>
      </div>
    </div>
    <p className="text-[11px] uppercase tracking-wide mt-4" style={{ color: theme.textMuted }}>
      {isBook ? (resource.uploaderName ? `By ${resource.uploaderName}` : "Curated by Miva Hubble") : resource.courseCode} · {resource.fileFormat}
    </p>
    <h3 className="font-bold mt-1">{resource.title}</h3>
    <p className="text-xs mt-2 line-clamp-2 min-h-9" style={{ color: theme.textSecondary }}>
      {resource.description || resource.courseTitle}
    </p>
    {!isBook && resource.uploaderName && (
      <div className="flex items-center gap-1.5 mt-2 text-[11px]" style={{ color: theme.textMuted }}>
        <User className="w-3 h-3" />
        <span>Uploaded by {resource.uploaderName}</span>
      </div>
    )}
    {/* isBook author is already shown in the meta line above — no separate row needed here */}
    <div className="flex items-center justify-between mt-2">
      {resource.downloadCount !== null ? (
        <div className="flex items-center gap-1 text-[11px]" style={{ color: theme.textMuted }}>
          <Download className="w-3 h-3" />
          <span>{formatCount(resource.downloadCount)} downloads</span>
        </div>
      ) : (
        <span />
      )}
      <div className="flex items-center gap-1 text-[11px]" style={{ color: theme.textMuted }}>
        <Clock className="w-3 h-3" />
        <span>{relativeTime}</span>
      </div>
    </div>
    <div className="flex gap-2 mt-5">
      <button
        onClick={() => setIsPreviewOpen(true)}
        className="flex-1 py-2 rounded-xl text-xs font-semibold cursor-pointer"
        style={{ backgroundColor: theme.accentBg, color: theme.textPrimary }}
      >
        <Eye className="w-3.5 h-3.5 inline mr-1" />
        Preview
      </button>
      <button
        onClick={() => download(resource.id, resource.title)}
        disabled={isDownloading}
        className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-950 disabled:opacity-60 cursor-pointer"
        style={{ backgroundColor: theme.primary }}
      >
        <Download className={`w-3.5 h-3.5 inline mr-1 ${isDownloading ? "animate-spin" : ""}`} />
        {isDownloading ? "Preparing…" : "Download"}
      </button>
    </div>
    {isError && errorMessage && <p role="alert" className="text-[11px] mt-3 text-rose-400">{errorMessage}</p>}
  </article>

    <VaultPreviewModal
      open={isPreviewOpen}
      onClose={() => setIsPreviewOpen(false)}
      resourceId={resource.id}
      title={resource.title}
      fileFormat={resource.fileFormat}
      theme={theme}
      onDownload={() => download(resource.id, resource.title)}
      isDownloading={isDownloading}
    />
  </>;
}
