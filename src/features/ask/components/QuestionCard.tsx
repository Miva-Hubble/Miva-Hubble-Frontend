import { motion } from "motion/react";
import { MessageCircle, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { AskTheme } from "../constants/theme";
import type { Question } from "../types/question";

type QuestionCardProps = {
  question: Question;
  theme: AskTheme;
  index?: number;
};

export default function QuestionCard({ question, theme, index = 0 }: QuestionCardProps) {
  const navigate = useNavigate();

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -2 }}
      onClick={() => navigate(`/ask/${question.id}`)}
      className="rounded-xl border p-5 cursor-pointer transition-shadow duration-200 hover:shadow-md"
      style={{
        backgroundColor: theme.cardBg,
        borderColor: theme.border,
      }}
    >
      <div className="flex gap-4">
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap mb-2">
            <h3
              className="text-base font-semibold leading-snug"
              style={{ color: theme.textPrimary }}
            >
              {question.title}
            </h3>
            {question.status === "solved" && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                style={{
                  backgroundColor: theme.solvedBg,
                  color: theme.solvedText,
                }}
              >
                Solved
              </span>
            )}
          </div>

          <p
            className="text-sm leading-relaxed mb-3 line-clamp-2"
            style={{ color: theme.textSecondary }}
          >
            {question.excerpt}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-3">
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
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-2 shrink-0">
          <div
            className="flex flex-col items-center justify-center rounded-lg px-3 py-2 min-w-[72px]"
            style={{ backgroundColor: theme.upvoteBg }}
          >
            <TrendingUp className="w-4 h-4 mb-0.5" style={{ color: theme.upvoteText }} />
            <span className="text-sm font-bold" style={{ color: theme.textPrimary }}>
              {question.upvotes}
            </span>
            <span className="text-[10px]" style={{ color: theme.textMuted }}>
              upvotes
            </span>
          </div>

          <div
            className="flex flex-col items-center justify-center rounded-lg px-3 py-2 min-w-[72px]"
            style={{ backgroundColor: theme.answerBg }}
          >
            <MessageCircle className="w-4 h-4 mb-0.5" style={{ color: theme.answerText }} />
            <span className="text-sm font-bold" style={{ color: theme.textPrimary }}>
              {question.answers.length}
            </span>
            <span className="text-[10px]" style={{ color: theme.textMuted }}>
              answers
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
