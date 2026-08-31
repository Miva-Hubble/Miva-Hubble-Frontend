/**
 * useResourceDownload.ts
 *
 * Wraps resourceService.getDownloadUrl with per-action loading state and
 * user-friendly error handling, so ResourceCard stays focused on
 * rendering. Each hook instance is scoped to the card that calls it — no
 * keyed map needed since every card mounts its own instance.
 *
 * `preview()` fetches an inline-mode signed URL for viewable formats (PDF)
 * and manages modal-open state instead of calling `window.open()`.
 *
 * Counts (views, downloads) are owned entirely by the backend. This hook
 * does NOT attempt to sync or invalidate them after an action — the
 * library query is set to refetch on window focus and mount, which means
 * any server-side change is picked up the next time the user returns to
 * the tab or re-navigates to /resources. No client-side counter spoofing.
 */
import { useCallback, useState } from "react";
import { resourceService } from "../services/resourceService";
import { getUserFriendlyError, logTechnicalError } from "../../../lib/errors/getUserFriendlyError";

export function useResourceDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closePreview = useCallback(() => {
    setIsPreviewOpen(false);
    setPreviewUrl(null);
    setError(null);
  }, []);

  const download = useCallback(async (resourceId: string, filename: string) => {
    setError(null);
    setIsDownloading(true);

    try {
      const url = await resourceService.getDownloadUrl(resourceId, "download");
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      logTechnicalError("[useResourceDownload:download]", err);
      setError(getUserFriendlyError(err));
    } finally {
      setIsDownloading(false);
    }
  }, []);

  const preview = useCallback(async (resourceId: string, fileType = "PDF") => {
    setError(null);
    setIsPreviewOpen(true);
    setPreviewUrl(null);

    if (fileType.toUpperCase() === "PDF") {
      setIsPreviewing(true);
      try {
        const url = await resourceService.getDownloadUrl(resourceId, "preview");
        setPreviewUrl(url);
      } catch (err) {
        logTechnicalError("[useResourceDownload:preview]", err);
        setError(getUserFriendlyError(err));
      } finally {
        setIsPreviewing(false);
      }
    }
  }, []);

  return {
    isDownloading,
    isPreviewing,
    isPreviewOpen,
    previewUrl,
    error,
    download,
    preview,
    closePreview,
  };
}
