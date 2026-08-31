import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import UploadResourceModal from "../components/UploadResourceModal";
import ResourceCard from "../components/ResourceCard";
import { getVaultTheme } from "../constants/theme";
import { CATEGORY_LABELS } from "../constants/categoryLabels";
import { FILE_FORMATS } from "../../../types/resource";
import { useTaxonomy } from "../../../hooks/useTaxonomy";
import { useResources } from "../hooks/useResources";
import { getUserFriendlyError, logTechnicalError } from "../../../lib/errors/getUserFriendlyError";
import {
  ChevronDown,
  Search,
  Heart,
  History,
  Trophy,
  Inbox,
  AlertTriangle,
  RotateCw,
} from "lucide-react";

const FILTER_TABS = ["All Resources", ...CATEGORY_LABELS];

export default function Vault() {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedFileType, setSelectedFileType] = useState("All");
  const [activeFilterTab, setActiveFilterTab] = useState("All Resources");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const theme = getVaultTheme(isDarkMode);
  const { departments, levels, isLoading: taxonomyLoading } = useTaxonomy();
  const { resources, isLoading, isError, error, isEmpty, refetch, isRefetching } = useResources();

  if (isError) {
    logTechnicalError("[Vault]", error);
  }

  const filteredResources = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return resources.filter((resource) => {
      if (selectedLevel !== "All" && resource.level !== selectedLevel) return false;
      if (selectedDepartment !== "All" && resource.department !== selectedDepartment) return false;
      if (selectedFileType !== "All" && resource.fileType !== selectedFileType) return false;
      if (activeFilterTab !== "All Resources" && resource.category !== activeFilterTab) return false;

      if (query.length > 0) {
        const haystack = `${resource.title} ${resource.courseCode} ${resource.courseName}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });
  }, [resources, selectedLevel, selectedDepartment, selectedFileType, activeFilterTab, searchQuery]);

  const hasActiveFilters =
    selectedLevel !== "All" ||
    selectedDepartment !== "All" ||
    selectedFileType !== "All" ||
    activeFilterTab !== "All Resources" ||
    searchQuery.trim().length > 0;

  const clearFilters = () => {
    setSelectedLevel("All");
    setSelectedDepartment("All");
    setSelectedFileType("All");
    setActiveFilterTab("All Resources");
    setSearchQuery("");
  };

  const noFilterMatches = !isLoading && !isError && !isEmpty && filteredResources.length === 0;

  return (
    <div
      className="min-h-screen pb-12"
      style={{
        fontFamily: "Inter, sans-serif",
        backgroundColor: theme.bg,
        color: theme.textPrimary,
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="pt-8 pb-6">
          <h1 className="text-3xl font-bold mb-2 tracking-tight" style={{ color: theme.textPrimary }}>
            The Vault
          </h1>
          <p className="text-sm md:text-base max-w-2xl mb-8" style={{ color: theme.textSecondary }}>
            Access thousands of verified study resources, lecture notes, and practice exams
            curated by the community for academic excellence.
          </p>

          {/* Search Bar */}
          <div 
            className="flex items-center gap-3 px-4 py-3 rounded-xl border mb-6"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.border,
            }}
          >
            <Search className="w-5 h-5" style={{ color: theme.textMuted }} />
            <input
              type="text"
              placeholder="Search by course code, title, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent focus:outline-none text-sm md:text-base"
              style={{ color: theme.textPrimary }}
            />
            <div 
              className="hidden md:flex items-center justify-center px-2 py-1 rounded text-xs font-semibold"
              style={{ backgroundColor: theme.accentBg, color: theme.textMuted }}
            >
              ⌘ K
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilterTab(tab)}
                  className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
                  style={{
                    backgroundColor: activeFilterTab === tab ? theme.primary + "20" : "transparent",
                    color: activeFilterTab === tab ? theme.primary : theme.textSecondary,
                    border: activeFilterTab === tab ? `1px solid ${theme.primary}40` : `1px solid transparent`,
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Dropdowns */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {/* Level Dropdown */}
              <div className="relative shrink-0">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  disabled={taxonomyLoading}
                  className="appearance-none outline-none flex items-center gap-2 pl-3 pr-8 py-1.5 rounded-lg border text-sm cursor-pointer hover:bg-white/5 transition-colors"
                  style={{ backgroundColor: theme.cardBg, borderColor: theme.border, color: theme.textSecondary }}
                >
                  <option value="All">Level: All</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>Level {level}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: theme.textSecondary }} />
              </div>
              {/* Department Dropdown */}
              <div className="relative shrink-0">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  disabled={taxonomyLoading}
                  className="appearance-none outline-none flex items-center gap-2 pl-3 pr-8 py-1.5 rounded-lg border text-sm cursor-pointer hover:bg-white/5 transition-colors"
                  style={{ backgroundColor: theme.cardBg, borderColor: theme.border, color: theme.textSecondary }}
                >
                  <option value="All">Department: All</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: theme.textSecondary }} />
              </div>
              {/* File Type Dropdown */}
              <div className="relative shrink-0">
                <select
                  value={selectedFileType}
                  onChange={(e) => setSelectedFileType(e.target.value)}
                  className="appearance-none outline-none flex items-center gap-2 pl-3 pr-8 py-1.5 rounded-lg border text-sm cursor-pointer hover:bg-white/5 transition-colors"
                  style={{ backgroundColor: theme.cardBg, borderColor: theme.border, color: theme.textSecondary }}
                >
                  <option value="All">File Type: All</option>
                  {FILE_FORMATS.map((format) => (
                    <option key={format} value={format}>{format}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: theme.textSecondary }} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Resource Grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: theme.textPrimary }}>
                Recommended for You
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              </h2>
              <div className="flex items-center gap-2 text-sm" style={{ color: theme.textSecondary }}>
                <span>Sort by:</span>
                <div className="relative">
                  <select
                    className="appearance-none outline-none flex items-center gap-2 pl-3 pr-8 py-1.5 rounded-lg border text-sm cursor-pointer hover:bg-white/5 transition-colors"
                    style={{ backgroundColor: theme.cardBg, borderColor: theme.border, color: theme.textSecondary }}
                  >
                    <option value="Trending">Trending</option>
                    <option value="Latest">Latest</option>
                    <option value="Oldest">Oldest</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: theme.textSecondary }} />
                </div>
              </div>
            </div>

            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border p-5 h-64 animate-pulse"
                    style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
                  />
                ))}
              </div>
            )}

            {!isLoading && isError && (
              <div
                className="rounded-2xl border p-10 flex flex-col items-center justify-center text-center"
                style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
              >
                <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center" style={{ backgroundColor: theme.accentBg }}>
                  <AlertTriangle className="w-5 h-5" style={{ color: theme.textMuted }} />
                </div>
                <p className="text-sm font-medium mb-1" style={{ color: theme.textPrimary }}>
                  Couldn't load the Vault
                </p>
                <p className="text-xs mb-4" style={{ color: theme.textMuted }}>
                  {getUserFriendlyError(error)}
                </p>
                <button
                  onClick={() => refetch()}
                  disabled={isRefetching}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-60 cursor-pointer"
                  style={{ backgroundColor: theme.primary, color: "#FFFFFF" }}
                >
                  <RotateCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} />
                  {isRefetching ? "Retrying..." : "Try Again"}
                </button>
              </div>
            )}

            {!isLoading && !isError && isEmpty && (
              <div
                className="rounded-2xl border p-10 flex flex-col items-center justify-center text-center"
                style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
              >
                <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center" style={{ backgroundColor: theme.accentBg }}>
                  <Inbox className="w-5 h-5" style={{ color: theme.textMuted }} />
                </div>
                <p className="text-sm font-medium mb-1" style={{ color: theme.textPrimary }}>
                  No resources yet
                </p>
                <p className="text-xs" style={{ color: theme.textMuted }}>
                  The admin hasn't uploaded any resources yet. Check back soon.
                </p>
              </div>
            )}

            {noFilterMatches && (
              <div
                className="rounded-2xl border p-10 flex flex-col items-center justify-center text-center"
                style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
              >
                <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center" style={{ backgroundColor: theme.accentBg }}>
                  <Inbox className="w-5 h-5" style={{ color: theme.textMuted }} />
                </div>
                <p className="text-sm font-medium mb-1" style={{ color: theme.textPrimary }}>
                  No resources match your filters
                </p>
                <p className="text-xs mb-4" style={{ color: theme.textMuted }}>
                  Try adjusting or clearing your filters.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:brightness-110 cursor-pointer"
                    style={{ backgroundColor: theme.primary, color: "#FFFFFF" }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {!isLoading && !isError && !isEmpty && filteredResources.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ResourceCard resource={resource} theme={theme} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {!isLoading && !isError && !isEmpty && !noFilterMatches && (
              <div className="mt-8 flex justify-center">
                <button 
                  className="px-6 py-2.5 rounded-full text-sm font-medium transition-colors hover:bg-white/10 cursor-pointer"
                  style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
                >
                  Load More Resources
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
            
            {/* My Favorites (Empty State) */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm" style={{ color: theme.textPrimary }}>
                  My Favorites
                </h3>
                <Heart className="w-4 h-4" style={{ color: theme.textSecondary }} />
              </div>
              <div 
                className="rounded-xl border p-6 flex flex-col items-center justify-center text-center"
                style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
              >
                <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center" style={{ backgroundColor: theme.accentBg }}>
                  <Heart className="w-5 h-5" style={{ color: theme.textMuted }} />
                </div>
                <p className="text-sm font-medium mb-1" style={{ color: theme.textSecondary }}>No favorites yet</p>
                <p className="text-xs" style={{ color: theme.textMuted }}>
                  Click the heart icon on any resource to save it here for quick access later.
                </p>
              </div>
            </div>

            {/* Recently Viewed (Empty State) */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm" style={{ color: theme.textPrimary }}>
                  Recently Viewed
                </h3>
              </div>
              <div 
                className="rounded-xl border p-6 flex flex-col items-center justify-center text-center"
                style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
              >
                <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center" style={{ backgroundColor: theme.accentBg }}>
                  <History className="w-5 h-5" style={{ color: theme.textMuted }} />
                </div>
                <p className="text-sm font-medium mb-1" style={{ color: theme.textSecondary }}>No history</p>
                <p className="text-xs" style={{ color: theme.textMuted }}>
                  Resources you view or preview will appear here so you can easily find them again.
                </p>
              </div>
            </div>

            {/* Vault Contributor Promo */}
            <div 
              className="rounded-xl p-6 relative overflow-hidden"
              style={{ backgroundColor: theme.primary }}
            >
              {/* Background accent */}
              <div className="absolute -bottom-4 -right-4 opacity-20 pointer-events-none">
                <Trophy className="w-24 h-24 text-white" />
              </div>
              
              <div className="relative z-10">
                <h3 className="font-bold text-white text-base mb-2">Vault Contributor?</h3>
                <p className="text-white/80 text-xs mb-6 leading-relaxed">
                  Upload high-quality notes to earn XP and reach the top of the leaderboard.
                </p>
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2 rounded-lg text-xs font-bold transition-transform hover:scale-105 active:scale-95"
                  style={{ backgroundColor: "#1e293b", color: "#FFFFFF" }}
                >
                  Start Uploading
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <UploadResourceModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        theme={theme}
      />
    </div>
  )
}
