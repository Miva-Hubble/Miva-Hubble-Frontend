import { type ReactNode } from "react";

type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "label"
  | "caption"
  | "body"
  | "small";
type TextWeight = "light" | "normal" | "medium" | "semibold" | "bold";
type TextAlign = "left" | "center" | "right";
type TextColor =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "gray"
  | "white"
  | "black";

interface CustomTextProps {
  children: ReactNode;
  variant?: TextVariant;
  weight?: TextWeight;
  align?: TextAlign;
  color?: TextColor;
  className?: string;
  title?: string;
}

const getVariantStyles = (variant: TextVariant): string => {
  const variants = {
    h1: "text-4xl",
    h2: "text-3xl",
    h3: "text-2xl",
    h4: "text-xl",
    p: "text-base",
    label: "text-sm font-medium",
    caption: "text-xs",
    body: "text-base",
    small: "text-sm",
  };
  return variants[variant];
};

const getWeightStyles = (weight: TextWeight): string => {
  const weights = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };
  return weights[weight];
};

const getAlignStyles = (align: TextAlign): string => {
  const aligns = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };
  return aligns[align];
};

const getColorStyles = (color: TextColor): string => {
  const colors = {
    primary: "text-[#0F172A]",
    secondary: "text-[#64748B]",
    success: "text-green-600",
    danger: "text-red-600",
    warning: "text-yellow-600",
    info: "text-blue-500",
    gray: "text-gray-700",
    white: "text-white",
    black: "text-black",
  };
  return colors[color];
};

const CustomText = ({
  children,
  variant = "p",
  weight = "normal",
  align = "left",
  color = "gray",
  className = "",
  title,
}: CustomTextProps) => {
  const variantStyles = getVariantStyles(variant);
  const weightStyles = getWeightStyles(weight);
  const alignStyles = getAlignStyles(align);
  const colorStyles = getColorStyles(color);
  const combinedClassName =
    `${variantStyles} ${weightStyles} ${alignStyles} ${colorStyles} ${className}`.trim();

  return (
    <div className={combinedClassName} title={title}>
      {children}
    </div>
  );
};

export default CustomText;
