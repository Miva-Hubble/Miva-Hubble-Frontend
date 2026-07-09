import type { AskTheme } from "../../features/ask/constants/theme";

interface SetupProgressIndicatorProps {
  theme: AskTheme;
  currentStep: number;
  totalSteps: number;
}

const SetupProgressIndicator = ({
  theme,
  currentStep,
  totalSteps,
}: SetupProgressIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }, (_, index) => {
        const step = index + 1;
        const isActive = step === currentStep;

        return (
          <div
            key={step}
            className="rounded-full transition-all duration-300"
            style={{
              height: "6px",
              width: isActive ? "32px" : "6px",
              backgroundColor: isActive ? theme.primary : theme.border,
            }}
          />
        );
      })}
    </div>
  );
};

export default SetupProgressIndicator;
