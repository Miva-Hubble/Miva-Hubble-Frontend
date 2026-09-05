import { useState } from "react";
import { Download, Eye, FileText } from "lucide-react";
import type { VaultResourceDto } from "../../../types/vaultResource";
import type { VaultTheme } from "../constants/theme";
import { vaultService } from "../services/vaultService";
import { getUserFriendlyError } from "../../../lib/errors/getUserFriendlyError";

/** Card for GET /api/vault resources. It must never call the admin Books URL endpoint. */
export function VaultResourceCard({ resource, theme }: { resource: VaultResourceDto; theme: VaultTheme }) {
  const [loading, setLoading] = useState<"preview" | "download" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const access = async (mode: "preview" | "download") => {
    setLoading(mode); setError(null);
    try {
      const url = await vaultService.getResourceUrl(resource.id, mode);
      if (mode === "preview") window.open(url, "_blank", "noopener,noreferrer");
      else { const link = document.createElement("a"); link.href = url; link.download = resource.title; link.click(); }
    } catch (cause) { setError(getUserFriendlyError(cause)); } finally { setLoading(null); }
  };

  return <article className="rounded-3xl p-5 border flex flex-col" style={{ backgroundColor: theme.cardBg, borderColor: "rgba(255,255,255,.07)" }}>
    <div className="flex items-start justify-between gap-3"><div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: theme.accentBg, color: theme.primary }}><FileText className="w-5 h-5" /></div><span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: `${theme.primary}1A`, color: theme.primary }}>{resource.resourceType.replace("_", " ")}</span></div>
    <p className="text-[11px] uppercase tracking-wide mt-4" style={{ color: theme.textMuted }}>{resource.courseCode} · {resource.fileFormat}</p>
    <h3 className="font-bold mt-1">{resource.title}</h3><p className="text-xs mt-2 line-clamp-2 min-h-9" style={{ color: theme.textSecondary }}>{resource.description || resource.courseTitle}</p>
    <div className="flex gap-2 mt-5"><button onClick={() => access("preview")} disabled={loading !== null} className="flex-1 py-2 rounded-xl text-xs font-semibold" style={{ backgroundColor: theme.accentBg, color: theme.textPrimary }}><Eye className="w-3.5 h-3.5 inline mr-1" />{loading === "preview" ? "Opening…" : "Preview"}</button><button onClick={() => access("download")} disabled={loading !== null} className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-950" style={{ backgroundColor: theme.primary }}><Download className={`w-3.5 h-3.5 inline mr-1 ${loading === "download" ? "animate-spin" : ""}`} />{loading === "download" ? "Preparing…" : "Download"}</button></div>
    {error && <p role="alert" className="text-[11px] mt-3 text-rose-400">{error}</p>}
  </article>;
}
