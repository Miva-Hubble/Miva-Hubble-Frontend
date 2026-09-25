import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../components/feedback/ToastProvider";
import { useMyProgress } from "../../resources/hooks/useMyProgress";
import { getAvatarAsset } from "../../../lib/avatar/getAvatarAsset";
import { useTaxonomy } from "../../../hooks/useTaxonomy";
import { profileService } from "../../../services/profileService";
import { getDepartmentCooldownStatus } from "../../../lib/date/departmentCooldown";
import {
  getUserFriendlyError,
  logTechnicalError,
} from "../../../lib/errors/getUserFriendlyError";
import type { AskTheme } from "../../ask/constants/theme";

type EditProfileModalProps = {
  open: boolean;
  onClose: () => void;
  theme: AskTheme;
};

export default function EditProfileModal({ open, onClose, theme }: EditProfileModalProps) {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const { progress } = useMyProgress();
  const { departments, isLoading: isTaxonomyLoading } = useTaxonomy();

  const originalUsername = user?.username || "";
  const originalDepartment = user?.onboarding?.department || "";

  const [username, setUsername] = useState(originalUsername);
  const [department, setDepartment] = useState(originalDepartment);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDepartmentWarning, setShowDepartmentWarning] = useState(false);

  const rank = progress?.rank?.name || "Novice";
  const avatarUrl = getAvatarAsset(user?.gender, rank);

  // Client-side pre-check only — see departmentCooldown.ts. The backend
  // (PATCH /api/user/department) is the real enforcement point regardless
  // of what this says.
  const cooldown = getDepartmentCooldownStatus(user?.onboarding?.departmentChangedAt);

  const handleDepartmentChange = (value: string) => {
    if (cooldown.isLocked && value !== originalDepartment) {
      showToast({
        variant: "warning",
        message: `Department changes are only allowed once every 60 days. You can change it again in ${cooldown.daysRemaining} day${cooldown.daysRemaining === 1 ? "" : "s"}.`,
      });
      return;
    }

    setDepartment(value);
    setShowDepartmentWarning(false);
  };

  const handleSave = async () => {
    const usernameChanged = username !== originalUsername;
    const departmentChanged = department !== originalDepartment;

    if (departmentChanged && cooldown.isLocked) {
      // Defensive backstop — handleDepartmentChange already blocks this,
      // but never trust that a stale `department` state couldn't reach here.
      showToast({
        variant: "warning",
        message: `Department changes are only allowed once every 60 days. You can change it again in ${cooldown.daysRemaining} day${cooldown.daysRemaining === 1 ? "" : "s"}.`,
      });
      return;
    }

    if (departmentChanged && !showDepartmentWarning) {
      setShowDepartmentWarning(true);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (usernameChanged) {
        await profileService.updateUsername(username);
      }

      if (departmentChanged) {
        await profileService.updateDepartment(department);
      }

      await refreshUser();

      if (usernameChanged || departmentChanged) {
        showToast({ variant: "success", message: "Profile updated." });
      }

      onClose();
    } catch (err) {
      logTechnicalError("[EditProfileModal] Failed to save profile:", err);
      setError(getUserFriendlyError(err));
    } finally {
      setIsSaving(false);
      setShowDepartmentWarning(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 backdrop-blur-sm bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6"
            style={{ backgroundColor: theme.surface, color: theme.textPrimary }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <h2 className="text-xl font-bold mb-6">Edit Profile</h2>

            <div className="flex flex-col items-center mb-6">
              <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full bg-white/5 object-cover mb-3" />
              <div className="text-center">
                <p className="text-xs font-bold px-3 py-1 rounded-full inline-block tracking-wider" style={{ backgroundColor: theme.primary + '22', color: theme.primary }}>
                  {rank.toUpperCase()}
                </p>
                <p className="text-[11px] mt-1 opacity-60">Avatars evolve automatically with rank.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 opacity-80">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:outline-none transition-colors"
                  placeholder="Choose a unique username"
                  minLength={3}
                  maxLength={15}
                />
                <p className="text-[10px] mt-1 opacity-50">3-15 alphanumeric characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 opacity-80">Department</label>
                <select
                  value={department}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  disabled={isTaxonomyLoading}
                  className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-white/30 focus:outline-none transition-colors appearance-none"
                >
                  <option value="" disabled>Select your department</option>
                  {departments.map((dep) => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
                {cooldown.isLocked && (
                  <p className="text-[10px] mt-1 opacity-50">
                    You can change your department again in {cooldown.daysRemaining} day{cooldown.daysRemaining === 1 ? "" : "s"}.
                  </p>
                )}
              </div>

              {showDepartmentWarning && (
                <div className="mt-4 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0" />
                  <p className="text-xs text-orange-200">
                    <strong>Are you sure?</strong> You will not be able to change your department again for the next 60 days.
                  </p>
                </div>
              )}

              {error && (
                <div className="text-red-400 text-xs text-center mt-2">{error}</div>
              )}

              <button
                onClick={handleSave}
                disabled={isSaving || !username || !department}
                className="w-full mt-6 py-3 rounded-xl font-bold text-slate-950 transition-transform active:scale-95 flex items-center justify-center gap-2"
                style={{ backgroundColor: theme.primary }}
              >
                {isSaving ? "Saving..." : (showDepartmentWarning ? "Confirm & Save" : "Save Changes")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
