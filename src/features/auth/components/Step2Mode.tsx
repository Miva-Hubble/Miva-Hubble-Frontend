import { Eye, EyeOff, Info } from "lucide-react";
import CustomButton from "../../../components/ui/CustomButton";
import CustomText from "../../../components/ui/CustomText";
import { ModeCard } from "../../../components/ui/ProfileModeCard";
import type { ProfileSetupData } from "../../../types/ProfileSetup";

interface Step2ModeProps {
  formData: ProfileSetupData;
  onModeChange: (mode: "anonymous" | "identified") => void;
  onComplete: () => void;
}

const Step2Mode = ({ formData, onModeChange, onComplete }: Step2ModeProps) => {
  return (
    <>
      <div className="text-center mb-6 md:mb-8">
        <CustomText
          variant="h2"
          weight="bold"
          align="center"
          className="mb-2 text-xl md:text-2xl"
        >
          Choose your default mode
        </CustomText>
        <CustomText
          variant="body"
          color="secondary"
          align="center"
          className="text-sm md:text-base"
        >
          You can change this anytime and control visibility per post
        </CustomText>
      </div>

      <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
        <ModeCard
          mode="anonymous"
          isSelected={formData.defaultMode === "anonymous"}
          icon={EyeOff}
          title="Anonymous Mode"
          description="Post and interact as a Hubblite. Your identity stays private."
          badge="Recommended"
          displayLabel="Hubblite"
          currentLevel={formData.currentLevel}
          onClick={() => onModeChange("anonymous")}
        />

        <ModeCard
          mode="identified"
          isSelected={formData.defaultMode === "identified"}
          icon={Eye}
          title="Identified Mode"
          description="Use your real name and profile. Build your reputation and connect openly."
          displayLabel="Student"
          currentLevel={formData.currentLevel}
          onClick={() => onModeChange("identified")}
        />

        <div className="mt-4 bg-[#DBEAFE] border border-[#BFDBFE] rounded-lg p-3 md:p-4 flex gap-3">
          <Info
            color="#1E40AF"
            className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-0.5"
          />
          <div>
            <CustomText
              variant="small"
              weight="bold"
              color="info"
              className="font-bold text-xs md:text-sm"
            >
              Pro tip:
            </CustomText>
            <CustomText
              variant="small"
              color="info"
              className="text-xs md:text-sm"
            >
              You can toggle between modes anytime, and even choose different
              modes for different posts!
            </CustomText>
          </div>
        </div>
      </div>

      <CustomButton
        onClick={onComplete}
        type="button"
        variant="primary"
        size="md"
        className="w-full"
      >
        Complete Setup
      </CustomButton>
    </>
  );
};

export default Step2Mode;
