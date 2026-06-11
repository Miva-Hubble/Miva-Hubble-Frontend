export type AskTheme = {
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
  solvedBg: string;
  solvedText: string;
  upvoteBg: string;
  upvoteText: string;
  answerBg: string;
  answerText: string;
  tagCourseBg: string;
  tagCourseText: string;
  tagBg: string;
  tagText: string;
  overlay: string;
};

export function getAskTheme(isDarkMode: boolean): AskTheme {
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
        primary: "#3B82F6",
        primaryHover: "#2563EB",
        solvedBg: "#14532D33",
        solvedText: "#4ADE80",
        upvoteBg: "#14532D22",
        upvoteText: "#4ADE80",
        answerBg: "#1E3A5F33",
        answerText: "#60A5FA",
        tagCourseBg: "#1D4ED8",
        tagCourseText: "#FFFFFF",
        tagBg: "#2A3548",
        tagText: "#CBD5E1",
        overlay: "#00000099",
      }
    : {
        bg: "#F1F5F9",
        surface: "#FFFFFF",
        cardBg: "#FFFFFF",
        input: "#FFFFFF",
        border: "#E2E8F0",
        textPrimary: "#0F172A",
        textSecondary: "#64748B",
        textMuted: "#94A3B8",
        primary: "#2563EB",
        primaryHover: "#1D4ED8",
        solvedBg: "#DCFCE7",
        solvedText: "#16A34A",
        upvoteBg: "#F0FDF4",
        upvoteText: "#16A34A",
        answerBg: "#EFF6FF",
        answerText: "#2563EB",
        tagCourseBg: "#2563EB",
        tagCourseText: "#FFFFFF",
        tagBg: "#F1F5F9",
        tagText: "#475569",
        overlay: "#00000066",
      };
}
