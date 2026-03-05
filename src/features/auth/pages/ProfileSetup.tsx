import { useState, useCallback } from "react";
import { Navbar } from "../../../components/Layout/NavBar";
import Step1Profile from "../components/Step1Profile";
import Step2Mode from "../components/Step2Mode";
import ProgressBar from "../../../components/ui/ProgressBar";
import { useNavigate } from "react-router-dom";
import type { ProfileSetupData } from "../../../types/ProfileSetup";

const STEP_LABELS = [
  { label: "Profile" },
  { label: "Mode" },
];

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState<ProfileSetupData>({
    displayName: "",
    department: "",
    currentLevel: "100",
    defaultMode: "anonymous",
  });

  const isStep1Valid = formData.displayName.trim() !== "" && formData.department !== "";

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, displayName: e.target.value });
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, department: e.target.value });
  };

  const handleLevelChange = (level: string) => {
    setFormData({ ...formData, currentLevel: level });
  };

  const handleModeChange = (mode: "anonymous" | "identified") => {
    setFormData({ ...formData, defaultMode: mode });
  };

  const markStepCompleted = useCallback((step: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.add(step);
      return next;
    });
  }, []);

  const handleStepClick = (step: number) => {
    if (step === currentStep) return;

    // Going forward from step 1 → validate first
    if (step > currentStep && currentStep === 1) {
      if (!isStep1Valid) {
        return; // Don't allow forward navigation if step 1 is incomplete
      }
      markStepCompleted(1);
    }

    setCurrentStep(step);
  };

  const handleContinue = () => {
    if (currentStep === 1) {
      if (!isStep1Valid) {
        return;
      }
      markStepCompleted(1);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      handleCompleteSetup();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompleteSetup = () => {
    markStepCompleted(2);
    console.log("Profile setup completed:", formData);
    // TODO: Call API to save profile data
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0b101b] flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-full md:max-w-[50%] lg:max-w-[50%]">
          <div className="my-6 pt-6 md:my-8 md:pt-8">
            <ProgressBar
              currentStep={currentStep}
              totalSteps={2}
              onStepClick={handleStepClick}
              steps={STEP_LABELS}
              completedSteps={completedSteps}
            />
          </div>

          <div className="bg-[#151c2c] rounded-3xl border border-slate-800 shadow-2xl p-6 md:p-8">
            {currentStep === 1 ? (
              <Step1Profile
                formData={formData}
                onDisplayNameChange={handleDisplayNameChange}
                onDepartmentChange={handleDepartmentChange}
                onLevelChange={handleLevelChange}
                onContinue={handleContinue}
              />
            ) : (
              <Step2Mode
                formData={formData}
                onModeChange={handleModeChange}
                onComplete={handleContinue}
                onBack={handleBack}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
