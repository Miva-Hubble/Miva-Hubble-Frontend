import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import UploadResourceModal from "../components/UploadResourceModal";
import { VaultResourceCard } from "../components/VaultResourceCard";
import MyResourceCard from "../components/MyResourceCard";
import { getVaultTheme } from "../constants/theme";
import { FILE_FORMATS } from "../../../types/resource";
import { useTaxonomy } from "../../../hooks/useTaxonomy";
import { useVaultResources } from "../hooks/useVaultResources";
import { useMyStudentResources } from "../hooks/useMyStudentResources";
import { getUserFriendlyError, logTechnicalError } from "../../../lib/errors/getUserFriendlyError";
import {
  ChevronDown,
  Search,
  Heart,
  History,
  Inbox,
  AlertTriangle,
  RotateCw,
  Upload,
} from "lucide-react";

const FILTER_TABS = ["All Resources", "My Resources"];

export default function Vault() {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedFileType, setSelectedFileType] = useState("All");
  const [activeFilterTab, setActiveFilterTab] = useState("All Resources");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const theme = getVaultTheme(isDarkMode);
  const { departments, levels, isLoading: taxonomyLoading } = useTaxonomy();
  const { resources, isLoading, isError, error, refetch, isRefetching } = useVaultResources();
  const {
    resources: myStudentResources,
    isLoading: myResourcesLoading,
    isError: myResourcesError,
    refetch: refetchMyResources,
  } = useMyStudentResources();

  useEffect(() => {
    if (searchParams.get("upload") === "1") {
      setShowUploadModal(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  if (isError) {
    logTechnicalError("[Vault]", error);
  }

  const isMyResourcesTab = activeFilterTab === "My Resources";

  const filteredResources = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return resources.filter((resource) => {
      if (selectedLevel !== "All" && resource.level !== selectedLevel) return false;
      if (selectedDepartment !== "All" && resource.department !== selectedDepartment) return false;
      if (selectedFileType !== "All" && resource.fileFormat !== selectedFileType) return false;
      if (query.length > 0) {
        const haystack = `${resource.title} ${resource.courseCode} ${resource.courseTitle} ${resource.description ?? ""}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });
  }, [resources, selectedLevel, selectedDepartment, selectedFileType, activeFilterTab, searchQuery]);

  const filteredMyResources = useMemo(() => {
    if (!isMyResourcesTab) return [];
    const query = searchQuery.trim().toLowerCase();
    return myStudentResources.filter((item) => {
      if (selectedLevel !== "All" && item.level !== selectedLevel) return false;
      if (selectedDepartment !== "All" && item.department !== selectedDepartment) return false;
      if (query.length > 0) {
        const haystack = `${item.title} ${item.courseTitle} ${item.department}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [isMyResourcesTab, myStudentResources, searchQuery, selectedLevel, selectedDepartment]);

  const hasActiveFilters =
    selectedLevel !== "All" ||
    selectedDepartment !== "All" ||
    selectedFileType !== "All" ||
    searchQuery.trim().length > 0;

  const clearFilters = () => {
    setSelectedLevel("All");
    setSelectedDepartment("All");
    setSelectedFileType("All");
    setActiveFilterTab("All Resources");
    setSearchQuery("");
  };

  const isEmpty = !isLoading && !isError && resources.length === 0;
  const noFilterMatches = !isMyResourcesTab && !isLoading && !isError && !isEmpty && filteredResources.length === 0;

  return (
    <div
      className="pb-16 font-sans transition-colors duration-300"
      style={{
        backgroundColor: theme.bg,
        color: theme.textPrimary,
      }}
    >
      <div className="w-full">
        
        {/* Header Section */}
        <div className="pt-2 pb-5 sm:pt-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3 sm:mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-1 tracking-tight" style={{ color: theme.textPrimary }}>
                The Vault
              </h1>
              <p className="text-xs sm:text-sm max-w-2xl text-slate-400">
                Access thousands of verified study resources, lecture notes, and practice exams
                curated by the community for academic excellence.
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0 self-start sm:self-center"
              style={{ backgroundColor: theme.primary }}
            >
              <Upload className="w-4 h-4" />
              Upload Resource
            </button>
          </div>

          {/* Search Bar — Apple-style integrated pill */}
          <div 
            className="flex items-center gap-3 px-4 py-2.5 sm:py-3 rounded-2xl shadow-sm mb-4 sm:mb-6"
            style={{
              backgroundColor: theme.cardBg,
              border: "1px solid rgba(255, 255, 255, 0.07)",
            }}
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, course, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent focus:outline-none text-xs sm:text-sm"
              style={{ color: theme.textPrimary }}
            />
            <div 
              className="hidden md:flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-semibold"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.06)", color: theme.textMuted }}
            >
              ⌘ K
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
            {/* Filter Tabs — Apple-style soft pill chips */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
              {FILTER_TABS.map((tab) => {
                const isActive = activeFilterTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveFilterTab(tab)}
                    className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all active:scale-95 cursor-pointer"
                    style={{
                      backgroundColor: isActive ? theme.primary + "25" : "rgba(255, 255, 255, 0.05)",
                      color: isActive ? theme.primary : theme.textSecondary,
                    }}
                  >
                    {tab}
                    {tab === "My Resources" && myStudentResources.length > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        {myStudentResources.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Dropdowns — sleek rounded chips without harsh borders */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
              {/* Level Dropdown */}
              <div className="relative shrink-0">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  disabled={taxonomyLoading}
                  className="appearance-none outline-none flex items-center gap-2 pl-3 pr-7 py-1.5 rounded-xl text-xs sm:text-sm cursor-pointer hover:bg-white/5 transition-colors"
                  style={{
                    backgroundColor: theme.cardBg,
                    border: "1px solid rgba(255, 255, 255, 0.07)",
                    color: theme.textSecondary,
                  }}
                >
                  <option value="All">Level: All</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>Level {level}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: theme.textSecondary }} />
              </div>
              {/* Department Dropdown */}
              <div className="relative shrink-0">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  disabled={taxonomyLoading}
                  className="appearance-none outline-none flex items-center gap-2 pl-3 pr-7 py-1.5 rounded-xl text-xs sm:text-sm cursor-pointer hover:bg-white/5 transition-colors"
                  style={{
                    backgroundColor: theme.cardBg,
                    border: "1px solid rgba(255, 255, 255, 0.07)",
                    color: theme.textSecondary,
                  }}
                >
                  <option value="All">Department: All</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: theme.textSecondary }} />
              </div>
              {/* File Type Dropdown */}
              {!isMyResourcesTab && (
                <div className="relative shrink-0">
                  <select
                    value={selectedFileType}
                    onChange={(e) => setSelectedFileType(e.target.value)}
                    className="appearance-none outline-none flex items-center gap-2 pl-3 pr-7 py-1.5 rounded-xl text-xs sm:text-sm cursor-pointer hover:bg-white/5 transition-colors"
                    style={{
                      backgroundColor: theme.cardBg,
                      border: "1px solid rgba(255, 255, 255, 0.07)",
                      color: theme.textSecondary,
                    }}
                  >
                    <option value="All">File Type: All</option>
                    {FILE_FORMATS.map((format) => (
                      <option key={format} value={format}>{format}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: theme.textSecondary }} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          
          {/* Left Column: Resource Grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2" style={{ color: theme.textPrimary }}>
                {isMyResourcesTab ? "My Uploaded Resources" : "Recommended for You"}
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              </h2>
            </div>

            {/* ================= MY RESOURCES TAB ================= */}
            {isMyResourcesTab && (
              <>
                {myResourcesLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <div
                        key={index}
                        className="rounded-3xl p-5 h-48 animate-pulse"
                        style={{ backgroundColor: theme.cardBg }}
                      />
                    ))}
                  </div>
                )}

                {!myResourcesLoading && myResourcesError && (
                  <div
                    className="rounded-3xl p-8 text-center"
                    style={{ backgroundColor: theme.cardBg, border: "1px solid rgba(255, 255, 255, 0.07)" }}
                  >
                    <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-rose-400" />
                    <p className="text-sm font-semibold mb-1" style={{ color: theme.textPrimary }}>
                      Couldn't load your uploads
                    </p>
                    <button
                      onClick={() => refetchMyResources()}
                      className="mt-3 px-4 py-2 rounded-xl text-xs font-semibold"
                      style={{ backgroundColor: theme.primary, color: "#FFFFFF" }}
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {!myResourcesLoading && !myResourcesError && myStudentResources.length === 0 && (
                  <div
                    className="rounded-3xl p-8 sm:p-12 text-center shadow-sm"
                    style={{ backgroundColor: theme.cardBg, border: "1px solid rgba(255, 255, 255, 0.07)" }}
                  >
                    <div
                      className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                    >
                      <Upload className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold mb-1" style={{ color: theme.textPrimary }}>
                      No uploaded resources yet
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto mb-5">
                      Upload your lecture notes, study guides, or past questions to earn XP and help fellow Hubblites.
                    </p>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white shadow-md cursor-pointer transition-all active:scale-95"
                      style={{ backgroundColor: theme.primary }}
                    >
                      Upload a Resource
                    </button>
                  </div>
                )}

                {!myResourcesLoading && filteredMyResources.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredMyResources.map((item, index) => (
                      <MyResourceCard
                        key={item.id}
                        resource={item}
                        theme={theme}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ================= STANDARD LIBRARY RESOURCES ================= */}
            {!isMyResourcesTab && (
              <>
                {isLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="rounded-3xl p-5 h-64 animate-pulse"
                        style={{ backgroundColor: theme.cardBg }}
                      />
                    ))}
                  </div>
                )}

                {!isLoading && isError && (
                  <div
                    className="rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-sm"
                    style={{ backgroundColor: theme.cardBg, border: "1px solid rgba(255, 255, 255, 0.07)" }}
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
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-60 cursor-pointer"
                      style={{ backgroundColor: theme.primary, color: "#FFFFFF" }}
                    >
                      <RotateCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} />
                      {isRefetching ? "Retrying..." : "Try Again"}
                    </button>
                  </div>
                )}

                {!isLoading && !isError && isEmpty && (
                  <div
                    className="rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-sm"
                    style={{ backgroundColor: theme.cardBg, border: "1px solid rgba(255, 255, 255, 0.07)" }}
                  >
                    <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center" style={{ backgroundColor: theme.accentBg }}>
                      <Inbox className="w-5 h-5" style={{ color: theme.textMuted }} />
                    </div>
                    <p className="text-sm font-medium mb-1" style={{ color: theme.textPrimary }}>
                      No resources yet
                    </p>
                    <p className="text-xs" style={{ color: theme.textMuted }}>
                      No approved resources match your level and department yet.
                    </p>
                  </div>
                )}

                {noFilterMatches && (
                  <div
                    className="rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-sm"
                    style={{ backgroundColor: theme.cardBg, border: "1px solid rgba(255, 255, 255, 0.07)" }}
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
                        className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:brightness-110 cursor-pointer"
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
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: index * 0.04 }}
                      >
                        <VaultResourceCard resource={resource} theme={theme} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <div className="w-full lg:w-80 shrink-0 space-y-5 sm:space-y-6">
            
            {/* My Favorites (Empty State) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-xs sm:text-sm" style={{ color: theme.textPrimary }}>
                  My Favorites
                </h3>
                <Heart className="w-4 h-4" style={{ color: theme.textSecondary }} />
              </div>
              <div 
                className="rounded-3xl p-5 sm:p-6 flex flex-col items-center justify-center text-center shadow-sm"
                style={{
                  backgroundColor: theme.cardBg,
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                }}
              >
                <div className="w-10 h-10 rounded-2xl mb-2.5 flex items-center justify-center" style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
                  <Heart className="w-4 h-4" style={{ color: theme.textMuted }} />
                </div>
                <p className="text-xs sm:text-sm font-medium mb-1" style={{ color: theme.textSecondary }}>No favorites yet</p>
                <p className="text-[11px] leading-relaxed" style={{ color: theme.textMuted }}>
                  Click the heart icon on any resource to save it here for quick access later.
                </p>
              </div>
            </div>

            {/* Recently Viewed (Empty State) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-xs sm:text-sm" style={{ color: theme.textPrimary }}>
                  Recently Viewed
                </h3>
              </div>
              <div 
                className="rounded-3xl p-5 sm:p-6 flex flex-col items-center justify-center text-center shadow-sm"
                style={{
                  backgroundColor: theme.cardBg,
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                }}
              >
                <div className="w-10 h-10 rounded-2xl mb-2.5 flex items-center justify-center" style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
                  <History className="w-4 h-4" style={{ color: theme.textMuted }} />
                </div>
                <p className="text-xs sm:text-sm font-medium mb-1" style={{ color: theme.textSecondary }}>No history</p>
                <p className="text-[11px] leading-relaxed" style={{ color: theme.textMuted }}>
                  Resources you view or preview will appear here so you can easily find them again.
                </p>
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
  );
}
