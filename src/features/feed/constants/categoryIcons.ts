/**
 * categoryIcons.ts
 *
 * Icon is presentation-only and will never come from the backend, so it's
 * looked up client-side by category id. Unrecognized/future category ids
 * fall back to a generic icon rather than breaking the render.
 */
import { FileText, FileQuestion, BookOpen, Play, type LucideIcon } from "lucide-react";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  notes: FileText,
  past_questions: FileQuestion,
  textbooks: BookOpen,
  videos: Play,
};

export function getCategoryIcon(categoryId: string): LucideIcon {
  return CATEGORY_ICONS[categoryId] ?? BookOpen;
}
