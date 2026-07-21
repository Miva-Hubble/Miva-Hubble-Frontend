import { motion } from "framer-motion";
import type { AskTheme } from "../../features/ask/constants/theme";

interface SetupProgressIndicatorProps {
  theme: AskTheme;
  currentStep: number;
  totalSteps: number;
  /** Furthest step the user has reached; steps up to this are clickable. Defaults to currentStep (no back/forth navigation). */
  maxStepReached?: number;
  /** Called with the step number when a reachable dot is clicked/tapped. */
  onStepClick?: (step: number) => void;
}

const SetupProgressIndicator = ({
  theme,
  currentStep,
  totalSteps,
  maxStepReached,
  onStepClick,
}: SetupProgressIndicatorProps) => {
  const furthestStep = maxStepReached ?? currentStep;

  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }, (_, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;
        const isReachable = Boolean(onStepClick) && step <= furthestStep;

        return (
          <motion.button
            key={step}
            type="button"
            onClick={() => isReachable && onStepClick?.(step)}
            disabled={!isReachable}
            aria-label={`Go to step ${step}`}
            aria-current={isActive ? "step" : undefined}
            className="rounded-full"
            style={{
              height: "6px",
              cursor: isReachable ? "pointer" : "default",
            }}
            initial={false}
            animate={{
              width: isActive ? 32 : 6,
              backgroundColor: isActive || isCompleted ? theme.primary : theme.border,
            }}
            transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.6 }}
            whileHover={isReachable ? { scale: 1.2 } : undefined}
            whileTap={isReachable ? { scale: 0.88 } : undefined}
          />
        );
      })}
    </div>
  );
};

export default SetupProgressIndicator;
