import { motion } from "framer-motion";
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
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-xl py-3.5 text-sm font-semibold cursor-pointer ${className}`}
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
      animate={{
        backgroundColor: disabled ? theme.surface : theme.primary,
      }}
      whileHover={!disabled ? { backgroundColor: theme.primaryHover, scale: 1.01 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 500, damping: 32 }}
    >
      {children}
    </motion.button>
  );
};

export default ContinueButton;
