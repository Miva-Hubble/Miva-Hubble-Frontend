import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAskTheme } from "../../ask/constants/theme";
import SetupHeader from "../components/SetupHeader";
import Step1LevelDepartment from "../components/Step1LevelDepartment";
import Step2Goals from "../components/Step2Goals";
import Step3ProfilePhoto from "../components/Step3ProfilePhoto";
import { MAX_GOALS } from "../../../constants/profile";
import { profileService } from "../../../services/profileService";
import type { ProfileSetupData } from "../../../types/ProfileSetup";

const TOTAL_STEPS = 3;

const ProfileSetup = () => {
  const navigate = useNavigate();
  const theme = getAskTheme(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileSetupData>({
    department: "",
    currentLevel: "",
    goals: [],
    profilePhoto: null,
  });

  const handleBack = () => {
    if (currentStep === 1) {
      navigate("/");
    } else {
      setCurrentStep((step) => step - 1);
    }
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

  const handleComplete = async (skipPhoto = false) => {
    setIsSaving(true);
    await profileService.saveProfile({
      department: formData.department,
      currentLevel: formData.currentLevel,
      goals: formData.goals,
      profilePhoto: skipPhoto ? null : formData.profilePhoto,
    });
    navigate("/feed");
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
          onBack={handleBack}
        />

        <div className="mt-8 flex flex-1 flex-col">
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
              onContinue={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <Step2Goals
              theme={theme}
              selectedGoals={formData.goals}
              onToggleGoal={handleToggleGoal}
              onContinue={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 3 && (
            <Step3ProfilePhoto
              theme={theme}
              profilePhoto={formData.profilePhoto}
              onPhotoChange={(file) =>
                setFormData((prev) => ({ ...prev, profilePhoto: file }))
              }
              onFinish={() => handleComplete(false)}
              onSkip={() => handleComplete(true)}
              isSaving={isSaving}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
