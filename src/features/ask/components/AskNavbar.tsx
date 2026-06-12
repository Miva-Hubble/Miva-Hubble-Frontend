import { motion } from "motion/react";
import { BookOpen, Moon, Sun, UserCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import type { AskTheme } from "../constants/theme";

type AskNavbarProps = {
  theme: AskTheme;
  isDarkMode: boolean;
  onToggleTheme: () => void;
};

const NAV_LINKS = [
  { label: "Home", path: "/feed", disabled: false },
  { label: "Vault", path: "/resources", disabled: false },
  { label: "Ask", path: "/ask", disabled: false },
  { label: "Courses", path: "#", disabled: true },
  { label: "Leaderboard", path: "#", disabled: true },
] as const;

export default function AskNavbar({ theme, isDarkMode, onToggleTheme }: AskNavbarProps) {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 border-b backdrop-blur-lg"
      style={{
        backgroundColor: theme.surface + "E6",
        borderColor: theme.border,
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/feed" className="flex items-center gap-2.5 shrink-0">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.primary }}
            >
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="hidden sm:flex items-baseline gap-0.5">
              <span className="text-base font-bold" style={{ color: theme.textPrimary }}>
                MIVA
              </span>
              <span className="text-base font-bold" style={{ color: theme.primary }}>
                HUBBLE
              </span>
            </span>
          </Link>

          {/* Center Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = !link.disabled && location.pathname === link.path;

              if (link.disabled) {
                return (
                  <span
                    key={link.label}
                    className="px-3 py-1.5 text-sm font-medium cursor-not-allowed opacity-40"
                    style={{ color: theme.textMuted }}
                  >
                    {link.label}
                  </span>
                );
              }

              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200"
                  style={{
                    color: isActive ? theme.primary : theme.textSecondary,
                    fontWeight: isActive ? 600 : 500,
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={onToggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
              style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4" style={{ color: theme.textSecondary }} />
              ) : (
                <Moon className="w-4 h-4" style={{ color: theme.textSecondary }} />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}
              aria-label="Profile"
            >
              <UserCircle className="w-5 h-5" style={{ color: theme.textSecondary }} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
