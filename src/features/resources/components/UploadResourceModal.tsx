import { motion, AnimatePresence } from "motion/react";
import { useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import { CheckCircle, Upload, X } from "lucide-react";
import POPULAR_CATEGORIES from "../constants/popular_categories";
import { VAULT_DEPARTMENTS } from "../constants/departments";
import type { VaultTheme } from "../constants/theme";
import { uploadResource } from "../services/uploadResource";
import { levels } from "../../../constants/profile";

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

type UploadResourceModalProps = {
  open: boolean;
  onClose: () => void;
  theme: VaultTheme;
};

export default function UploadResourceModal({ open, onClose, theme }: UploadResourceModalProps) {
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCourseCode, setUploadCourseCode] = useState("");
  const [uploadLevel, setUploadLevel] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetFormState = () => {
    setUploadTitle("");
    setUploadCourseCode("");
    setUploadLevel("");
    setSelectedDepartments([]);
    setSelectedCategories([]);
    setUploadFile(null);
    setUploadError(null);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
    setUploadSuccess(false);
    resetFormState();
  };

  const handleCheckboxChange = (
    value: string,
    list: string[],
    setter: Dispatch<SetStateAction<string[]>>
  ) => {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
    } else {
      setter([...list, value]);
    }
    setUploadError(null);
  };

  const handleFileChange = (file: File | null) => {
    if (file && file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError("File must be under 50MB.");
      setUploadFile(null);
      return;
    }
    setUploadFile(file);
    setUploadError(null);
  };

  const handleUploadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    if (selectedDepartments.length === 0) {
      setUploadError("Please select at least one department.");
      return;
    }

    if (selectedCategories.length === 0) {
      setUploadError("Please select at least one category.");
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

    setIsSubmitting(true);

    try {
      await uploadResource({
        title: uploadTitle,
        courseCode: uploadCourseCode,
        level: uploadLevel,
        departments: selectedDepartments,
        categories: selectedCategories,
        file: uploadFile,
      });

      setUploadSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setIsSubmitting(false);
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            className="absolute inset-0 bg-black/50"
            onClick={() => !uploadSuccess && !isSubmitting && handleClose()}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className="relative rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: theme.surface,
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: theme.textPrimary }}>
                  Upload Resource
                </h2>
                <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                  Share your study materials with fellow Hubblites
                </p>
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
                style={{ backgroundColor: theme.border }}
                onClick={() => !uploadSuccess && !isSubmitting && handleClose()}
              >
                <X className="w-5 h-5" style={{ color: theme.textPrimary }} />
              </motion.button>
            </div>

            {!uploadSuccess ? (
              <form onSubmit={handleUploadSubmit} className="space-y-6">
                {uploadError && (
                  <p
                    className="text-sm font-medium px-4 py-3 rounded-xl"
                    style={{ backgroundColor: "#FEE2E2", color: "#B91C1C" }}
                    role="alert"
                  >
                    {uploadError}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: theme.textPrimary }}>
                        Resource Title *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Data Structures Notes"
                        className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200"
                        style={{
                          backgroundColor: theme.input,
                          borderColor: theme.border,
                          color: theme.textPrimary,
                        }}
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: theme.textPrimary }}>
                        Course Code *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., CSC 301"
                        className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200"
                        style={{
                          backgroundColor: theme.input,
                          borderColor: theme.border,
                          color: theme.textPrimary,
                        }}
                        value={uploadCourseCode}
                        onChange={(e) => setUploadCourseCode(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: theme.textPrimary }}>
                        Level *
                      </label>
                      <select
                        className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200"
                        style={{
                          backgroundColor: theme.input,
                          borderColor: theme.border,
                          color: theme.textPrimary,
                        }}
                        value={uploadLevel}
                        onChange={(e) => setUploadLevel(e.target.value)}
                        required
                      >
                        <option value="">Select level</option>
                        {levels.map((level) => (
                          <option key={level} value={level}>
                            {level} Level
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: theme.textPrimary }}>
                        Upload File *
                      </label>
                      <div
                        className="relative rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200"
                        style={{
                          backgroundColor: theme.input,
                          borderColor: uploadFile ? theme.primary : theme.border,
                        }}
                      >
                        <input
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                        />
                        <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: theme.textMuted }} />
                        <p className="text-sm font-semibold" style={{ color: theme.textPrimary }}>
                          {uploadFile ? uploadFile.name : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-xs mt-1" style={{ color: theme.textMuted }}>
                          PDF, DOCX, PPT, TXT (Max 50MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-3" style={{ color: theme.textPrimary }}>
                        Department(s) *
                      </label>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {VAULT_DEPARTMENTS.map((dept) => (
                          <label
                            key={dept}
                            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200"
                            style={{
                              backgroundColor: selectedDepartments.includes(dept)
                                ? theme.primary + "20"
                                : theme.accentBg,
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedDepartments.includes(dept)}
                              onChange={() =>
                                handleCheckboxChange(dept, selectedDepartments, setSelectedDepartments)
                              }
                              className="w-4 h-4 rounded"
                              style={{ accentColor: theme.primary }}
                            />
                            <span className="text-sm font-medium" style={{ color: theme.textPrimary }}>
                              {dept}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-3" style={{ color: theme.textPrimary }}>
                        Category/Categories *
                      </label>
                      <div className="space-y-2">
                        {POPULAR_CATEGORIES.map(({ name }) => (
                          <label
                            key={name}
                            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200"
                            style={{
                              backgroundColor: selectedCategories.includes(name)
                                ? theme.primary + "20"
                                : theme.accentBg,
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(name)}
                              onChange={() =>
                                handleCheckboxChange(name, selectedCategories, setSelectedCategories)
                              }
                              className="w-4 h-4 rounded"
                              style={{ accentColor: theme.primary }}
                            />
                            <span className="text-sm font-medium" style={{ color: theme.textPrimary }}>
                              {name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-center justify-end gap-3 pt-4 border-t"
                  style={{ borderColor: theme.border }}
                >
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 rounded-xl font-semibold border"
                    style={{
                      backgroundColor: "transparent",
                      borderColor: theme.border,
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
                    className="px-8 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-60"
                    style={{ backgroundColor: theme.primary, color: "#FFFFFF" }}
                    disabled={isSubmitting}
                  >
                    <Upload className="w-5 h-5" />
                    {isSubmitting ? "Uploading..." : "Upload Resource"}
                  </motion.button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: theme.accent + "20" }}
                >
                  <CheckCircle className="w-10 h-10" style={{ color: theme.accent }} />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: theme.textPrimary }}>
                  Upload Successful!
                </h3>
                <p style={{ color: theme.textSecondary }}>
                  Your resource has been submitted and will appear in the vault shortly.
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
