import { useState, useEffect, useMemo, type ReactNode } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useFeed } from "../hooks/useFeed";
import { getCategoryIcon } from "../constants/categoryIcons";
import { getTrendingIcon } from "../constants/trendingIcons";
import { getFeedTheme } from "../constants/theme";
import { logTechnicalError } from "../../../lib/errors/getUserFriendlyError";
import {
  Search,
  Shield,
  Download,
  TrendingUp,
  Award,
  Target,
  AlertTriangle,
  RotateCw,
} from "lucide-react";

/**
 * Feed.tsx
 *
 * Core rule: a failure in one section of GET /api/feed must never take
 * down the rest of the page. This assumes the backend degrades
 * per-section (returns `null` for the section that broke, still 200s
 * everything else) rather than failing the whole request on one bad
 * query — see feedService.ts.
 *
 * Because of that, there are two distinct "something's wrong" states
 * handled completely differently here:
 *   - `isError` (the WHOLE /api/feed call failed — network down, 401,
 *     500 before any section-level degrading could happen): only the
 *     data-dependent sections show a small inline retry each. The
 *     static shell (hero, nav buttons) is NOT gated by this at all.
 *   - A single section being `null` in an otherwise-successful response:
 *     that's not an error, it's legitimate "nothing here yet" — handled
 *     by the existing empty-state branches per section.
 */

function SectionSkeleton({ className = "h-40" }: { className?: string }) {
  return <div className={`rounded-xl animate-pulse ${className}`} style={{ backgroundColor: "rgba(148,163,184,0.15)" }} />;
}

function SectionError({
  message,
  onRetry,
  isRetrying,
  compact = false,
}: {
  message: string;
  onRetry: () => void;
  isRetrying: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center rounded-xl border ${compact ? "p-4" : "p-8"}`}
      style={{ borderColor: "rgba(148,163,184,0.3)" }}
    >
      <AlertTriangle className="w-5 h-5 mb-2" style={{ opacity: 0.6 }} />
      <p className="text-xs mb-2" style={{ opacity: 0.7 }}>{message}</p>
      <button
        onClick={onRetry}
        disabled={isRetrying}
        className="flex items-center gap-1.5 text-xs font-semibold underline cursor-pointer disabled:opacity-50"
      >
        <RotateCw className={`w-3 h-3 ${isRetrying ? "animate-spin" : ""}`} />
        {isRetrying ? "Retrying..." : "Retry"}
      </button>
    </div>
  );
}

/** Gates a single section: skeleton while loading, inline retry on error, otherwise the real content. */
function Section({
  isLoading,
  isError,
  onRetry,
  isRetrying,
  skeletonClassName,
  children,
}: {
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  isRetrying: boolean;
  skeletonClassName?: string;
  children: ReactNode;
}) {
  if (isLoading) return <SectionSkeleton className={skeletonClassName} />;
  if (isError) {
    return (
      <SectionError
        message="Couldn't load this section."
        onRetry={onRetry}
        isRetrying={isRetrying}
        compact
      />
    );
  }
  return <>{children}</>;
}

export default function Feed() {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  const theme = getFeedTheme(isDarkMode);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const { feed, isLoading, isError, error, refetch, isRefetching } = useFeed();

  if (isError) {
    logTechnicalError("[Feed]", error);
  }

  const trendingItems = feed?.trending?.items ?? [];
  const categoryItems = feed?.categories?.items ?? [];
  const masterItems = feed?.topMasters?.items ?? [];
  const quickSearchCategories = feed?.quickSearch?.categories ?? [];

  // Trending Docs Filter
  const filteredDocs = useMemo(() => {
    if (!searchQuery.trim()) return trendingItems;
    const query = searchQuery.toLowerCase();
    return trendingItems.filter(
      (doc) =>
        doc.title.toLowerCase().includes(query) ||
        (doc.context ?? "").toLowerCase().includes(query)
    );
  }, [searchQuery, trendingItems]);

  // Daily Goal Logic
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const dailyGoalPercentage = feed?.dailyGoal?.percentage ?? 0;
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (!feed?.dailyGoal) return;
    const timer = setTimeout(() => setAnimatedProgress(dailyGoalPercentage), 400);
    return () => clearTimeout(timer);
  }, [feed?.dailyGoal, dailyGoalPercentage]);

  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  return (
    <div
      className="min-h-screen font-sans pb-20 transition-colors duration-300"
      style={{ backgroundColor: theme.bg, color: theme.textPrimary }}
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Hero Banner — static shell, never gated by feed's loading/error state */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 relative rounded-2xl p-8 border overflow-hidden flex flex-col justify-center"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 blur-3xl rounded-full pointer-events-none opacity-20" style={{ backgroundColor: theme.primary }} />

            <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="max-w-md">
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block tracking-wider"
                  style={{ backgroundColor: theme.cardBg, color: theme.textSecondary }}
                >
                  DIGITAL ARCHIVE
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
                  Every resource you <br /> need, <span style={{ color: theme.primary }}>all in one place.</span>
                </h1>
                <div className="flex flex-wrap gap-4">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate("/resources")}
                    className="px-6 py-2.5 rounded-xl font-bold text-white shadow-lg cursor-pointer"
                    style={{ backgroundColor: theme.primary }}
                  >
                    Explore Vault
                  </motion.button>
                </div>
              </div>

              {/* Daily Goal Widget — data-dependent, gated individually */}
              <div
                className="hidden md:block rounded-xl p-5 border min-w-[200px]"
                style={{ backgroundColor: theme.bg, borderColor: theme.border }}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold">Daily Goal</span>
                  <Target className="w-4 h-4" style={{ color: theme.accent }} />
                </div>
                <Section isLoading={isLoading} isError={isError} onRetry={refetch} isRetrying={isRefetching} skeletonClassName="h-32">
                  <div
                    className="w-24 h-24 rounded-full border-4 flex items-center justify-center mx-auto mb-4 relative"
                    style={{ borderColor: theme.border }}
                  >
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                      <circle
                        cx="46" cy="46" r={radius}
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="transition-all duration-1000 ease-out"
                        style={{ color: theme.primary, strokeDasharray: circumference, strokeDashoffset }}
                      />
                    </svg>
                    <span className="text-2xl font-bold">{dailyGoalPercentage}%</span>
                  </div>
                  <div className="flex justify-between text-xs" style={{ color: theme.textMuted }}>
                    <span>{feed?.dailyGoal?.streak ?? 0} Day Streak</span>
                    <span className="flex items-center gap-1" style={{ color: theme.accent }}>
                      {feed?.dailyGoal?.streak ?? 0} <TrendingUp className="w-3 h-3" />
                    </span>
                  </div>
                </Section>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Search & Masters */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Search — the input itself is static shell; only the suggestion tags are data-dependent */}
            <div className="rounded-2xl p-6 border" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
              <h2 className="font-bold mb-4">Quick Search</h2>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-2.5 w-4 h-4" style={{ color: theme.textMuted }} />
                <input
                  type="text"
                  placeholder="Find notes, past questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{ backgroundColor: theme.input, borderColor: theme.border, color: theme.textPrimary, borderWidth: 1 }}
                />
              </div>
              {!isLoading && !isError && quickSearchCategories.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {quickSearchCategories.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="text-[10px] px-2 py-1 rounded border transition-colors cursor-pointer"
                      style={{ backgroundColor: theme.cardBg, borderColor: theme.border, color: theme.textMuted }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Masters */}
            <div className="rounded-2xl p-6 border" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold flex items-center gap-2">
                  <Award className="w-5 h-5" style={{ color: theme.accent }} /> Top Masters
                </h2>
              </div>
              <Section isLoading={isLoading} isError={isError} onRetry={refetch} isRetrying={isRefetching} skeletonClassName="h-32">
                {masterItems.length > 0 ? (
                  <div className="space-y-4">
                    {masterItems.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-2 rounded-lg border transition-colors"
                        style={{
                          backgroundColor: user.active ? theme.cardBg : "transparent",
                          borderColor: user.active ? theme.border : "transparent",
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white"
                          style={{ backgroundColor: theme.border }}
                        >
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold">{user.name}</p>
                          <p className="text-[10px]" style={{ color: theme.textMuted }}>
                            {user.xp.toLocaleString()} XP{user.streak ? ` • ${user.streak} Day Streak` : ""}
                          </p>
                        </div>
                        {user.active && <Shield className="w-4 h-4" style={{ color: theme.accent }} />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs py-4 text-center" style={{ color: theme.textMuted }}>
                    No top contributors yet.
                  </p>
                )}
              </Section>
            </div>
          </motion.div>
        </div>

        {/* BANNER: Current Quest — only rendered once loaded and non-null; a load failure here just means the banner doesn't appear, nothing else breaks */}
        {!isLoading && !isError && feed?.currentQuest && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="border rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: isDarkMode ? `${theme.accent}33` : `${theme.accent}15` }}>
                <Award className="w-6 h-6" style={{ color: theme.accent }} />
              </div>
              <div>
                <h3 className="font-bold">Current Quest: {feed.currentQuest.title}</h3>
                <p className="text-sm" style={{ color: theme.textSecondary }}>{feed.currentQuest.description}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="text-white px-6 py-2 rounded-xl font-bold transition-opacity w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
              style={{ backgroundColor: theme.accent }}
            >
              Upload Now <Download className="w-4 h-4 rotate-180" />
            </motion.button>
          </motion.div>
        )}

        {/* CATEGORIES */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Browse by Category</h2>
          </div>

          <Section isLoading={isLoading} isError={isError} onRetry={refetch} isRetrying={isRefetching} skeletonClassName="h-48">
            {categoryItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categoryItems.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  const Icon = getCategoryIcon(cat.id);
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className="p-5 rounded-xl border transition-all cursor-pointer"
                      style={{
                        backgroundColor: isActive ? (isDarkMode ? `${theme.primary}15` : `${theme.primary}10`) : theme.surface,
                        borderColor: isActive ? theme.primary : theme.border,
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 border"
                        style={{
                          backgroundColor: isActive ? (isDarkMode ? `${theme.primary}33` : `${theme.primary}20`) : theme.input,
                          borderColor: isActive ? theme.primary : theme.border,
                        }}
                      >
                        <Icon className="w-6 h-6" style={{ color: isActive ? theme.primary : theme.textSecondary }} />
                      </div>
                      <h3 className="font-bold mb-2">{cat.title}</h3>
                      {cat.description && (
                        <p className="text-xs mb-6 leading-relaxed" style={{ color: theme.textMuted }}>{cat.description}</p>
                      )}
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold" style={{ color: isActive ? theme.primary : theme.textSecondary }}>
                          {cat.count ?? 0} Files
                        </span>
                        <span className="flex items-center gap-1" style={{ color: theme.accent }}>☆ {cat.rating ?? 0}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center rounded-xl border" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
                <p style={{ color: theme.textSecondary }}>No categories yet.</p>
              </div>
            )}
          </Section>
        </motion.div>

        {/* BOTTOM SECTION: Trending + Community Impact */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6"
        >

          {/* Trending (Filters via State) */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" style={{ color: theme.primary }} />
              {searchQuery ? "Search Results" : "Trending This Week"}
            </h2>
            <Section isLoading={isLoading} isError={isError} onRetry={refetch} isRetrying={isRefetching} skeletonClassName="h-64">
              <div className="space-y-4">
                {filteredDocs.length > 0 ? (
                  filteredDocs.map((doc) => {
                    const Icon = getTrendingIcon(doc.fileType);
                    return (
                      <div
                        key={doc.id}
                        className="p-4 rounded-xl border flex items-center justify-between transition-colors cursor-pointer hover:opacity-80"
                        style={{ backgroundColor: theme.surface, borderColor: theme.border }}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="p-3 rounded-lg border"
                            style={{ backgroundColor: theme.input, borderColor: theme.border }}
                          >
                            <Icon className="w-6 h-6" style={{ color: theme.primary }} />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm">{doc.title}</h4>
                            {doc.context && (
                              <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>{doc.context}</p>
                            )}
                            <p className="text-[10px] mt-1" style={{ color: theme.accent }}>
                              {(doc.downloads ?? 0).toLocaleString()} downloads • ☆ {doc.rating ?? 0} ({doc.reviews ?? 0} reviews)
                            </p>
                          </div>
                        </div>
                        <button
                          className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors cursor-pointer hover:bg-slate-800"
                          style={{ borderColor: theme.border, color: theme.textPrimary }}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div
                    className="p-8 text-center rounded-xl border"
                    style={{ backgroundColor: theme.surface, borderColor: theme.border }}
                  >
                    <p style={{ color: theme.textSecondary }}>
                      {searchQuery ? `No resources found for "${searchQuery}".` : "No trending resources yet."}
                    </p>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="mt-2 text-sm hover:underline cursor-pointer"
                        style={{ color: theme.primary }}
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                )}
              </div>
            </Section>
          </div>

          {/* Community Impact */}
          <div
            className="rounded-2xl p-6 border flex flex-col justify-center"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}
          >
            <h3 className="font-bold mb-6">Community Impact</h3>
            <Section isLoading={isLoading} isError={isError} onRetry={refetch} isRetrying={isRefetching} skeletonClassName="h-32">
              <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                <div>
                  <p className="text-3xl font-extrabold" style={{ color: theme.primary }}>{(feed?.communityImpact?.activeLearners ?? 0).toLocaleString()}</p>
                  <p className="text-[10px] tracking-wider mt-1 uppercase" style={{ color: theme.textMuted }}>ACTIVE LEARNERS</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold" style={{ color: theme.accent }}>{(feed?.communityImpact?.resources ?? 0).toLocaleString()}</p>
                  <p className="text-[10px] tracking-wider mt-1 uppercase" style={{ color: theme.textMuted }}>RESOURCES</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold">{feed?.communityImpact?.successRate ?? 0}%</p>
                  <p className="text-[10px] tracking-wider mt-1 uppercase" style={{ color: theme.textMuted }}>SUCCESS RATE</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold" style={{ color: theme.primary }}>{(feed?.communityImpact?.monthlyLikes ?? 0).toLocaleString()}</p>
                  <p className="text-[10px] tracking-wider mt-1 uppercase" style={{ color: theme.textMuted }}>MONTHLY LIKES</p>
                </div>
              </div>
            </Section>
          </div>

        </motion.div>

      </main>
    </div>
  );
}
