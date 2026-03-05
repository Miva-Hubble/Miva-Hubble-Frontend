import { Eye, EyeOff, Info } from "lucide-react";
import CustomButton from "../../../components/ui/CustomButton";
import CustomText from "../../../components/ui/CustomText";
import { ModeCard } from "../../../components/ui/ProfileModeCard";
import type { ProfileSetupData } from "../../../types/ProfileSetup";

interface Step2ModeProps {
  formData: ProfileSetupData;
  onModeChange: (mode: "anonymous" | "identified") => void;
  onComplete: () => void;
  onBack?: () => void;
}

const Step2Mode = ({ formData, onModeChange, onComplete, onBack }: Step2ModeProps) => {
  return (
    <>
      <div className="text-center mb-6 md:mb-8">
        <CustomText
          variant="h2"
          weight="bold"
          align="center"
          className="mb-2 text-xl md:text-2xl text-slate-200"
        >
          Choose your default mode
        </CustomText>
        <CustomText
          variant="body"
          color="secondary"
          align="center"
          className="text-sm md:text-base text-slate-300"
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
          displayLabel={formData.displayName.trim() || "Student"}
          currentLevel={formData.currentLevel}
          onClick={() => onModeChange("identified")}
        />

        <div className="mt-4 bg-blue-900/30 border border-blue-800 rounded-lg p-3 md:p-4 flex gap-3">
          <Info className="text-blue-400 w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-0.5" />
          <div>
            <CustomText
              variant="small"
              weight="bold"
              color="white"
              className="font-bold text-xs md:text-sm"
            >
              Pro tip:
            </CustomText>
            <CustomText
              variant="small"
              color="white"
              className="text-xs md:text-sm text-blue-300"
            >
              You can toggle between modes anytime, and even choose different
              modes for different posts!
            </CustomText>
          </div>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {onBack && (
          <CustomButton
            onClick={onBack}
            type="button"
            variant="outline"
            className="w-full bg-slate-800 text-slate-200 hover:bg-slate-700 focus:ring-slate-600 border border-slate-700"
          >
            Back
          </CustomButton>
        )}
        <CustomButton
          onClick={onComplete}
          type="button"
          variant="primary"
          size="md"
          className="w-full bg-cyan-600 hover:bg-cyan-500 focus:ring-cyan-500"
        >
          Complete Setup
        </CustomButton>
      </div>
    </>
  );
};

export default Step2Mode;
