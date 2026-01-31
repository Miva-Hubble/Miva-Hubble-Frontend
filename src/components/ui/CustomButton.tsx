import { Link } from "react-router-dom";
import { type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface CustomButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  size?: ButtonSize;
  route?: string;
  className?: string;
  title?: string;
  ariaLabel?: string;
}

const getVariantStyles = (
  variant: ButtonVariant,
  disabled: boolean,
): string => {
  const baseStyles = disabled ? "opacity-30 cursor-not-allowed" : "";

  const variants = {
    primary: `${baseStyles} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 border border-transparent`,
    secondary: `${baseStyles} bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 border border-transparent`,
    danger: `${baseStyles} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border border-transparent`,
    outline: `${baseStyles} bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500 border border-gray-300`,
  };

  return variants[variant];
};

const getSizeStyles = (size: ButtonSize): string => {
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return sizes[size];
};

const CustomButton = ({
  children,
  onClick,
  disabled = false,
  type = "button",
  variant = "primary",
  size = "md",
  route,
  className = "",
  title,
  ariaLabel,
}: CustomButtonProps) => {
  const baseStyles =
    "font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";
  const variantStyles = getVariantStyles(variant, disabled);
  const sizeStyles = getSizeStyles(size);
  const combinedClassName =
    `${baseStyles} ${variantStyles} ${sizeStyles} ${className}`.trim();

  if (route && !disabled) {
    return (
      <Link
        to={route}
        className={combinedClassName}
        title={title}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClassName}
      title={title}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

export default CustomButton;
