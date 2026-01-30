import { User } from "lucide-react";
import CustomButton from "../../../components/ui/CustomButton";
import CustomText from "../../../components/ui/CustomText";
import { departments, levels } from "../../../constants/profile";

interface ProfileSetupData {
  displayName: string;
  department: string;
  currentLevel: string;
  defaultMode: "anonymous" | "identified";
}

interface Step1ProfileProps {
  formData: ProfileSetupData;
  onDisplayNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDepartmentChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onLevelChange: (level: string) => void;
  onContinue: () => void;
}

const Step1Profile = ({
  formData,
  onDisplayNameChange,
  onDepartmentChange,
  onLevelChange,
  onContinue,
}: Step1ProfileProps) => {
  return (
    <>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#EEF2FF] rounded-md mb-4">
          <User color="#6366F1" />
        </div>
        <CustomText
          variant="h2"
          weight="bold"
          align="center"
          className="mb-2"
          color="primary"
        >
          Set up your profile
        </CustomText>
        <CustomText variant="body" color="secondary" align="center">
          Help your peers find and connect with you
        </CustomText>
      </div>

      <form className="space-y-6">
        <div>
          <label htmlFor="displayName" className="block mb-2">
            <CustomText variant="label" weight="semibold" color="black">
              Display Name
            </CustomText>
          </label>
          <input
            id="displayName"
            type="text"
            placeholder="How should we call you?"
            value={formData.displayName}
            onChange={onDisplayNameChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <CustomText
            variant="caption"
            color="secondary"
            className="mt-1 block opacity-65"
          >
            This can be your real name or a nickname
          </CustomText>
        </div>

        <div>
          <label htmlFor="department" className="block mb-2">
            <CustomText variant="label" weight="semibold" color="black">
              Department
            </CustomText>
          </label>
          <select
            id="department"
            value={formData.department}
            onChange={onDepartmentChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-4">
            <CustomText variant="label" weight="semibold" color="black">
              Current Level
            </CustomText>
          </label>
          <div className="grid grid-cols-5 gap-2">
            {levels.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => onLevelChange(level)}
                className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                  formData.currentLevel === level
                    ? "border-[#6366F1] bg-blue-50 text-blue-600"
                    : "border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CBD5E1]"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <CustomButton
          onClick={onContinue}
          type="button"
          variant="primary"
          size="md"
          className="w-full mt-8"
          disabled={!formData.displayName || !formData.department}
        >
          Continue
        </CustomButton>
      </form>
    </>
  );
};

export default Step1Profile;
