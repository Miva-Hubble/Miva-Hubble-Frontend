/**
 * mapBookToResource.ts
 *
 * Pure DTO -> view-model mapping. No axios, no React, no state — just
 * `BookDto` in, `Resource` out. Kept separate from `resourceService.ts`
 * so it can be unit-tested in isolation and so the service file stays
 * focused on transport concerns only.
 *
 * Every fallback below is a deliberate, documented compromise for fields
 * the backend does not (yet) return. When the backend adds a proper field
 * (e.g. a real `courseCode`, a generated thumbnail), delete the matching
 * fallback here rather than layering another workaround on top of it.
 */

import type { BookDto, Resource } from "../../../types/resource";
import { formatRelativeTime } from "../../../lib/date/formatRelativeTime";
import { getCategoryLabel } from "../constants/categoryLabels";

// Matches tags like "CSC405", "MTH 201", "csc-405" -> normalized "CSC 405"
const COURSE_CODE_PATTERN = /^([A-Za-z]{2,5})[\s-]?(\d{2,4})$/;

/**
 * The backend does not return a dedicated `courseCode` field. Books are
 * tagged freely (e.g. `["CSC405", "Machine Learning", "Lecture Notes"]`),
 * so we look for a tag matching a course-code shape and normalize it.
 *
 * Falls back to a department-initials + level code (e.g. "CS 400") so the
 * UI never has to render an empty badge.
 */
function extractCourseCode(tags: string[], department: string, level: string): string {
  for (const tag of tags) {
    const match = tag.trim().match(COURSE_CODE_PATTERN);
    if (match) {
      const [, letters, digits] = match;
      return `${letters.toUpperCase()} ${digits}`;
    }
  }

  const initials = department
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 3);

  return `${initials} ${level}`;
}

/**
 * The backend does not return a `courseName`/topic field either. We use
 * `description` (a real, admin-authored field) as the closest honest
 * substitute rather than inventing text — falling back to the title only
 * if description is empty.
 */
function resolveCourseName(book: BookDto): string {
  return book.description.trim() || book.title;
}

export function mapBookToResource(book: BookDto): Resource {
  return {
    id: book.id,
    title: book.title,
    courseCode: extractCourseCode(book.tags, book.department, book.level),
    courseName: resolveCourseName(book),
    level: book.level,
    department: book.department,
    fileType: book.fileFormat,
    uploadedBy: book.author || "Anonymous",
    timestamp: formatRelativeTime(book.createdAt),
    // Maps engagement counters returned from the backend (previewCount/downloadCount)
    // with 0 as a fallback.
    stats: {
      likes: 0,
      comments: 0,
      downloads: book.downloadCount ?? book.downloads ?? 0,
      views: book.previewCount ?? book.views ?? 0,
    },
    category: getCategoryLabel(book.bookType),
    // Pass the real cover through untouched — null stays null. ResourceCard
    // decides how to render the null case (file-type icon), so no
    // placeholder photo is substituted here.
    coverImageUrl: book.coverImageUrl,
  };
}

export function mapBooksToResources(books: BookDto[]): Resource[] {
  return books.map(mapBookToResource);
}
