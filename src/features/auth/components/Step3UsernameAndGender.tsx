import { useState, useEffect } from "react";
import { AlertCircle, User, CheckCircle2, XCircle } from "lucide-react";
import type { AskTheme } from "../../ask/constants/theme";
import ContinueButton from "./ContinueButton";
import { profileService } from "../../../services/profileService";
import type { Gender } from "../../../types/ProfileSetup";

interface Step3UsernameAndGenderProps {
  theme: AskTheme;
  username: string;
  gender: Gender | "";
  onUsernameChange: (username: string) => void;
  onGenderChange: (gender: Gender) => void;
  onFinish: () => void;
  isSaving?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
}

const Step3UsernameAndGender = ({
  theme,
  username,
  gender,
  onUsernameChange,
  onGenderChange,
  onFinish,
  isSaving = false,
  errorMessage,
  onRetry,
}: Step3UsernameAndGenderProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isUsernameValid, setIsUsernameValid] = useState(false);

  useEffect(() => {
    // Basic validation
    if (!username) {
      setUsernameError(null);
      setIsUsernameValid(false);
      return;
    }

    if (username.length < 3 || username.length > 15) {
      setUsernameError("Username must be between 3 and 15 characters.");
      setIsUsernameValid(false);
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      setUsernameError("Username can only contain alphanumeric characters.");
      setIsUsernameValid(false);
      return;
    }

    // Uniqueness check debounce
    const delayDebounceFn = setTimeout(async () => {
      setIsChecking(true);
      try {
        const isAvailable = await profileService.checkUsername(username);
        if (isAvailable) {
          setUsernameError(null);
          setIsUsernameValid(true);
        } else {
          setUsernameError("This username is already taken.");
          setIsUsernameValid(false);
        }
      } catch (err) {
        setUsernameError("Failed to check username availability.");
        setIsUsernameValid(false);
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [username]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1">
        <h1
          className="mb-2 text-2xl font-bold"
          style={{ color: theme.textPrimary }}
        >
          Claim your Identity
        </h1>
        <p className="mb-8 text-sm" style={{ color: theme.textSecondary }}>
          Set up your unique username and gender. Your profile avatar will be automatically generated based on these choices and your rank!
        </p>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 text-red-500 shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-medium leading-relaxed text-red-500">
                {errorMessage}
              </p>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: theme.textPrimary }}>
              Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-500">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => onUsernameChange(e.target.value)}
                placeholder="e.g. scholar123"
                className="w-full pl-12 pr-10 py-3 rounded-xl bg-white/5 border focus:outline-none transition-colors"
                style={{ 
                  borderColor: usernameError ? '#ef4444' : isUsernameValid ? '#22c55e' : theme.border,
                  color: theme.textPrimary
                }}
              />
              {isChecking && (
                <span className="absolute right-4 top-3.5 flex w-5 h-5">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                </span>
              )}
              {!isChecking && isUsernameValid && (
                <CheckCircle2 className="absolute right-4 top-3.5 w-5 h-5 text-green-500" />
              )}
              {!isChecking && usernameError && (
                <XCircle className="absolute right-4 top-3.5 w-5 h-5 text-red-500" />
              )}
            </div>
            {usernameError && (
              <p className="mt-2 text-xs text-red-400">{usernameError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: theme.textPrimary }}>
              Gender
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["male", "female"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => onGenderChange(g)}
                  className="py-3 px-2 rounded-xl text-sm font-medium transition-all capitalize border"
                  style={{
                    backgroundColor: gender === g ? theme.primary + '22' : 'transparent',
                    borderColor: gender === g ? theme.primary : theme.border,
                    color: gender === g ? theme.primary : theme.textSecondary,
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <ContinueButton
          theme={theme}
          onClick={onFinish}
          disabled={!isUsernameValid || !gender || isSaving}
        >
          {isSaving ? "Saving..." : "Finish Setup"}
        </ContinueButton>
      </div>
    </div>
  );
};

export default Step3UsernameAndGender;
