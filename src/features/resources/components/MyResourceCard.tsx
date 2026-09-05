import { motion } from "motion/react";
import { FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import type { StudentResourceDto } from "../../../types/studentResource";
import type { VaultTheme } from "../constants/theme";
import { formatRelativeTime } from "../../../lib/date/formatRelativeTime";

interface MyResourceCardProps {
  resource: StudentResourceDto;
  theme: VaultTheme;
  index: number;
}

export default function MyResourceCard({ resource, theme, index }: MyResourceCardProps) {
  const isPending = resource.status === "PENDING_REVIEW" || resource.status === "DRAFT";
  const isApproved = resource.status === "APPROVED";
  const isRejected = resource.status === "REJECTED";

  const sizeMb = (resource.sizeBytes / (1024 * 1024)).toFixed(1);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-sm transition-all duration-200 hover:border-white/20"
      style={{
        backgroundColor: theme.cardBg,
        border: "1px solid rgba(255, 255, 255, 0.07)",
      }}
    >
      <div>
        {/* Header: Resource Type & Status Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className="text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              color: theme.textSecondary,
            }}
          >
            {resource.resourceType.replace("_", " ")}
          </span>

          {/* Light Green Status Badge for Uploaded / Pending Review */}
          {isPending && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Uploaded • Pending Review</span>
            </div>
          )}

          {isApproved && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Approved & Published</span>
            </div>
          )}

          {isRejected && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Needs Revision</span>
            </div>
          )}
        </div>

        {/* Book Title & Course */}
        <h3 className="text-sm sm:text-base font-bold mb-1 line-clamp-2 leading-snug" style={{ color: theme.textPrimary }}>
          {resource.title}
        </h3>
        <p className="text-xs text-slate-400 mb-3 line-clamp-1">
          {resource.courseTitle}
        </p>

        {/* Level & Department Badges */}
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          <span
            className="text-[10px] sm:text-[11px] font-medium px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", color: theme.textSecondary }}
          >
            Level {resource.level}
          </span>
          <span
            className="text-[10px] sm:text-[11px] font-medium px-2.5 py-0.5 rounded-full truncate max-w-[140px]"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", color: theme.textSecondary }}
          >
            {resource.department}
          </span>
        </div>

        {resource.description && (
          <p className="text-xs text-slate-400/90 line-clamp-2 mb-3 leading-relaxed">
            {resource.description}
          </p>
        )}

        {isRejected && resource.rejectionReason && (
          <div className="p-2.5 rounded-xl text-xs mb-3 bg-rose-500/10 text-rose-300 border border-rose-500/20">
            <strong>Admin Note:</strong> {resource.rejectionReason}
          </div>
        )}
      </div>

      {/* Footer: Size & Relative Time */}
      <div
        className="pt-2.5 border-t flex items-center justify-between text-[11px] text-slate-400"
        style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}
      >
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>{sizeMb} MB</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{formatRelativeTime(resource.createdAt)}</span>
        </div>
      </div>
    </motion.article>
  );
}
