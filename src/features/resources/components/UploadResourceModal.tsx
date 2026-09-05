import { motion, AnimatePresence } from "motion/react";
import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Upload, X, AlertTriangle, FileText } from "lucide-react";
import type { VaultTheme } from "../constants/theme";
import { useTaxonomy } from "../../../hooks/useTaxonomy";
import { useSubmitStudentResource, type SubmissionStage } from "../hooks/useSubmitStudentResource";
import { studentResourceKeys } from "../constants/studentResourceKeys";
import type { StudentResourceType } from "../../../types/studentResource";

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

type UploadResourceModalProps = {
  open: boolean;
  onClose: () => void;
  theme: VaultTheme;
};

export default function UploadResourceModal({ open, onClose, theme }: UploadResourceModalProps) {
  const { departments, levels, isLoading: isTaxonomyLoading } = useTaxonomy();
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCourseTitle, setUploadCourseTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [resourceType, setResourceType] = useState<StudentResourceType>("NOTE");
  const [uploadLevel, setUploadLevel] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { submit, stage } = useSubmitStudentResource();
  const isSubmitting = stage !== "idle" && stage !== "done";

  const isFileOverLimit = uploadFile ? uploadFile.size > MAX_FILE_SIZE_BYTES : false;

  const resetFormState = () => {
    setUploadTitle("");
    setUploadCourseTitle("");
    setUploadDescription("");
    setResourceType("NOTE");
    setUploadLevel("");
    setSelectedDepartments([]);
    setUploadFile(null);
    setUploadError(null);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
    setUploadSuccess(false);
    resetFormState();
  };

  const handleDepartmentChange = (department: string) => {
    // A student resource has exactly one audience department. Using a single
    // selected value avoids creating a request the Vault cannot match.
    setSelectedDepartments((current) =>
      current[0] === department ? [] : [department],
    );
    setUploadError(null);
  };

  const handleFileChange = (file: File | null) => {
    setUploadFile(file);
    if (file && file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setUploadError(`File is ${sizeMb}MB. Maximum allowed size is 50MB.`);
    } else {
      setUploadError(null);
    }
  };

  const getStageLabel = (currentStage: SubmissionStage) => {
    switch (currentStage) {
      case "requesting-url":
        return "Preparing upload...";
      case "uploading":
        return "Uploading file...";
      case "registering":
        return "Registering resource...";
      case "submitting":
        return "Submitting for review...";
      default:
        return "Submitting...";
    }
  };

  const handleUploadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    if (selectedDepartments.length !== 1) {
      setUploadError("Please select exactly one department.");
      return;
    }

    if (!levels.includes(uploadLevel)) {
      setUploadError("Please select a valid level from the available options.");
      return;
    }

    if (!departments.includes(selectedDepartments[0])) {
      setUploadError("Please select a valid department from the available options.");
      return;
    }

    if (!uploadFile) {
      setUploadError("Please select a file to upload.");
      return;
    }

    if (uploadFile.size > MAX_FILE_SIZE_BYTES) {
      setUploadError("File must be under 50MB.");
      return;
    }

    try {
      const submittedResource = await submit({
        file: uploadFile,
        title: uploadTitle,
        description: uploadDescription,
        courseTitle: uploadCourseTitle,
        level: uploadLevel,
        department: selectedDepartments[0],
        resourceType,
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: studentResourceKeys.mine() }),
        queryClient.invalidateQueries({ queryKey: studentResourceKeys.progress() }),
      ]);
      // Keep the submitted resource visible immediately while the refreshed
      // GET /api/student-resources/mine response is in flight.
      queryClient.setQueryData<{ success: boolean; resources: (typeof submittedResource)[] }>(
        studentResourceKeys.mine(),
        (current) => ({
          success: true,
          resources: [
            submittedResource,
            ...(current?.resources ?? []).filter((resource) => resource.id !== submittedResource.id),
          ],
        }),
      );
      setUploadSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2200);
    } catch {
      setUploadError("Upload failed. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="upload-resource-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !uploadSuccess && !isSubmitting && handleClose()}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, type: "spring", damping: 25 }}
            className="relative rounded-3xl p-5 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            style={{
              backgroundColor: theme.surface,
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: theme.textPrimary }}>
                  Upload Resource
                </h2>
                <p className="text-xs sm:text-sm mt-0.5 text-slate-400">
                  Share verified lecture notes, past questions, and study materials
                </p>
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.07)" }}
                onClick={() => !uploadSuccess && !isSubmitting && handleClose()}
              >
                <X className="w-4 h-4 text-slate-300" />
              </motion.button>
            </div>

            {!uploadSuccess ? (
              <form onSubmit={handleUploadSubmit} className="space-y-5">
                {uploadError && (
                  <div
                    className="text-xs sm:text-sm font-medium px-4 py-3 rounded-2xl flex items-center gap-2"
                    style={{ backgroundColor: "rgba(239, 68, 68, 0.12)", color: "#F87171", border: "1px solid rgba(239, 68, 68, 0.25)" }}
                    role="alert"
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Left Column: Title, Course, Level, File */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold mb-1.5" style={{ color: theme.textPrimary }}>
                        Resource Title *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Data Structures Notes"
                        className="w-full px-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm focus:outline-none transition-all duration-200"
                        style={{
                          backgroundColor: theme.input,
                          borderColor: "rgba(255, 255, 255, 0.08)",
                          color: theme.textPrimary,
                        }}
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold mb-1.5" style={{ color: theme.textPrimary }}>
                        Course Title *
                      </label>
                      <input
                        type="text"
                        value={uploadCourseTitle}
                        onChange={(e) => setUploadCourseTitle(e.target.value)}
                        required
                        placeholder="e.g., Introduction to Computer Science"
                        className="w-full px-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm focus:outline-none transition-all"
                        style={{
                          backgroundColor: theme.input,
                          borderColor: "rgba(255, 255, 255, 0.08)",
                          color: theme.textPrimary,
                        }}
                      />
                    </div>

                    {/* Student resources must target one canonical student level. */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold mb-1.5" style={{ color: theme.textPrimary }}>
                        Level *
                      </label>
                      <select
                        className="w-full px-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm focus:outline-none transition-all duration-200 cursor-pointer"
                        style={{
                          backgroundColor: theme.input,
                          borderColor: "rgba(255, 255, 255, 0.08)",
                          color: theme.textPrimary,
                        }}
                        value={uploadLevel}
                        onChange={(e) => setUploadLevel(e.target.value)}
                        required
                      >
                        <option value="">Select level</option>
                        {levels.map((level) => (
                          <option key={level} value={level}>
                            Level {level}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* File Upload Area with >50MB Visual Highlight */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold mb-1.5" style={{ color: theme.textPrimary }}>
                        Upload File *
                      </label>
                      <div
                        className={`relative rounded-2xl border-2 border-dashed p-5 text-center cursor-pointer transition-all duration-200 ${
                          isFileOverLimit
                            ? "border-rose-500 bg-rose-500/10"
                            : uploadFile
                            ? "border-emerald-500/60 bg-emerald-500/5"
                            : "border-white/10 hover:border-white/20 bg-black/10"
                        }`}
                      >
                        <input
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                          accept=".pdf,.epub,.doc,.docx"
                        />
                        {isFileOverLimit ? (
                          <div className="space-y-1">
                            <AlertTriangle className="w-7 h-7 mx-auto text-rose-400 mb-1" />
                            <p className="text-xs sm:text-sm font-bold text-rose-400 truncate max-w-xs mx-auto">
                              {uploadFile?.name}
                            </p>
                            <p className="text-[11px] font-semibold text-rose-400">
                              {(uploadFile!.size / (1024 * 1024)).toFixed(1)}MB — Exceeds 50MB limit!
                            </p>
                            <p className="text-[10px] text-slate-400">Click to choose a smaller file</p>
                          </div>
                        ) : uploadFile ? (
                          <div className="space-y-1">
                            <FileText className="w-7 h-7 mx-auto text-emerald-400 mb-1" />
                            <p className="text-xs sm:text-sm font-semibold text-emerald-300 truncate max-w-xs mx-auto">
                              {uploadFile.name}
                            </p>
                            <p className="text-[11px] text-emerald-400/80">
                              {(uploadFile.size / (1024 * 1024)).toFixed(1)}MB • Ready to upload
                            </p>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-7 h-7 mx-auto mb-1.5 text-slate-400" />
                            <p className="text-xs sm:text-sm font-semibold" style={{ color: theme.textPrimary }}>
                              Click to upload or drag & drop
                            </p>
                            <p className="text-[11px] mt-0.5 text-slate-400">
                              PDF, EPUB, DOC, DOCX (Max 50MB)
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Description, Departments, Resource Type */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold mb-1.5" style={{ color: theme.textPrimary }}>
                        Description (Optional)
                      </label>
                      <textarea
                        value={uploadDescription}
                        onChange={(e) => setUploadDescription(e.target.value)}
                        rows={3}
                        placeholder="Briefly describe this resource"
                        className="w-full px-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm focus:outline-none transition-all"
                        style={{
                          backgroundColor: theme.input,
                          borderColor: "rgba(255, 255, 255, 0.08)",
                          color: theme.textPrimary,
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold mb-2" style={{ color: theme.textPrimary }}>
                        Department *
                      </label>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 scrollbar-hide">
                        {departments.map((dept) => (
                          <label
                            key={dept}
                            className="flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-all duration-150"
                            style={{
                              backgroundColor: selectedDepartments.includes(dept)
                                ? `${theme.primary}20`
                                : "rgba(255, 255, 255, 0.03)",
                              border: selectedDepartments.includes(dept)
                                ? `1px solid ${theme.primary}40`
                                : "1px solid rgba(255, 255, 255, 0.05)",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedDepartments.includes(dept)}
                              onChange={() => handleDepartmentChange(dept)}
                              className="w-4 h-4 rounded accent-sky-500"
                            />
                            <span className="text-xs font-medium truncate" style={{ color: theme.textPrimary }}>
                              {dept}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold mb-1.5" style={{ color: theme.textPrimary }}>
                        Resource Type *
                      </label>
                      <select
                        value={resourceType}
                        onChange={(e) => setResourceType(e.target.value as StudentResourceType)}
                        className="w-full px-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm focus:outline-none transition-all cursor-pointer"
                        style={{
                          backgroundColor: theme.input,
                          borderColor: "rgba(255, 255, 255, 0.08)",
                          color: theme.textPrimary,
                        }}
                      >
                        <option value="NOTE">Lecture Note</option>
                        <option value="PAST_QUESTION">Past Question</option>
                        <option value="STUDY_GUIDE">Study Guide</option>
                        <option value="REFERENCE">Reference Material</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-center justify-end gap-3 pt-3 border-t"
                  style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
                >
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm cursor-pointer transition-colors"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      color: theme.textSecondary,
                    }}
                    onClick={handleClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                    style={{ backgroundColor: theme.primary, color: "#FFFFFF" }}
                    disabled={isSubmitting || isFileOverLimit || isTaxonomyLoading}
                  >
                    <Upload className="w-4 h-4" />
                    {isSubmitting
                      ? getStageLabel(stage)
                      : isTaxonomyLoading
                        ? "Loading options..."
                        : "Submit for Review"}
                  </motion.button>
                </div>
              </form>
            ) : (
              /* Light Green Status Confirmation */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="text-center py-10 sm:py-12 rounded-2xl"
                style={{
                  backgroundColor: "rgba(16, 185, 129, 0.06)",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.08, type: "spring", stiffness: 220, damping: 15 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: "rgba(16, 185, 129, 0.18)" }}
                >
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
                </motion.div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Status: Uploaded • Pending Review
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold mb-1.5" style={{ color: theme.textPrimary }}>
                  Successfully Submitted!
                </h3>
                <p className="text-xs sm:text-sm max-w-sm mx-auto text-slate-400 px-4">
                  Your resource is now queued for verification. You can track its live status in the{" "}
                  <span className="text-emerald-400 font-semibold">My Resources</span> tab.
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
