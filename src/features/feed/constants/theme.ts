export type FeedTheme = {
    bg: string;
    surface: string;
    cardBg: string;
    input: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    primary: string;
    primaryHover: string;
    accent: string;       // For the emerald/green highlights
    accentHover: string;
  };
  
  export function getFeedTheme(isDarkMode: boolean): FeedTheme {
    return isDarkMode
      ? {
          bg: "#0B1120",
          surface: "#111827",
          cardBg: "#1A2332",
          input: "#0F1729",
          border: "#2A3548",
          textPrimary: "#F1F5F9",
          textSecondary: "#94A3B8",
          textMuted: "#64748B",
          primary: "#38bdf8", // Miva Hubble Blue
          primaryHover: "#0284c7",
          accent: "#4ADE80",  // Emerald
          accentHover: "#22c55e",
        }
      : {
          bg: "#F1F5F9",
          surface: "#FFFFFF",
          cardBg: "#F8FAFC",
          input: "#FFFFFF",
          border: "#E2E8F0",
          textPrimary: "#0F172A",
          textSecondary: "#64748B",
          textMuted: "#94A3B8",
          primary: "#2563EB", 
          primaryHover: "#1D4ED8",
          accent: "#16A34A",
          accentHover: "#15803d",
        };
  }