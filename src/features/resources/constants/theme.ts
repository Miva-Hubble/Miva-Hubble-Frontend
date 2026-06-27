export type VaultTheme = {
  bg: string;
  surface: string;
  cardBg: string;
  accentBg: string;
  input: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryHover: string;
  accent: string;
  accentLight: string;
};

export function getVaultTheme(isDarkMode: boolean): VaultTheme {
  return isDarkMode
    ? {
        bg: "#0B1120",
        surface: "#1E293B",
        cardBg: "#1E293B",
        accentBg: "#334155",
        input: "#020617",
        border: "#334155",
        textPrimary: "#F8FAFC",
        textSecondary: "#94A3B8",
        textMuted: "#64748B",
        primary: "#8B5CF6",
        primaryHover: "#7C3AED",
        accent: "#F59E0B",
        accentLight: "#FCD34D",
      }
    : {
        bg: "#F1F5F9",
        surface: "#FFFFFF",
        cardBg: "#FFFFFF",
        accentBg: "#FAF5E7",
        input: "#FFFFFF",
        border: "#E5D4B8",
        textPrimary: "#2C1810",
        textSecondary: "#6B5B4D",
        textMuted: "#9C8976",
        primary: "#7C3AED",
        primaryHover: "#6D28D9",
        accent: "#D97706",
        accentLight: "#F59E0B",
      };
}
