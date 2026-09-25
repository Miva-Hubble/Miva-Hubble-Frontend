import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAskTheme } from "../../ask/constants/theme";
import Step3UsernameAndGender from "../components/Step3UsernameAndGender";
import { profileService } from "../../../services/profileService";
import { useAuth } from "../../../hooks/useAuth";
import type { Gender } from "../../../types/ProfileSetup";
import type { AsyncStatus } from "../../../types/async";
import {
  getUserFriendlyError,
  logTechnicalError,
} from "../../../lib/errors/getUserFriendlyError";

/**
 * /claim-identity — single lightweight screen for legacy pre-migration
 * accounts that are onboarded but never claimed a username/gender.
 * Deliberately reuses Step3UsernameAndGender as-is rather than a bespoke
 * component: level/department/goals are already set for these users, so
 * this is the exact sub-flow, with no step indicator/back button since
 * there's nothing to step back to.
 */
const ClaimIdentity = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const theme = getAskTheme(true);

  const [username, setUsername] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [saveStatus, setSaveStatus] = useState<AsyncStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isSaving = saveStatus === "loading";

  const handleFinish = async () => {
    if (isSaving || !gender) return;

    setSaveStatus("loading");
    setErrorMessage(null);

    try {
      await profileService.claimIdentity({ username, gender });
      await refreshUser();
      setSaveStatus("success");
      navigate("/dashboard");
    } catch (error) {
      logTechnicalError("[ClaimIdentity] Failed to claim identity:", error);
      setErrorMessage(getUserFriendlyError(error));
      setSaveStatus("error");
    }
  };

  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: theme.bg, color: theme.textPrimary }}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col px-5 pb-8 pt-10">
        <Step3UsernameAndGender
          theme={theme}
          username={username}
          gender={gender}
          onUsernameChange={setUsername}
          onGenderChange={setGender}
          onFinish={handleFinish}
          isSaving={isSaving}
          errorMessage={errorMessage}
          onRetry={handleFinish}
        />
      </div>
    </div>
  );
};

export default ClaimIdentity;
