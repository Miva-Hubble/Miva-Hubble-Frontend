// N.B: All commented functional code to be reactivated when profile photo 
// feature is activated

// import { useCallback, useRef, useState } from "react";
// import { X } from "lucide-react";
// import {
//   ACCEPTED_PHOTO_TYPES,
//   MAX_PHOTO_SIZE_BYTES,
// } from "../../../constants/profile";
import { Camera, AlertCircle, Loader2 } from "lucide-react";
import type { AskTheme } from "../../ask/constants/theme";
import ContinueButton from "./ContinueButton";
import ErrorBanner from "../../../components/feedback/ErrorBanner";


interface Step3ProfilePhotoProps {
  theme: AskTheme;
  profilePhoto: File | null;
  onPhotoChange: (file: File | null) => void;
  onFinish: () => void;
  onSkip: () => void;
  isSaving?: boolean;
  /** User-friendly message from getUserFriendlyError, or null when there's no error. */
  errorMessage?: string | null;
  /** Re-runs the save. Omit to render the error without a retry action. */
  onRetry?: () => void;
}

const Step3ProfilePhoto = ({
  theme,
  // profilePhoto,
  // onPhotoChange,
  onFinish,
  onSkip,
  isSaving = false,
  errorMessage = null,
  onRetry,
}: Step3ProfilePhotoProps) => {
  // const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // const [error, setError] = useState<string | null>(null);
  // const [isDragging, setIsDragging] = useState(false);
  // const fileInputRef = useRef<HTMLInputElement>(null);

  // const validateAndSetFile = useCallback(
  //   (file: File) => {
  //     setError(null);

  //     if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
  //       setError("Please upload a JPG, PNG, or WEBP image.");
  //       return;
  //     }

  //     if (file.size > MAX_PHOTO_SIZE_BYTES) {
  //       setError("Image must be 5MB or smaller.");
  //       return;
  //     }

  //     if (previewUrl) URL.revokeObjectURL(previewUrl);
  //     setPreviewUrl(URL.createObjectURL(file));
  //     onPhotoChange(file);
  //   },
  //   [onPhotoChange, previewUrl],
  // );

  // const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) validateAndSetFile(file);
  // };

  // const handleDrop = (e: React.DragEvent) => {
  //   e.preventDefault();
  //   setIsDragging(false);
  //   const file = e.dataTransfer.files?.[0];
  //   if (file) validateAndSetFile(file);
  // };

  // const handleRemovePhoto = () => {
  //   if (previewUrl) URL.revokeObjectURL(previewUrl);
  //   setPreviewUrl(null);
  //   onPhotoChange(null);
  //   setError(null);
  //   if (fileInputRef.current) fileInputRef.current.value = "";
  // };

  // const openFilePicker = () => fileInputRef.current?.click();

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

        {/* Temporary Disabled Banner */}
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-[#eab308]/30 bg-[#eab308]/10 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 text-[#eab308] shrink-0" />
          <p className="text-xs font-medium leading-relaxed text-[#eab308]">
            Profile photo uploads are temporarily disabled. Please skip this step for now.
          </p>
        </div>

        {/* Inactive UI Elements (Greyed out & unclickable) */}
        <div className="flex flex-col items-center opacity-40 pointer-events-none grayscale">
          <button
            type="button"
            disabled
            className="mb-6 flex h-36 w-36 flex-col items-center justify-center rounded-full border-2 border-dashed transition-colors"
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
        </div>

      </div>

      <div className="mt-8 space-y-3">
        {/* Recoverable error, shown right next to the action that triggered it */}
        {errorMessage && (
          <ErrorBanner
            title="We couldn't save your profile"
            message={errorMessage}
            onRetry={onRetry}
          />
        )}

        {/* Hard-disabled Continue Button */}
        <ContinueButton
          theme={theme}
          onClick={onFinish}
          disabled={true}
        >
          Finish Setup
        </ContinueButton>

        {/* Empowered Skip Button */}
        <button
          type="button"
          onClick={onSkip}
          disabled={isSaving}
          aria-busy={isSaving}
          className="w-full py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-lg active:scale-[0.99] flex items-center justify-center gap-2"
          style={{ backgroundColor: theme.primary, color: "#FFFFFF" }}
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSaving ? "Completing setup..." : "Skip and Complete"}
        </button>
      </div>
    </div>
  );
};

export default Step3ProfilePhoto;