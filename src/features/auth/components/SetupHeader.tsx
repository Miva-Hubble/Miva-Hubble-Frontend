import type { AskTheme } from "../../ask/constants/theme";
import SetupProgressIndicator from "../../../components/ui/SetupProgressIndicator";

interface SetupHeaderProps {
  theme: AskTheme;
  currentStep: number;
  totalSteps: number;
  /** Furthest step reached so far; steps up to this become clickable in the indicator. */
  maxStepReached?: number;
  onBack: () => void;
  /** Navigate directly to a step (e.g. via clicking the progress indicator). */
  onStepClick?: (step: number) => void;
}

const SetupHeader = ({
  theme,
  currentStep,
  totalSteps,
  maxStepReached,
  onStepClick,
}: SetupHeaderProps) => {
  return (
    <div className="relative flex items-center justify-center pt-5">
      <SetupProgressIndicator
        theme={theme}
        currentStep={currentStep}
        totalSteps={totalSteps}
        maxStepReached={maxStepReached}
        onStepClick={onStepClick}
      />
    </div>
  );
};

export default SetupHeader;
