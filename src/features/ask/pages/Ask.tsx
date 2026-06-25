import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import AskQuestionModal from "../components/AskQuestionModal";
import FilterTabs from "../components/FilterTabs";
import QuestionCard from "../components/QuestionCard";
import { getAskTheme } from "../constants/theme";
import { useQuestionsStore } from "../store/questionsStore";
import type { QuestionFilter } from "../types/question";

export default function Ask() {
  const navigate = useNavigate();
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<QuestionFilter>("trending");
  const [showModal, setShowModal] = useState(false);

  const theme = getAskTheme(isDarkMode);
  const questions = useQuestionsStore((s) => s.questions);
  const addQuestion = useQuestionsStore((s) => s.addQuestion);

  const filteredQuestions = useMemo(() => {
    let result = [...questions];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.body.toLowerCase().includes(q) ||
          item.tags.some((t) => t.label.toLowerCase().includes(q))
      );
    }

    if (activeFilter === "unanswered") {
      result = result.filter((item) => item.answers.length === 0);
    } else if (activeFilter === "trending") {
      result.sort((a, b) => b.upvotes - a.upvotes);
    }

    return result;
  }, [questions, searchQuery, activeFilter]);

  const handleQuestionSubmit = (input: Parameters<typeof addQuestion>[0]) => {
    const newQuestion = addQuestion(input);
    navigate(`/ask/${newQuestion.id}`);
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: theme.textPrimary }}>
              Ask a Question
            </h1>
            <p className="text-base" style={{ color: theme.textSecondary }}>
              Get help from your fellow Hubblites. Share knowledge, solve problems together.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 self-start cursor-pointer"
            style={{ backgroundColor: theme.primary }}
          >
            <Plus className="w-4 h-4" />
            Ask Question
          </motion.button>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-4"
        >
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: theme.textMuted }}
            />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: theme.input,
                borderColor: theme.border,
                color: theme.textPrimary,
              }}
            />
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-6"
        >
          <FilterTabs
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            theme={theme}
          />
        </motion.div>

        {/* Question List */}
        <div className="space-y-3">
          {filteredQuestions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 rounded-xl border"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.border,
                color: theme.textMuted,
              }}
            >
              <p className="text-sm">No questions found. Be the first to ask!</p>
            </motion.div>
          ) : (
            filteredQuestions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                theme={theme}
                index={index}
              />
            ))
          )}
        </div>
      </div>

      <AskQuestionModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleQuestionSubmit}
        theme={theme}
      />
    </div>
  );
}