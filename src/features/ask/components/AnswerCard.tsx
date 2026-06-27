import { motion } from "motion/react";
import { CheckCircle2, TrendingUp } from "lucide-react";
import type { AskTheme } from "../constants/theme";
import type { Answer } from "../types/question";

type AnswerCardProps = {
  answer: Answer;
  theme: AskTheme;
  onUpvote: () => void;
  index?: number;
};

export default function AnswerCard({ answer, theme, onUpvote, index = 0 }: AnswerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="rounded-xl border p-5"
      style={{
        backgroundColor: theme.cardBg,
        borderColor: answer.isAccepted ? theme.solvedText + "55" : theme.border,
      }}
    >
      {answer.isAccepted && (
        <div
          className="flex items-center gap-1.5 text-xs font-semibold mb-3"
          style={{ color: theme.solvedText }}
        >
          <CheckCircle2 className="w-4 h-4" />
          Accepted Answer
        </div>
      )}

      <p className="text-sm leading-relaxed mb-4" style={{ color: theme.textPrimary }}>
        {answer.body}
      </p>

      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: theme.textMuted }}>
          {answer.author} &bull; Level {answer.level} &bull; {answer.timestamp}
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onUpvote}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{
            backgroundColor: theme.upvoteBg,
            color: theme.upvoteText,
          }}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          {answer.upvotes}
        </motion.button>
      </div>
    </motion.div>
  );
}
