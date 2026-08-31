/**
 * previewImageFallbacks.ts
 *
 * The backend does not (yet) return a thumbnail for uploaded books, so
 * every card needs a deterministic placeholder. Deterministic matters:
 * picking a *random* image per render would make the same resource show
 * a different cover on every reload/refetch, which reads as a bug.
 *
 * Strategy: pick by department when we have a match, otherwise fall back
 * to a generic study/library image. When the backend starts returning
 * real thumbnails, `mapBookToResource` just needs to prefer that field
 * over this lookup — nothing else in the app needs to change.
 */

const DEPARTMENT_PREVIEW_IMAGES: Record<string, string> = {
  "Computer Science":
    "https://images.unsplash.com/photo-1555255707-c07966088b7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  Mathematics:
    "https://images.unsplash.com/photo-1509228468518-180dd4864904?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  Physics:
    "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  Chemistry:
    "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  Biology:
    "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  Engineering:
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
};

const DEFAULT_PREVIEW_IMAGE =
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400";

export function getFallbackPreviewImage(department: string): string {
  return DEPARTMENT_PREVIEW_IMAGES[department] ?? DEFAULT_PREVIEW_IMAGE;
}
