/**
 * trendingIcons.ts
 *
 * Same rationale as categoryIcons.ts — icon selection by file type is a
 * frontend presentation concern, not something the API needs to send.
 */
import { FileText, BookOpen, FileQuestion, File, type LucideIcon } from "lucide-react";

const TRENDING_ICONS: Record<string, LucideIcon> = {
  PDF: FileText,
  DOCX: BookOpen,
  DOC: BookOpen,
  EPUB: FileQuestion,
};

export function getTrendingIcon(fileType?: string): LucideIcon {
  if (!fileType) return File;
  return TRENDING_ICONS[fileType.toUpperCase()] ?? File;
}
