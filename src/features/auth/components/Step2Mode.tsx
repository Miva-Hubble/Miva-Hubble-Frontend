import { CircleCheck, Eye, EyeOff, Info } from "lucide-react";
import CustomButton from "../../../components/ui/CustomButton";
import CustomText from "../../../components/ui/CustomText";

interface ProfileSetupData {
  displayName: string;
  department: string;
  currentLevel: string;
  defaultMode: "anonymous" | "identified";
}

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
        <button
          type="button"
          onClick={() => onModeChange("anonymous")}
          className={`w-full p-3 md:p-4 rounded-lg border-2 text-left transition-all ${
            formData.defaultMode === "anonymous"
              ? "border-[#6366F1] bg-[#EEF2FF]"
              : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-start gap-2 mb-2">
                <EyeOff className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                <CustomText
                  variant="body"
                  weight="semibold"
                  color="black"
                  className="text-sm md:text-base"
                >
                  Anonymous Mode
                </CustomText>
                <span className="mr-auto bg-[#6366F1] text-white text-xs font-semibold px-2 py-1 rounded">
                  Recommended
                </span>
              </div>
              <CustomText
                variant="small"
                color="secondary"
                className="text-xs md:text-sm"
              >
                Post and interact as a Hubblite. Your identity stays private.
              </CustomText>
              <div className="bg-white px-3 md:px-4 py-2 w-full rounded-md">
                <CustomText
                  variant="caption"
                  color="secondary"
                  className="opacity-50 mb-1 text-xs md:text-xs"
                >
                  How others see you:
                </CustomText>
                <CustomText
                  variant="small"
                  color="primary"
                  weight="semibold"
                  className="text-xs md:text-sm"
                >
                  Hubblite • Level {formData.currentLevel}
                </CustomText>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center flex-shrink-0 ${
                formData.defaultMode === "anonymous"
                  ? "border-blue-600 bg-blue-600"
                  : "border-gray-300"
              }`}
            >
              {formData.defaultMode === "anonymous" && <CircleCheck />}
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onModeChange("identified")}
          className={`w-full p-3 md:p-4 rounded-lg border-2 text-left transition-all ${
            formData.defaultMode === "identified"
              ? "border-[#6366F1] bg-[#EEF2FF]"
              : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                <CustomText
                  variant="body"
                  weight="semibold"
                  color="black"
                  className="text-sm md:text-base"
                >
                  Identified Mode
                </CustomText>
              </div>
              <CustomText
                variant="small"
                color="secondary"
                className="text-xs md:text-sm"
              >
                Use your real name and profile. Build your reputation and
                connect openly.
              </CustomText>
              <div className="bg-white px-3 md:px-4 py-2 w-full rounded-md">
                <CustomText
                  variant="caption"
                  color="secondary"
                  className="opacity-50 mb-1 text-xs md:text-xs"
                >
                  How others see you:
                </CustomText>
                <CustomText
                  variant="small"
                  color="primary"
                  weight="semibold"
                  className="text-xs md:text-sm"
                >
                  Student • Level {formData.currentLevel}
                </CustomText>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center flex-shrink-0 ${
                formData.defaultMode === "identified"
                  ? "border-blue-600 bg-blue-600"
                  : "border-gray-300"
              }`}
            >
              {formData.defaultMode === "identified" && <CircleCheck />}
            </div>
          </div>
        </button>

        <div className="mt-4 bg-[#DBEAFE] border border-[#BFDBFE] rounded-lg p-3 md:p-4 flex gap-3">
          <Info
            color="#1E40AF"
            className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-0.5"
          />
          <div>
            <CustomText
              variant="small"
              weight="semibold"
              className="text-[#1E40AF] font-bold text-xs md:text-sm"
            >
              Pro tip:
            </CustomText>
            <CustomText
              variant="small"
              className="text-[#1E40AF] text-xs md:text-sm"
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
