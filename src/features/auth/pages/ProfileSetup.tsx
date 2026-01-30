import { useState } from "react";
import { Navbar } from "../../../components/Layout/NavBar";
import Step1Profile from "../components/Step1Profile";
import Step2Mode from "../components/Step2Mode";
import ProgressBar from "../../../components/ui/ProgressBar";
import { useNavigate } from "react-router-dom";

interface ProfileSetupData {
  displayName: string;
  department: string;
  currentLevel: string;
  defaultMode: "anonymous" | "identified";
}

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProfileSetupData>({
    displayName: "",
    department: "",
    currentLevel: "100",
    defaultMode: "anonymous",
  });

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

  const handleContinue = () => {
    if (currentStep === 1) {
      if (!formData.displayName || !formData.department) {
        alert("Please fill in all fields");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      handleCompleteSetup();
    }
  };

  const handleCompleteSetup = () => {
    console.log("Profile setup completed:", formData);
    // TODO: Call API to save profile data
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-[50%] w-full">
          <div className="my-8 pt-8">
            <ProgressBar currentStep={currentStep} totalSteps={2} />
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
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
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
