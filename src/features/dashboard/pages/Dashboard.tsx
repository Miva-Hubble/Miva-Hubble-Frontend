import { Link, useOutletContext } from "react-router-dom";
import { useState } from "react";
import { motion } from "motion/react";
import { BookOpen, CheckCircle2, CloudUpload, Clock3, Target, TrendingUp, Trophy } from "lucide-react";
import { getDashboardTheme } from "../constants/theme";
import { getVaultTheme } from "../../resources/constants/theme";
import UploadResourceModal from "../../resources/components/UploadResourceModal";
import { useDashboard } from "../hooks/useDashboard";
import { useMyProgress } from "../../resources/hooks/useMyProgress";
import { useMyStudentResources } from "../../resources/hooks/useMyStudentResources";
import { academicWings } from "../constants/dashboardMockData";

export default function Dashboard() {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  const theme = getDashboardTheme(isDarkMode);
  const vaultTheme = getVaultTheme(isDarkMode);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const progressQuery = useMyProgress();
  const resourcesQuery = useMyStudentResources();
  const { feed } = useDashboard();
  const progress = progressQuery.progress;

  return (
    <div className="min-h-screen font-sans pb-20" style={{ backgroundColor: theme.bg, color: theme.textPrimary }}>
      <main className="pt-4 sm:pt-8 space-y-6 sm:space-y-8">
        <section className="w-full px-3 sm:px-6 lg:px-8">
          <div
            className="relative w-full rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 overflow-hidden"
            style={{ backgroundColor: theme.surface }}
          >
            <div
              className="absolute top-0 right-0 w-64 h-64 blur-3xl rounded-full pointer-events-none opacity-20"
              style={{ backgroundColor: theme.primary }}
            />
            <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-6 sm:gap-8 lg:gap-10">
              <div className="max-w-md">
                <span
                  className="text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full inline-block tracking-wider"
                  style={{ backgroundColor: theme.cardBg, color: theme.textSecondary }}
                >
                  DIGITAL ARCHIVE
                </span>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold mt-3 sm:mt-5 leading-tight">
                  Every resource you need, <span style={{ color: theme.primary }}>all in one place.</span>
                </h1>
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
                  An ambient, peer-fuelled knowledge ecosystem. Tap into decentralized verified lecture notes, exam breakdowns, and high-yield masterclasses while leveling up your scholar rank.
                </p>
                <div className="flex flex-wrap gap-2.5 sm:gap-3 mt-5 sm:mt-6">
                  <motion.div whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 420, damping: 22 }}>
                    <Link
                      to="/resources"
                      className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm text-slate-950"
                      style={{ backgroundColor: theme.primary }}
                    >
                      <BookOpen className="w-4 h-4" />
                      Explore Vault
                    </Link>
                  </motion.div>
                  <motion.button
                    whileHover={{ y: -2, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 420, damping: 22 }}
                    onClick={() => setShowUploadModal(true)}
                    className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm cursor-pointer"
                    style={{ backgroundColor: theme.cardBg, color: theme.textSecondary }}
                  >
                    <CloudUpload className="w-4 h-4" style={{ color: theme.accent }} />
                    Quick Upload / Contribute
                  </motion.button>
                </div>
              </div>
              <GoalCard
                progress={progress}
                resources={resourcesQuery.resources}
                isLoading={progressQuery.isLoading || resourcesQuery.isLoading}
                theme={theme}
              />
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-bold">✽ Browse by Academic Wings</h2>
            <span className="text-[10px]" style={{ color: theme.accent }}>0 studying live</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3">
            {academicWings.map((wing) => (
              <div key={wing.title} className="rounded-2xl p-4 flex items-center gap-3" style={{ backgroundColor: theme.cardBg }}>
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: `${theme.primary}22`, color: theme.primary }}>{wing.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">{wing.title}</p>
                  <p className="text-[9px] mt-1" style={{ color: theme.accent }}>• {wing.studying}</p>
                </div>
                <span className="ml-auto" style={{ color: theme.textMuted }}>›</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: theme.primary }} />
            Trending This Week
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-3">
              {feed?.trending?.items?.length ? (
                feed.trending.items.slice(0, 3).map((item) => (
                  <article key={item.id} className="rounded-2xl p-4 sm:p-5" style={{ backgroundColor: theme.surface }}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[9px] font-bold px-2 py-1 rounded" style={{ backgroundColor: `${theme.primary}1f`, color: theme.primary }}>VERIFIED ARCHIVE</span>
                        <h3 className="font-bold mt-2.5 text-sm sm:text-base">{item.title}</h3>
                        <p className="text-xs leading-relaxed mt-2" style={{ color: theme.textSecondary }}>{item.context}</p>
                        <div className="mt-3 sm:mt-4 flex items-center gap-3 text-[10px]" style={{ color: theme.textMuted }}>
                          <span style={{ color: theme.accent }}>★ {item.rating ?? 0}</span>
                          <span>{(item.downloads ?? 0).toLocaleString()} downloads</span>
                        </div>
                      </div>
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl shrink-0" style={{ background: `radial-gradient(circle at 30% 30%, ${theme.primary}88, ${theme.cardBg})` }} />
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl p-6 sm:p-8 text-center text-xs sm:text-sm" style={{ backgroundColor: theme.surface, color: theme.textSecondary }}>
                  No trending resources yet.
                </div>
              )}
            </div>
            <aside className="rounded-2xl p-4 sm:p-5 h-fit" style={{ backgroundColor: theme.surface }}>
              <h3 className="font-bold text-xs sm:text-sm">♜ Top Masters</h3>
              {feed?.topMasters?.items?.length ? (
                <div className="mt-4 space-y-3">
                  {feed.topMasters.items.slice(0, 3).map((student, index) => (
                    <div key={student.id} className="flex items-center gap-3">
                      <span className="text-xs font-bold" style={{ color: index === 0 ? "#fbbf24" : theme.textMuted }}>{index + 1}</span>
                      <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: theme.cardBg, color: theme.primary }}>{student.name.charAt(0)}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold truncate">{student.name}</p>
                        <p className="text-[10px]" style={{ color: theme.textMuted }}>{student.xp.toLocaleString()} XP</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs mt-4" style={{ color: theme.textMuted }}>No ranked students yet.</p>
              )}
            </aside>
          </div>
        </section>

        <section className="rounded-2xl sm:rounded-[28px] p-5 sm:p-7" style={{ backgroundColor: theme.surface }}>
          <div className="flex flex-wrap justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold">⌁ Live Campus Community Impact</h2>
              <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>Real-time collaboration activity across our global network of verified academic institutions.</p>
            </div>
            <span className="rounded-full px-3 py-1 text-[10px] h-fit" style={{ backgroundColor: theme.cardBg, color: theme.textSecondary }}>Live campus pulse · 2m ago</span>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
            <Metric value={String(feed?.communityImpact?.activeLearners ?? 0)} label="ACTIVE SCHOLARS" color={theme.primary} />
            <Metric value={String(feed?.communityImpact?.resources ?? 0)} label="VERIFIED RESOURCES" color={theme.accent} />
          </div>
        </section>
        </div>
        <UploadResourceModal open={showUploadModal} onClose={() => setShowUploadModal(false)} theme={vaultTheme} />
      </main>
    </div>
  );
}

function GoalCard({
  progress,
  resources,
  isLoading,
  theme,
}: {
  progress: ReturnType<typeof useMyProgress>["progress"];
  resources: ReturnType<typeof useMyStudentResources>["resources"];
  isLoading: boolean;
  theme: ReturnType<typeof getDashboardTheme>;
}) {
  const percentage = progress?.dailyGoal.percentage ?? 0;
  const streak = progress?.streak.current ?? 0;
  const approvedToday = progress?.dailyGoal.activeCount ?? 0;
  const hasUploaded = resources.length > 0;
  const hasSubmitted = resources.some((resource) => resource.status !== "DRAFT");
  const hasApproval = resources.some((resource) => resource.status === "APPROVED");

  const questSteps = [
    {
      id: 1,
      label: "Upload a quality study resource",
      complete: hasUploaded,
      statusLabel: hasUploaded ? "Uploaded to Vault" : "Pending upload",
      icon: CloudUpload,
    },
    {
      id: 2,
      label: "Submit it for admin review",
      complete: hasSubmitted,
      statusLabel: hasSubmitted ? "Submitted • In Review" : "Pending submission",
      icon: Clock3,
    },
    {
      id: 3,
      label: "Receive an admin approval",
      complete: hasApproval,
      statusLabel: hasApproval ? "Approved & Published" : "Awaiting approval",
      icon: Trophy,
    },
  ];

  return (
    <div
      className="w-full lg:w-[410px] flex flex-col justify-between transition-all pt-6 lg:pt-0 p-0 sm:p-5 lg:p-6 rounded-none lg:rounded-[28px] shadow-none lg:shadow-xl bg-transparent lg:bg-[var(--card-bg)]"
      style={{
        ["--card-bg" as string]: theme.cardBg,
      }}
    >
      {/* Top Header: Rank & Streak */}
      <div className="flex justify-between items-center mb-5">
        <span className="font-bold text-xs sm:text-sm flex items-center gap-2" style={{ color: theme.textPrimary }}>
          <Target className="w-4 h-4" style={{ color: theme.accent }} />
          Current rank: {progress?.rank.name ?? "Novice"}
        </span>
        <span
          className="rounded-full px-3 py-1 text-[10px] font-bold tracking-wide shadow-sm"
          style={{ backgroundColor: theme.bg, color: theme.accent }}
        >
          {streak} Day Streak
        </span>
      </div>

      {isLoading ? (
        <LoadingText />
      ) : (
        <>
          {/* Circular Progress & Goal Counter */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-[5px] shrink-0 flex flex-col items-center justify-center transition-all duration-500 shadow-sm"
              style={{
                borderColor: percentage === 100 ? theme.accent : theme.primary,
                backgroundColor: `${theme.bg}80`,
              }}
            >
              <span className="text-base sm:text-lg font-extrabold" style={{ color: theme.textPrimary }}>
                {percentage}%
              </span>
              <span className="text-[7px] font-bold tracking-wider" style={{ color: theme.textMuted }}>
                GOAL
              </span>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold" style={{ color: theme.primary }}>
                {approvedToday} / {progress?.dailyGoal.target ?? 3} approved today
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: theme.accent }}>
                Only approvals advance your daily goal
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: theme.textMuted }}>
                Complete each step to advance your rank.
              </p>
            </div>
          </div>

          {/* Inspiration-inspired Pill Track for Quest Steps - Free of heavy boxes on mobile */}
          <div className="relative space-y-2 sm:space-y-2.5">
            {/* Subtle vertical guide rail connecting the capsule notches */}
            <div
              className="absolute right-[21px] sm:right-7 top-4 bottom-4 w-[2px] rounded-full pointer-events-none opacity-20"
              style={{ backgroundColor: theme.textMuted }}
            />

            {questSteps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.32, delay: index * 0.08 }}
                  className="relative flex items-center justify-between gap-3 py-3 px-1 sm:px-3.5 sm:py-2.5 rounded-none sm:rounded-2xl transition-all duration-300 bg-transparent sm:bg-[var(--step-bg)]"
                  style={{
                    ["--step-bg" as string]: step.complete ? "rgba(74, 222, 128, 0.09)" : theme.bg,
                  }}
                >
                  {/* Left Label & Completed Sub-Badge - Never truncated, full breathing room */}
                  <div className="flex flex-col min-w-0 flex-1 pr-2">
                    <span
                      className="text-xs sm:text-sm font-semibold leading-relaxed break-words transition-colors duration-200"
                      style={{
                        color: step.complete ? "#4ade80" : theme.textPrimary,
                      }}
                    >
                      {step.label}
                    </span>
                    <span
                      className="text-[10px] sm:text-[11px] font-medium mt-1 flex items-center gap-1.5"
                      style={{
                        color: step.complete ? "#86efac" : theme.textMuted,
                      }}
                    >
                      {step.complete && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                      {step.statusLabel}
                    </span>
                  </div>

                  {/* Right Pill Icon Badge */}
                  <div className="relative flex items-center gap-2 shrink-0">
                    {/* The rounded pill badge with icon */}
                    <div
                      className="px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all duration-300 shadow-sm"
                      style={{
                        backgroundColor: step.complete
                          ? "rgba(74, 222, 128, 0.18)"
                          : "rgba(255, 255, 255, 0.04)",
                        color: step.complete ? "#4ADE80" : theme.textMuted,
                      }}
                    >
                      <StepIcon className="w-4 h-4" />
                      {step.complete && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>

                    {/* Capsule slider notch */}
                    <div
                      className="w-2.5 h-4 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: step.complete ? "#4ADE80" : theme.border,
                        boxShadow: step.complete ? "0 0 8px rgba(74, 222, 128, 0.5)" : "none",
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function Metric({ value, label, color, detail }: { value: string; label: string; color: string; detail?: string }) { return <div><p className="text-2xl font-extrabold" style={{ color }}>{value}</p><p className="text-[10px] tracking-wider mt-1" style={{ color: "#64748B" }}>{label}</p>{detail && <p className="text-[10px] mt-1" style={{ color: "#4ade80" }}>{detail}</p>}</div>; }
function LoadingText() { return <p className="text-sm text-slate-400">Loading…</p>; }
