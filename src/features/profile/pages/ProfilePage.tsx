import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Check,
  X,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Archive,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../components/feedback/ToastProvider";
import { useMyProgress } from "../../resources/hooks/useMyProgress";
import { useMyStudentResources } from "../../resources/hooks/useMyStudentResources";
import { getAvatarAsset } from "../../../lib/avatar/getAvatarAsset";
import { useTaxonomy } from "../../../hooks/useTaxonomy";
import { profileService } from "../../../services/profileService";
import { getDepartmentCooldownStatus } from "../../../lib/date/departmentCooldown";
import {
  getUserFriendlyError,
  logTechnicalError,
} from "../../../lib/errors/getUserFriendlyError";
import { getDashboardTheme } from "../../dashboard/constants/theme";
import type { StudentResourceDto, StudentResourceStatus } from "../../../types/studentResource";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const RANK_GRADIENTS: Record<string, string> = {
  Novice:   "from-slate-400 via-slate-500 to-slate-600",
  Amateur:  "from-emerald-400 via-teal-500 to-cyan-500",
  Pro:      "from-violet-400 via-purple-500 to-fuchsia-500",
  Master:   "from-amber-400 via-orange-500 to-rose-500",
  Ultimate: "from-yellow-300 via-amber-400 to-orange-500",
};

const RANK_COLORS: Record<string, string> = {
  Novice:   "#94A3B8",
  Amateur:  "#10B981",
  Pro:      "#8B5CF6",
  Master:   "#F59E0B",
  Ultimate: "#FBBF24",
};

const STATUS_CONFIG: Record<StudentResourceStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  DRAFT:          { label: "Draft",          icon: FileText,    color: "#94A3B8", bg: "rgba(148,163,184,0.12)" },
  PENDING_REVIEW: { label: "Pending Review", icon: Clock,       color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  APPROVED:       { label: "Approved",       icon: CheckCircle2, color: "#22C55E", bg: "rgba(34,197,94,0.12)" },
  REJECTED:       { label: "Rejected",       icon: XCircle,     color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
  ARCHIVED:       { label: "Archived",       icon: Archive,     color: "#6366F1", bg: "rgba(99,102,241,0.12)" },
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatPill({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-lg font-bold leading-none">{value}</span>
      <span className="text-[11px] opacity-50 leading-none">{label}</span>
    </div>
  );
}

function ResourceCard({ resource, theme }: { resource: StudentResourceDto; theme: ReturnType<typeof getDashboardTheme> }) {
  const cfg = STATUS_CONFIG[resource.status];
  const Icon = cfg.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4 flex items-start gap-3"
      style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: cfg.bg }}>
        <Icon className="w-4 h-4" style={{ color: cfg.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-snug truncate" style={{ color: theme.textPrimary }}>
          {resource.title}
        </p>
        <p className="text-[11px] mt-0.5 opacity-50" style={{ color: theme.textSecondary }}>
          {resource.courseTitle} · {formatBytes(resource.sizeBytes)}
        </p>
        <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
          {cfg.label}
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Inline Edit Form
// ---------------------------------------------------------------------------

function InlineEditForm({
  theme,
  user,
  departments,
  isTaxonomyLoading,
  onDone,
}: {
  theme: ReturnType<typeof getDashboardTheme>;
  user: ReturnType<typeof useAuth>["user"];
  departments: string[];
  isTaxonomyLoading: boolean;
  onDone: () => void;
}) {
  const { showToast } = useToast();
  const { refreshUser } = useAuth();

  const originalUsername = user?.username || "";
  const originalDepartment = user?.onboarding?.department || "";

  const [username, setUsername] = useState(originalUsername);
  const [department, setDepartment] = useState(originalDepartment);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeptWarning, setShowDeptWarning] = useState(false);

  const cooldown = getDepartmentCooldownStatus(user?.onboarding?.departmentChangedAt);

  const handleDepartmentChange = (value: string) => {
    if (cooldown.isLocked && value !== originalDepartment) {
      showToast({
        variant: "warning",
        message: `Department locked for ${cooldown.daysRemaining} more day${cooldown.daysRemaining === 1 ? "" : "s"}.`,
      });
      return;
    }
    setDepartment(value);
    setShowDeptWarning(false);
  };

  const handleSave = async () => {
    const usernameChanged = username !== originalUsername;
    const departmentChanged = department !== originalDepartment;

    if (departmentChanged && cooldown.isLocked) {
      showToast({ variant: "warning", message: `Department locked for ${cooldown.daysRemaining} more day${cooldown.daysRemaining === 1 ? "" : "s"}.` });
      return;
    }
    if (departmentChanged && !showDeptWarning) {
      setShowDeptWarning(true);
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      if (usernameChanged) await profileService.updateUsername(username);
      if (departmentChanged) await profileService.updateDepartment(department);
      await refreshUser();
      if (usernameChanged || departmentChanged) showToast({ variant: "success", message: "Profile updated." });
      onDone();
    } catch (err) {
      logTechnicalError("[ProfilePage] Failed to save profile:", err);
      setError(getUserFriendlyError(err));
    } finally {
      setIsSaving(false);
      setShowDeptWarning(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mt-6 rounded-2xl p-5 space-y-4"
      style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}
    >
      {/* Username */}
      <div>
        <label className="block text-xs font-semibold mb-1.5 opacity-70" style={{ color: theme.textPrimary }}>
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm transition-colors focus:outline-none"
          style={{
            backgroundColor: theme.input,
            border: `1px solid ${theme.border}`,
            color: theme.textPrimary,
          }}
          placeholder="Choose a unique username"
          minLength={3}
          maxLength={15}
        />
        <p className="text-[10px] mt-1 opacity-40" style={{ color: theme.textSecondary }}>
          3–15 alphanumeric characters
        </p>
      </div>

      {/* Department */}
      <div>
        <label className="block text-xs font-semibold mb-1.5 opacity-70" style={{ color: theme.textPrimary }}>
          Department
        </label>
        <select
          value={department}
          onChange={(e) => handleDepartmentChange(e.target.value)}
          disabled={isTaxonomyLoading}
          className="w-full px-4 py-3 rounded-xl text-sm appearance-none transition-colors focus:outline-none"
          style={{
            backgroundColor: theme.input,
            border: `1px solid ${theme.border}`,
            color: theme.textPrimary,
          }}
        >
          <option value="" disabled>Select your department</option>
          {departments.map((dep) => (
            <option key={dep} value={dep}>{dep}</option>
          ))}
        </select>
        {cooldown.isLocked && (
          <p className="text-[10px] mt-1 opacity-40" style={{ color: theme.textSecondary }}>
            Locked for {cooldown.daysRemaining} more day{cooldown.daysRemaining === 1 ? "" : "s"}.
          </p>
        )}
      </div>

      {/* Department change warning */}
      {showDeptWarning && (
        <div className="flex gap-2.5 p-3 rounded-xl" style={{ backgroundColor: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)" }}>
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300 leading-snug">
            <strong>Are you sure?</strong> You won't be able to change your department again for 60 days.
          </p>
        </div>
      )}

      {error && <p className="text-xs text-red-400 text-center">{error}</p>}

      {/* Action buttons */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={onDone}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          style={{ backgroundColor: theme.border, color: theme.textSecondary }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving || !username || !department}
          className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-1.5"
          style={{ backgroundColor: theme.primary, color: "#fff" }}
        >
          {isSaving ? (
            "Saving…"
          ) : showDeptWarning ? (
            <><Check className="w-3.5 h-3.5" /> Confirm &amp; Save</>
          ) : (
            <><Check className="w-3.5 h-3.5" /> Save Changes</>
          )}
        </button>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main Profile Page
// ---------------------------------------------------------------------------

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { progress } = useMyProgress();
  const { resources } = useMyStudentResources();
  const { departments, isLoading: isTaxonomyLoading } = useTaxonomy();

  // Theme — read from localStorage same way Dashboard does
  const [isDark] = useState(() => {
    try {
      return localStorage.getItem("hubble-dark-mode") !== "false";
    } catch {
      return true;
    }
  });
  const theme = getDashboardTheme(isDark);

  const [isEditing, setIsEditing] = useState(false);

  const rank = progress?.rank?.name || "Novice";
  const avatarUrl = getAvatarAsset(user?.gender, rank);
  const rankColor = RANK_COLORS[rank] ?? "#94A3B8";
  const rankGradient = RANK_GRADIENTS[rank] ?? RANK_GRADIENTS.Novice;

  const approvedCount = resources.filter((r) => r.status === "APPROVED").length;
  const uploadCount = resources.length;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: theme.bg, color: theme.textPrimary }}
    >
      {/* ── Top bar ── */}
      <div
        className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 backdrop-blur-xl"
        style={{
          backgroundColor: theme.surface + "CC",
          borderBottom: `1px solid rgba(255,255,255,0.06)`,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: theme.textSecondary }} />
        </button>
        <span className="text-sm font-semibold" style={{ color: theme.textPrimary }}>
          {user?.username ? `@${user.username}` : "Profile"}
        </span>
        <div className="w-9" />
      </div>

      {/* ── Scrollable body ── */}
      <div className="max-w-lg mx-auto px-4 pb-28 pt-6">

        {/* ── Avatar section ── */}
        <div className="flex flex-col items-center">
          {/* Avatar with gradient ring */}
          <div className="relative mb-4">
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${rankGradient} p-[3px] shadow-xl`}>
              <div
                className="w-full h-full rounded-full overflow-hidden"
                style={{ backgroundColor: theme.surface }}
              >
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
            {/* Rank badge */}
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest whitespace-nowrap shadow-lg"
              style={{ backgroundColor: rankColor + "22", color: rankColor, border: `1px solid ${rankColor}44` }}
            >
              {rank.toUpperCase()}
            </div>
          </div>

          {/* Name + username */}
          <div className="mt-4 text-center">
            <h1 className="text-xl font-bold leading-tight" style={{ color: theme.textPrimary }}>
              {user?.name || user?.username || "Hubblite"}
            </h1>
            <p className="text-sm mt-0.5 opacity-50" style={{ color: theme.textSecondary }}>
              @{user?.username || "—"}
            </p>
            {user?.onboarding?.department && (
              <p className="text-xs mt-1 opacity-40" style={{ color: theme.textSecondary }}>
                {user.onboarding.department}
              </p>
            )}
          </div>

          {/* Stats row */}
          <div
            className="mt-5 w-full max-w-xs flex justify-around items-center py-3 px-4 rounded-2xl"
            style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}
          >
            <StatPill value={uploadCount} label="Uploads" />
            <div className="w-px h-6 opacity-20" style={{ backgroundColor: theme.border }} />
            <StatPill value={approvedCount} label="Approved" />
            <div className="w-px h-6 opacity-20" style={{ backgroundColor: theme.border }} />
            <StatPill
              value={progress?.rank?.level ?? 1}
              label="Level"
            />
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex gap-3 w-full max-w-xs">
            <button
              onClick={() => setIsEditing((v) => !v)}
              className="flex-1 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
              style={{
                backgroundColor: isEditing ? theme.primary : "rgba(255,255,255,0.08)",
                color: isEditing ? "#fff" : theme.textPrimary,
                border: `1px solid ${isEditing ? theme.primary : theme.border}`,
              }}
            >
              {isEditing ? <X className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* ── Inline edit form ── */}
        <AnimatePresence>
          {isEditing && (
            <InlineEditForm
              theme={theme}
              user={user}
              departments={departments}
              isTaxonomyLoading={isTaxonomyLoading}
              onDone={() => setIsEditing(false)}
            />
          )}
        </AnimatePresence>

        {/* ── Progress info strip ── */}
        {progress?.rank?.nextRank && (
          <div
            className="mt-6 rounded-2xl p-4 flex items-center justify-between"
            style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}
          >
            <div>
              <p className="text-xs font-semibold opacity-60" style={{ color: theme.textSecondary }}>
                Next rank
              </p>
              <p className="text-sm font-bold mt-0.5" style={{ color: rankColor }}>
                {progress.rank.nextRank.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-60" style={{ color: theme.textSecondary }}>
                {progress.rank.nextRank.resourcesRemaining} upload{progress.rank.nextRank.resourcesRemaining === 1 ? "" : "s"} away
              </p>
              <ChevronRight className="w-4 h-4 ml-auto mt-0.5 opacity-40" style={{ color: theme.textSecondary }} />
            </div>
          </div>
        )}

        {/* ── My Resources section ── */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold opacity-70" style={{ color: theme.textPrimary }}>
              My Resources
            </h2>
            <span className="text-xs opacity-40" style={{ color: theme.textSecondary }}>
              {resources.length} total
            </span>
          </div>

          {resources.length === 0 ? (
            <div
              className="rounded-2xl p-8 text-center"
              style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}
            >
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-20" style={{ color: theme.textMuted }} />
              <p className="text-sm opacity-40" style={{ color: theme.textSecondary }}>
                No uploads yet
              </p>
              <p className="text-xs opacity-30 mt-1" style={{ color: theme.textSecondary }}>
                Head to the Vault to share your first resource
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {resources.map((r) => (
                <ResourceCard key={r.id} resource={r} theme={theme} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
