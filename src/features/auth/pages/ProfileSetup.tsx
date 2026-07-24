import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { getAskTheme } from "../../ask/constants/theme";
import SetupHeader from "../components/SetupHeader";
import Step1LevelDepartment from "../components/Step1LevelDepartment";
import Step2Goals from "../components/Step2Goals";
import Step3ProfilePhoto from "../components/Step3ProfilePhoto";
import { MAX_GOALS } from "../../../constants/profile";
import { profileService } from "../../../services/profileService";
import type { ProfileSetupData } from "../../../types/ProfileSetup";
import type { AsyncStatus } from "../../../types/async";
import {
  getUserFriendlyError,
  logTechnicalError,
} from "../../../lib/errors/getUserFriendlyError";

const TOTAL_STEPS = 3;

// Slide-and-fade transition for step changes, direction-aware so that
// moving forward glides left-to-right and moving back reverses smoothly.
const stepVariants = {
  enter: (direction: number) => ({
    x: direction >= 0 ? 24 : -24,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction >= 0 ? -24 : 24,
    opacity: 0,
  }),
};

const ProfileSetup = () => {
  const navigate = useNavigate();
  const theme = getAskTheme(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);
  const [direction, setDirection] = useState(1);
  const [saveStatus, setSaveStatus] = useState<AsyncStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isSaving = saveStatus === "loading";
  const [formData, setFormData] = useState<ProfileSetupData>({
    department: "",
    currentLevel: "",
    goals: [],
    preferredMode: "anonymous",
    profilePhoto: null,
  });

  const goToStep = (step: number) => {
    setDirection(step >= currentStep ? 1 : -1);
    setCurrentStep(step);
    setMaxStepReached((prev) => Math.max(prev, step));
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigate("/");
    } else {
      goToStep(currentStep - 1);
    }
  };

  // Lets the user move freely between the 1st, 2nd, and 3rd steps (and back)
  // via the progress indicator, without skipping ahead of what they've reached.
  const handleStepClick = (step: number) => {
    if (step === currentStep || step > maxStepReached) return;
    goToStep(step);
  };

  const handleToggleGoal = (goal: string) => {
    setFormData((prev) => {
      const isSelected = prev.goals.includes(goal);

      if (isSelected) {
        return { ...prev, goals: prev.goals.filter((g) => g !== goal) };
      }

      if (prev.goals.length >= MAX_GOALS) return prev;

      return { ...prev, goals: [...prev.goals, goal] };
    });
  };

  const handleComplete = async () => {
    if (isSaving) return; // guard against double-submits (e.g. double-click)

    setSaveStatus("loading");
    setErrorMessage(null);

    try {
      await profileService.saveProfile({
        level: formData.currentLevel,
        department: formData.department,
        goals: formData.goals,
        preferredMode: formData.preferredMode,
      });

      setSaveStatus("success");
      navigate("/feed");
    } catch (error) {
      logTechnicalError("[ProfileSetup] Failed to save profile:", error);
      setErrorMessage(getUserFriendlyError(error));
      setSaveStatus("error");
    }
  };

  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: theme.bg, color: theme.textPrimary }}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col px-5 pb-8 pt-6">
        <SetupHeader
          theme={theme}
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          maxStepReached={maxStepReached}
          onBack={handleBack}
          onStepClick={handleStepClick}
        />

        <div className="mt-8 flex flex-1 flex-col overflow-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 340, damping: 32, mass: 0.9 }}
              className="flex flex-1 flex-col"
            >
              {currentStep === 1 && (
                <Step1LevelDepartment
                  theme={theme}
                  currentLevel={formData.currentLevel}
                  department={formData.department}
                  onLevelChange={(level) =>
                    setFormData((prev) => ({ ...prev, currentLevel: level }))
                  }
                  onDepartmentChange={(department) =>
                    setFormData((prev) => ({ ...prev, department }))
                  }
                  onContinue={() => goToStep(2)}
                />
              )}

              {currentStep === 2 && (
                <Step2Goals
                  theme={theme}
                  selectedGoals={formData.goals}
                  onToggleGoal={handleToggleGoal}
                  onContinue={() => goToStep(3)}
                />
              )}

              {currentStep === 3 && (
                <Step3ProfilePhoto
                  theme={theme}
                  profilePhoto={formData.profilePhoto}
                  onPhotoChange={(file) =>
                    setFormData((prev) => ({ ...prev, profilePhoto: file }))
                  }
                  onFinish={handleComplete}
                  onSkip={handleComplete}
                  isSaving={isSaving}
                  errorMessage={errorMessage}
                  onRetry={handleComplete}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
