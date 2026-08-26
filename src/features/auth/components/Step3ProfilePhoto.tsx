import { useCallback, useRef, useState } from "react";
import { Camera, Upload, X, AlertCircle } from "lucide-react";
import type { AskTheme } from "../../ask/constants/theme";
import {
  ACCEPTED_PHOTO_TYPES,
  MAX_PHOTO_SIZE_BYTES,
} from "../../../constants/profile";
import ContinueButton from "./ContinueButton";

interface Step3ProfilePhotoProps {
  theme: AskTheme;
  profilePhoto: File | null;
  onPhotoChange: (file: File | null) => void;
  onFinish: () => void;
  onSkip: () => void;
  isSaving?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
}

const Step3ProfilePhoto = ({
  theme,
  profilePhoto,
  onPhotoChange,
  onFinish,
  onSkip,
  isSaving = false,
  errorMessage,
  onRetry,
}: Step3ProfilePhotoProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = useCallback(
    (file: File) => {
      setFileError(null);

      if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
        setFileError("Please upload a JPG, PNG, or WEBP image.");
        return;
      }

      if (file.size > MAX_PHOTO_SIZE_BYTES) {
        setFileError("Image must be 5MB or smaller.");
        return;
      }

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
      onPhotoChange(file);
    },
    [onPhotoChange, previewUrl],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleRemovePhoto = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    onPhotoChange(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openFilePicker = () => fileInputRef.current?.click();

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1">
        <h1
          className="mb-2 text-2xl font-bold"
          style={{ color: theme.textPrimary }}
        >
          Add a profile photo
        </h1>
        <p className="mb-8 text-sm" style={{ color: theme.textSecondary }}>
          Let fellow Hubblites recognize you.
        </p>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 text-red-500 shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-medium leading-relaxed text-red-500">
                {errorMessage}
              </p>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center">
          {previewUrl ? (
            <div className="relative mb-6">
              <div
                className="h-36 w-36 overflow-hidden rounded-full border-2 border-dashed"
                style={{ borderColor: theme.primary }}
              >
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={handleRemovePhoto}
                aria-label="Remove photo"
                className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full transition-colors cursor-pointer"
                style={{
                  backgroundColor: theme.cardBg,
                  color: theme.tagText,
                }}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={openFilePicker}
              className="mb-6 flex h-36 w-36 flex-col items-center justify-center rounded-full border-2 border-dashed transition-colors cursor-pointer hover:opacity-80"
              style={{ borderColor: theme.border }}
            >
              <Camera
                className="mb-2 h-7 w-7"
                style={{ color: theme.textMuted }}
              />
              <span className="text-xs" style={{ color: theme.textMuted }}>
                Tap to upload             
              </span>
            </button>
          )}

          <div
            role="button"
            tabIndex={0}
            onClick={openFilePicker}
            onKeyDown={(e) => e.key === "Enter" && openFilePicker()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className="flex w-full cursor-pointer flex-col items-center rounded-xl border-2 border-dashed px-6 py-8 transition-colors"
            style={
              isDragging
                ? {
                    borderColor: theme.primary,
                    backgroundColor: theme.primary + "0D",
                  }
                : { borderColor: theme.border }
            }
          >
            <Upload className="mb-3 h-6 w-6" style={{ color: theme.textMuted }} />
            <p
              className="text-sm font-medium"
              style={{ color: theme.answerText }}
            >
              Drag & drop or click to browse
            </p>
            <p className="mt-1 text-xs" style={{ color: theme.textMuted }}>
              JPG, PNG or WEBP · Max 5MB
            </p>
          </div>

          {fileError && (
            <p className="mt-3 text-xs text-red-400">{fileError}</p>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_PHOTO_TYPES.join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <div className="mt-8 space-y-3">
        <ContinueButton
          theme={theme}
          onClick={onFinish}
          disabled={!profilePhoto || isSaving}
        >
          {isSaving ? "Saving..." : "Finish Setup"}
        </ContinueButton>

        <button
          type="button"
          onClick={onSkip}
          disabled={isSaving}
          className="w-full py-2 text-sm transition-colors disabled:opacity-50 cursor-pointer hover:opacity-70"
          style={{ color: theme.textMuted }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default Step3ProfilePhoto;