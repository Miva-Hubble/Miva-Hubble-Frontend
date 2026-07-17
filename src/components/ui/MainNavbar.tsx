import { motion } from "motion/react";
import { 
  BookOpen, Moon, Sun, UserCircle, Bell, 
  Home, Shield, MessageSquare, GraduationCap, Trophy 
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import type { AskTheme } from "../../features/ask/constants/theme";

type AskNavbarProps = {
  NavTheme: AskTheme;
  isDarkMode: boolean;
  onToggleTheme: () => void;
};

// Added icons to the navigation array
const NAV_LINKS = [
  { label: "Home", path: "/feed", icon: Home, disabled: false },
  { label: "Vault", path: "/resources", icon: Shield, disabled: false },
  { label: "Ask", path: "/ask", icon: MessageSquare, disabled: false },
  { label: "Courses", path: "#", icon: GraduationCap, disabled: true },
  { label: "Leaderboard", path: "#", icon: Trophy, disabled: true },
] as const;

export default function MainNavbar({ NavTheme, isDarkMode, onToggleTheme }: AskNavbarProps) {
  const location = useLocation();

  return (
    <>
      {/* TOP NAVBAR */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 border-b backdrop-blur-lg"
        style={{
          backgroundColor: NavTheme.surface + "E6",
          borderColor: NavTheme.border,
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/feed" className="flex items-center gap-2.5 shrink-0">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: NavTheme.primary }}
              >
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:flex items-baseline gap-0.5">
                <span className="text-base font-bold" style={{ color: NavTheme.textPrimary }}>
                  MIVA
                </span>
                <span className="text-base font-bold" style={{ color: NavTheme.primary }}>
                  HUBBLE
                </span>
              </span>
            </Link>

            {/* Desktop Center Nav - Hidden on Mobile */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = !link.disabled && location.pathname === link.path;

                if (link.disabled) {
                  return (
                    <span
                      key={link.label}
                      className="px-3 py-1.5 text-sm font-medium cursor-not-allowed opacity-40"
                      style={{ color: NavTheme.textMuted }}
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
                      color: isActive ? NavTheme.primary : NavTheme.textSecondary,
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
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer"
                style={{ backgroundColor: NavTheme.cardBg, border: `1px solid ${NavTheme.border}` }}
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4" style={{ color: NavTheme.textSecondary }} />
                ) : (
                  <Moon className="w-4 h-4" style={{ color: NavTheme.textSecondary }} />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: NavTheme.cardBg, border: `1px solid ${NavTheme.border}` }}
                aria-label="Profile"
              >
                <UserCircle className="w-5 h-5" style={{ color: NavTheme.textSecondary }} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: NavTheme.cardBg, border: `1px solid ${NavTheme.border}` }}
                aria-label="Notification-Bell"
              >
                <Bell className="w-5 h-5" style={{ color: NavTheme.textSecondary }} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE BOTTOM NAVIGATION - Glass Pill */}
      <div 
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-50 rounded-full border shadow-2xl backdrop-blur-xl pb-safe"
        style={{
          backgroundColor: NavTheme.surface + "99", // 60% opacity for the glass effect
          borderColor: NavTheme.border,
        }}
      >
        <div className="flex justify-around items-center px-3 py-2.5">
          {NAV_LINKS.map((link) => {
            const isActive = !link.disabled && location.pathname === link.path;
            const Icon = link.icon;

            if (link.disabled) {
              return (
                <div key={link.label} className="flex flex-col items-center p-1 opacity-40 cursor-not-allowed">
                  <Icon className="w-5 h-5 mb-1" style={{ color: NavTheme.textMuted }} />
                  <span className="text-[10px] font-medium" style={{ color: NavTheme.textMuted }}>{link.label}</span>
                </div>
              );
            }

            return (
              <Link
                key={link.label}
                to={link.path}
                className="flex flex-col items-center p-1 transition-all duration-200"
              >
                <div className="mb-1 transition-colors">
                  <Icon 
                    className="w-5 h-5 transition-colors" 
                    style={{ color: isActive ? NavTheme.primary : NavTheme.textSecondary }} 
                  />
                </div>
                <span 
                  className="text-[10px] font-medium transition-colors"
                  style={{ color: isActive ? NavTheme.primary : NavTheme.textSecondary }}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}