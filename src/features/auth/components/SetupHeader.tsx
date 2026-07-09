import type { AskTheme } from "../../ask/constants/theme";
import SetupProgressIndicator from "../../../components/ui/SetupProgressIndicator";

interface SetupHeaderProps {
  theme: AskTheme;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
}

const SetupHeader = ({
  theme,
  currentStep,
  totalSteps,
}: SetupHeaderProps) => {
  return (
    <div className="relative flex items-center justify-center pt-5">
      <SetupProgressIndicator
        theme={theme}
        currentStep={currentStep}
        totalSteps={totalSteps}
      />
    </div>
  );
};

export default SetupHeader;
