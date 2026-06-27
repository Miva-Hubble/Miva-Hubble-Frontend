import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  Send,
  TrendingUp,
} from "lucide-react";
import AnswerCard from "../components/AnswerCard";
import { getAskTheme } from "../constants/theme";
import { useQuestionsStore } from "../store/questionsStore";

export default function QuestionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  const [answerText, setAnswerText] = useState("");

  const theme = getAskTheme(isDarkMode);
  const question = useQuestionsStore((s) => s.getQuestionById(id ?? ""));
  const addAnswer = useQuestionsStore((s) => s.addAnswer);
  const upvoteQuestion = useQuestionsStore((s) => s.upvoteQuestion);
  const upvoteAnswer = useQuestionsStore((s) => s.upvoteAnswer);

  if (!question) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ backgroundColor: theme.bg, color: theme.textPrimary }}
      >
        <p className="text-lg font-semibold">Question not found</p>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/ask")}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: theme.primary }}
        >
          Back to Ask
        </motion.button>
      </div>
    );
  }

  const handleSubmitAnswer = () => {
    if (!answerText.trim() || !id) return;
    addAnswer(id, answerText);
    setAnswerText("");
  };

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: "Arimo, sans-serif",
        backgroundColor: theme.bg,
        color: theme.textPrimary,
      }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -2 }}
          onClick={() => navigate("/ask")}
          className="flex items-center gap-2 text-sm font-medium mb-6 transition-colors"
          style={{ color: theme.textSecondary }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to questions
        </motion.button>

        {/* Question */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-xl border p-6 mb-6"
          style={{
            backgroundColor: theme.cardBg,
            borderColor: theme.border,
          }}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-2 flex-wrap">
              <h1
                className="text-xl font-bold leading-snug"
                style={{ color: theme.textPrimary }}
              >
                {question.title}
              </h1>
              {question.status === "solved" && (
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: theme.solvedBg,
                    color: theme.solvedText,
                  }}
                >
                  Solved
                </span>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => upvoteQuestion(question.id)}
              className="flex flex-col items-center justify-center rounded-lg px-3 py-2 shrink-0"
              style={{ backgroundColor: theme.upvoteBg }}
            >
              <TrendingUp className="w-4 h-4 mb-0.5" style={{ color: theme.upvoteText }} />
              <span className="text-sm font-bold" style={{ color: theme.textPrimary }}>
                {question.upvotes}
              </span>
            </motion.button>
          </div>

          <p className="text-sm leading-relaxed mb-4" style={{ color: theme.textSecondary }}>
            {question.body}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {question.tags.map((tag) => (
              <span
                key={tag.label}
                className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: tag.isCourse ? theme.tagCourseBg : theme.tagBg,
                  color: tag.isCourse ? theme.tagCourseText : theme.tagText,
                }}
              >
                {tag.label}
              </span>
            ))}
          </div>

          <p className="text-xs" style={{ color: theme.textMuted }}>
            {question.author} &bull; Level {question.level} &bull; {question.timestamp}
          </p>
        </motion.div>

        {/* Answers Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-2 mb-4"
        >
          <MessageCircle className="w-5 h-5" style={{ color: theme.answerText }} />
          <h2 className="text-lg font-bold" style={{ color: theme.textPrimary }}>
            {question.answers.length}{" "}
            {question.answers.length === 1 ? "Answer" : "Answers"}
          </h2>
        </motion.div>

        {/* Answers List */}
        <div className="space-y-3 mb-8">
          {question.answers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 rounded-xl border"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.border,
                color: theme.textMuted,
              }}
            >
              <p className="text-sm">No answers yet. Be the first to help!</p>
            </motion.div>
          ) : (
            question.answers.map((answer, index) => (
              <AnswerCard
                key={answer.id}
                answer={answer}
                theme={theme}
                index={index}
                onUpvote={() => upvoteAnswer(question.id, answer.id)}
              />
            ))
          )}
        </div>

        {/* Answer Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="rounded-xl border p-5"
          style={{
            backgroundColor: theme.cardBg,
            borderColor: theme.border,
          }}
        >
          <h3 className="text-sm font-semibold mb-3" style={{ color: theme.textPrimary }}>
            Your Answer
          </h3>
          <textarea
            placeholder="Share your knowledge and help a fellow Hubblite..."
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 transition-all mb-3"
            style={{
              backgroundColor: theme.input,
              borderColor: theme.border,
              color: theme.textPrimary,
            }}
          />
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmitAnswer}
              disabled={!answerText.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: theme.primary }}
            >
              <Send className="w-4 h-4" />
              Post Answer
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
