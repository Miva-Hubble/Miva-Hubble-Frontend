import { motion } from "motion/react";
import type { AskTheme } from "../constants/theme";
import type { QuestionFilter } from "../types/question";

type FilterTabsProps = {
  activeFilter: QuestionFilter;
  onFilterChange: (filter: QuestionFilter) => void;
  theme: AskTheme;
};

const FILTERS: { value: QuestionFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unanswered", label: "Unanswered" },
  { value: "trending", label: "Trending" },
];

export default function FilterTabs({ activeFilter, onFilterChange, theme }: FilterTabsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter.value;

        return (
          <motion.button
            key={filter.value}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onFilterChange(filter.value)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200"
            style={{
              backgroundColor: isActive ? theme.primary : "transparent",
              color: isActive ? "#FFFFFF" : theme.textSecondary,
              border: isActive ? "none" : `1px solid ${theme.border}`,
            }}
          >
            {filter.label}
          </motion.button>
        );
      })}
    </div>
  );
}
