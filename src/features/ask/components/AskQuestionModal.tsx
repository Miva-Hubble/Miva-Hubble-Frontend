import { motion, AnimatePresence } from "motion/react";
import { useState, type FormEvent } from "react";
import { CheckCircle, X, Info } from "lucide-react";
import { COURSE_CODES, TOPIC_TAGS } from "../constants/topic_tags";
import type { AskTheme } from "../constants/theme";
import type { NewQuestionInput } from "../types/question";

type AskQuestionModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: NewQuestionInput) => void;
  theme: AskTheme;
};

export default function AskQuestionModal({
  open,
  onClose,
  onSubmit,
  theme,
}: AskQuestionModalProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setTitle("");
    setBody("");
    setCourseCode("");
    setSelectedTags([]);
    setIsAnonymous(false);
    setError(null);
  };

  const handleClose = () => {
    onClose();
    setSuccess(false);
    resetForm();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setError(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!courseCode) {
      setError("Please select a course code.");
      return;
    }
    if (!title.trim()) {
      setError("Please enter a question title.");
      return;
    }
    if (!body.trim()) {
      setError("Please describe your question.");
      return;
    }

    onSubmit({
      title: title.trim(),
      body: body.trim(),
      courseCode,
      tags: selectedTags,
      isAnonymous,
    });

    setSuccess(true);
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center p-4"
          style={{ backgroundColor: theme.overlay }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            // The structural fix: Added flex column and max-height constraints here
            className="w-full max-w-lg rounded-2xl border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
            }}
          >
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 px-8"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: theme.solvedBg }}
                >
                  <CheckCircle className="w-8 h-8" style={{ color: theme.solvedText }} />
                </div>
                <h3 className="text-xl font-bold mb-1" style={{ color: theme.textPrimary }}>
                  Question Posted!
                </h3>
                <p className="text-sm text-center" style={{ color: theme.textSecondary }}>
                  Your question is now live. Fellow Hubblites can start helping.
                </p>
              </motion.div>
            ) : (
              <>
                {/* Header - Locked to top */}
                <div
                  className="shrink-0 flex items-center justify-between px-6 pt-6 pb-4 border-b"
                  style={{ borderColor: theme.border }}
                >
                  <h2 className="text-xl font-bold" style={{ color: theme.textPrimary }}>
                    Ask a Question
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: theme.cardBg }}
                  >
                    <X className="w-4 h-4" style={{ color: theme.textSecondary }} />
                  </motion.button>
                </div>

                {/* Form Wrapper */}
                <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
                  
                  {/* Scrollable Body - This handles the overflow */}
                  <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                    <div>
                      <label
                        className="block text-sm font-semibold mb-1.5"
                        style={{ color: theme.textPrimary }}
                      >
                        Course *
                      </label>
                      <select
                        value={courseCode}
                        onChange={(e) => {
                          setCourseCode(e.target.value);
                          setError(null);
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all appearance-none"
                        style={{
                          backgroundColor: theme.input,
                          borderColor: theme.border,
                          color: courseCode ? theme.textPrimary : theme.textMuted,
                        }}
                      >
                        <option value="">Select a course</option>
                        {COURSE_CODES.map((code) => (
                          <option key={code} value={code}>
                            {code}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        className="block text-sm font-semibold mb-1.5"
                        style={{ color: theme.textPrimary }}
                      >
                        Question Title *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., How do I implement a binary search tree?"
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          setError(null);
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: theme.input,
                          borderColor: theme.border,
                          color: theme.textPrimary,
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-semibold mb-1.5"
                        style={{ color: theme.textPrimary }}
                      >
                        Details *
                      </label>
                      <textarea
                        placeholder="Provide more details about your question..."
                        value={body}
                        onChange={(e) => {
                          setBody(e.target.value);
                          setError(null);
                        }}
                        rows={4}
                        className="w-full px-4 py-2.5 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: theme.input,
                          borderColor: theme.border,
                          color: theme.textPrimary,
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ color: theme.textPrimary }}
                      >
                        Tags{" "}
                        <span className="font-normal" style={{ color: theme.textMuted }}>
                          (Optional)
                        </span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {TOPIC_TAGS.map((tag) => {
                          const isSelected = selectedTags.includes(tag);
                          return (
                            <motion.button
                              key={tag}
                              type="button"
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.96 }}
                              onClick={() => toggleTag(tag)}
                              className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors duration-200"
                              style={{
                                backgroundColor: isSelected ? theme.primary + "30" : theme.tagBg,
                                color: isSelected ? theme.primary : theme.tagText,
                                border: isSelected
                                  ? `1px solid ${theme.primary}`
                                  : `1px solid ${theme.border}`,
                              }}
                            >
                              {tag}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Anonymous Toggle Section */}
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <h4 className="text-sm font-semibold" style={{ color: theme.textPrimary }}>
                          Post Anonymously
                        </h4>
                        <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                          Your identity will be hidden as "Hubblite"
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAnonymous(!isAnonymous)}
                        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0"
                        style={{
                          backgroundColor: isAnonymous ? theme.primary : theme.border,
                        }}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isAnonymous ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    {error && (
                      <p className="text-sm font-medium" style={{ color: "#EF4444" }}>
                        {error}
                      </p>
                    )}
                  </div>

                  {/* Footer - Locked to bottom */}
                  <div
                    className="shrink-0 flex items-center justify-between px-6 py-4 border-t"
                    style={{ borderColor: theme.border, backgroundColor: theme.surface }}
                  >
                    <div className="flex items-center gap-1.5" style={{ color: theme.textMuted }}>
                      <Info className="w-4 h-4 shrink-0" />
                      <span className="text-xs">Be clear and specific for better answers</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleClose}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                        style={{
                          border: `1px solid ${theme.border}`,
                          color: theme.textSecondary,
                        }}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
                        style={{ backgroundColor: theme.primary }}
                      >
                        Post
                      </motion.button>
                    </div>
                  </div>

                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}