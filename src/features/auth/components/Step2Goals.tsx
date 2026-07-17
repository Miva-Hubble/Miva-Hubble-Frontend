import { Check } from "lucide-react";
import type { AskTheme } from "../../ask/constants/theme";
import { GOALS, MAX_GOALS } from "../../../constants/profile";
import ContinueButton from "./ContinueButton";

interface Step2GoalsProps {
  theme: AskTheme;
  selectedGoals: string[];
  onToggleGoal: (goal: string) => void;
  onContinue: () => void;
}

const Step2Goals = ({
  theme,
  selectedGoals,
  onToggleGoal,
  onContinue,
}: Step2GoalsProps) => {
  const isMaxSelected = selectedGoals.length >= MAX_GOALS;
  const canContinue = selectedGoals.length === MAX_GOALS;

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1">
        <h1
          className="mb-2 text-2xl font-bold"
          style={{ color: theme.textPrimary }}
        >
          What brings you here?
        </h1>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            Select up to 3 goals.
          </p>
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors"
            style={
              isMaxSelected
                ? {
                    backgroundColor: theme.primary + "33",
                    color: theme.answerText,
                  }
                : {
                    backgroundColor: theme.surface,
                    color: theme.textSecondary,
                  }
            }
          >
            {selectedGoals.length}/{MAX_GOALS}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {GOALS.map((goal) => {
            const isSelected = selectedGoals.includes(goal);
            const isDisabled = !isSelected && isMaxSelected;

            return (
              <button
                key={goal}
                type="button"
                onClick={() => onToggleGoal(goal)}
                disabled={isDisabled}
                className="relative rounded-full px-4 py-3 text-left text-xs font-medium transition-all duration-200 sm:text-sm cursor-pointer"
                style={
                  isSelected
                    ? {
                        border: `1px solid ${theme.primary}`,
                        backgroundColor: theme.primary,
                        color: "#FFFFFF",
                      }
                    : isDisabled
                      ? {
                          border: `1px solid ${theme.border}`,
                          backgroundColor: "transparent",
                          color: theme.textMuted,
                          opacity: 0.4,
                          cursor: "not-allowed",
                        }
                      : {
                          border: `1px solid ${theme.border}`,
                          backgroundColor: "transparent",
                          color: theme.tagText,
                        }
                }
              >
                {isSelected && (
                  <Check
                    className="mr-1.5 inline h-3.5 w-3.5"
                    strokeWidth={2.5}
                  />
                )}
                {goal}
              </button>
            );
          })}
        </div>

        {isMaxSelected && (
          <p
            className="mt-6 text-center text-xs"
            style={{ color: theme.textMuted }}
          >
            Max 3 selected — tap one to swap it out.
          </p>
        )}
      </div>

      <div className="mt-8">
        <ContinueButton
          theme={theme}
          onClick={onContinue}
          disabled={!canContinue}
        >
          Continue
        </ContinueButton>
      </div>
    </div>
  );
};

export default Step2Goals;
