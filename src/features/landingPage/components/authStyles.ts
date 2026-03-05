const inputStyles = {
  backgroundColor: "var(--input-fill, #0b1220)",
  borderColor: "var(--border-divider, rgba(148, 163, 184, 0.2))",
  color: "#F8FAFC",
};

export const authInputClassName =
  "w-full px-5 py-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:border-primary cursor-text";

export function getInputStyle() {
  return inputStyles;
}
