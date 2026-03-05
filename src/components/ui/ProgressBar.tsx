import CustomText from "./CustomText";
import { Check } from "lucide-react";

interface StepConfig {
  label: string;
}

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
  steps?: StepConfig[];
  completedSteps?: Set<number>;
}

const ProgressBar = ({
  currentStep,
  totalSteps,
  onStepClick,
  steps,
  completedSteps = new Set(),
}: ProgressBarProps) => {
  const progressPercentage = Math.round((currentStep / totalSteps) * 100);

  const defaultSteps: StepConfig[] = Array.from({ length: totalSteps }, (_, i) => ({
    label: `Step ${i + 1}`,
  }));

  const stepConfigs = steps ?? defaultSteps;

  return (
    <div className="w-full">
      {/* Step indicators */}
      <div className="flex items-center justify-between mb-4">
        {stepConfigs.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = completedSteps.has(stepNumber);
          const isClickable = !!onStepClick;

          return (
            <div key={stepNumber} className="flex items-center flex-1 last:flex-none">
              {/* Step circle + label */}
              <button
                type="button"
                onClick={() => onStepClick?.(stepNumber)}
                disabled={!isClickable}
                className={`
                  flex items-center gap-2 group transition-all duration-200
                  ${isClickable ? "cursor-pointer" : "cursor-default"}
                `}
                aria-current={isActive ? "step" : undefined}
                aria-label={`${step.label}${isCompleted ? " (completed)" : isActive ? " (current)" : ""}`}
              >
                {/* Circle */}
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                    transition-all duration-200 flex-shrink-0 border-2
                    ${
                      isActive
                        ? "bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                        : isCompleted
                          ? "bg-cyan-500/20 border-cyan-500 text-cyan-400"
                          : "bg-slate-800 border-slate-600 text-slate-400"
                    }
                    ${isClickable && !isActive ? "group-hover:border-cyan-400 group-hover:text-cyan-300" : ""}
                  `}
                >
                  {isCompleted && !isActive ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    stepNumber
                  )}
                </div>

                {/* Label */}
                <span
                  className={`
                    text-sm font-medium transition-colors duration-200 hidden sm:inline
                    ${
                      isActive
                        ? "text-cyan-400"
                        : isCompleted
                          ? "text-cyan-400/70"
                          : "text-slate-500"
                    }
                    ${isClickable && !isActive ? "group-hover:text-cyan-300" : ""}
                  `}
                >
                  {step.label}
                </span>
              </button>

              {/* Connector line between steps */}
              {stepNumber < totalSteps && (
                <div className="flex-1 mx-3">
                  <div className="h-0.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                      style={{
                        width: isCompleted || currentStep > stepNumber ? "100%" : "0%",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-800 rounded-full h-1.5">
        <div
          className="bg-cyan-500 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Percentage */}
      <div className="flex justify-end mt-1.5">
        <CustomText variant="caption" color="secondary" className="text-slate-500">
          {progressPercentage}%
        </CustomText>
      </div>
    </div>
  );
};

export default ProgressBar;
