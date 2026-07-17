import type { AskTheme } from "../../ask/constants/theme";

interface ContinueButtonProps {
  theme: AskTheme;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

const ContinueButton = ({
  theme,
  onClick,
  disabled = false,
  children,
  className = "",
}: ContinueButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-xl py-3.5 text-sm font-semibold transition-all duration-300 cursor-pointer active:scale-[0.99] ${className}`}
      style={
        disabled
          ? {
              cursor: "not-allowed",
              backgroundColor: theme.surface,
              color: theme.textMuted,
            }
          : {
              backgroundColor: theme.primary,
              color: "#FFFFFF",
            }
      }
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = theme.primaryHover;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = theme.primary;
        }
      }}
    >
      {children}
    </button>
  );
};

export default ContinueButton;
