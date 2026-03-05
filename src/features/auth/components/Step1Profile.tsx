import { User } from "lucide-react";
import CustomButton from "../../../components/ui/CustomButton";
import CustomText from "../../../components/ui/CustomText";
import { departments, levels } from "../../../constants/profile";
import type { ProfileSetupData } from "../../../types/ProfileSetup";

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
      <div className="text-center mb-6 md:mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-md mb-4">
          <User className="text-cyan-500" />
        </div>
        <CustomText
          variant="h2"
          weight="bold"
          align="center"
          className="mb-2 text-xl md:text-2xl"
          color="white"
        >
          Set up your profile
        </CustomText>
        <CustomText
          variant="body"
          color="secondary"
          align="center"
          className="text-sm md:text-base"
        >
          Help your peers find and connect with you
        </CustomText>
      </div>

      <form className="space-y-4 md:space-y-6">
        <div>
          <label htmlFor="displayName" className="block mb-2">
            <CustomText variant="label" weight="semibold" color="white">
              Display Name
            </CustomText>
          </label>
          <input
            id="displayName"
            type="text"
            placeholder="How should we call you?"
            value={formData.displayName}
            onChange={onDisplayNameChange}
            className="w-full px-4 py-2 bg-slate-900 text-white placeholder-slate-500 border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
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
            <CustomText variant="label" weight="semibold" color="white">
              Department
            </CustomText>
          </label>
          <select
            id="department"
            value={formData.department}
            onChange={onDepartmentChange}
            className="w-full px-4 py-2 bg-slate-900 text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
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
            <CustomText variant="label" weight="semibold" color="white">
              Current Level
            </CustomText>
          </label>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {levels.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => onLevelChange(level)}
                className={`p-2 md:p-3 rounded-lg border-2 font-semibold transition-all text-sm md:text-base ${
                  formData.currentLevel === level
                    ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
                    : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600"
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
          className="w-full mt-6 md:mt-8 bg-cyan-600 hover:bg-cyan-500 focus:ring-cyan-500"
          disabled={!formData.displayName || !formData.department}
        >
          Continue
        </CustomButton>
      </form>
    </>
  );
};

export default Step1Profile;


