import { motion } from "motion/react";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import MOCK_RESOURCES from "../constants/mock_resources";
import UploadResourceModal from "../components/UploadResourceModal";
import { getVaultTheme } from "../constants/theme";
import DEPARTMENTS from "../../auth/constants/departments";
import { 
  FileText,
  ChevronDown,
  Eye,
  Download,
  FileCode,
  File,
  Search,
  Heart,
  History,
  CheckCircle2,
  PlaySquare,
  BookOpen,
  Trophy
} from "lucide-react";

export default function Vault() {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedFileType, setSelectedFileType] = useState("All");
  const [activeFilterTab, setActiveFilterTab] = useState("All Resources");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const theme = getVaultTheme(isDarkMode);
    
  const getFileIcon = (fileType: string) => {
    switch (fileType.toUpperCase()) {
      case "PDF":
        return <FileText className="w-5 h-5" />;
      case "DOCX":
      case "DOC":
        return <File className="w-5 h-5" />
      case "CODE":
        return <FileCode className="w-5 h-5" />
      case "VIDEO":
        return <PlaySquare className="w-5 h-5" />
      case "PPTX":
        return <BookOpen className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
      }
    };

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
              {["All Resources", "Study Guides", "Past Exams", "Notes"].map((tab) => (
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
                  className="appearance-none outline-none flex items-center gap-2 pl-3 pr-8 py-1.5 rounded-lg border text-sm cursor-pointer hover:bg-white/5 transition-colors"
                  style={{ backgroundColor: theme.cardBg, borderColor: theme.border, color: theme.textSecondary }}
                >
                  <option value="All">Level: All</option>
                  <option value="100 level">100 Level</option>
                  <option value="200 level">200 Level</option>
                  <option value="300 level">300 Level</option>
                  <option value="400 level">400 Level</option>
                  <option value="500 level">500 Level</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: theme.textSecondary }} />
              </div>
              {/* Department Dropdown */}
              <div className="relative shrink-0">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="appearance-none outline-none flex items-center gap-2 pl-3 pr-8 py-1.5 rounded-lg border text-sm cursor-pointer hover:bg-white/5 transition-colors"
                  style={{ backgroundColor: theme.cardBg, borderColor: theme.border, color: theme.textSecondary }}
                >
                  <option value="All">Department: All</option>
                  {DEPARTMENTS.map((dept) => (
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
                  <option value="PDF">PDF</option>
                  <option value="DOCX">DOCX / DOC</option>
                  <option value="PPTX">PPTX</option>
                  <option value="CODE">CODE</option>
                  <option value="VIDEO">VIDEO</option>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_RESOURCES.map((resource, index) => (
                <motion.article
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="rounded-2xl border p-5 flex flex-col transition-all duration-300 hover:border-slate-600 hover:bg-white/[0.02]"
                  style={{
                    backgroundColor: theme.cardBg,
                    borderColor: theme.border,
                  }}
                >
                  {/* Top Row: Icon and Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: theme.accentBg, color: theme.textSecondary }}
                    >
                      {getFileIcon(resource.fileType)}
                    </div>
                    {/* Verified Badge & Favorite */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-2 py-1 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-wider uppercase">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </div>
                      <button className="p-1.5 rounded-full transition-colors hover:bg-white/10 cursor-pointer text-slate-400 hover:text-rose-400">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Course Code & Type */}
                  <div className="text-[11px] font-bold tracking-wider uppercase mb-2" style={{ color: theme.textMuted }}>
                    {resource.courseCode} · {resource.fileType}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold mb-2 leading-snug line-clamp-2" style={{ color: theme.textPrimary }}>
                    {resource.title}
                  </h3>
                  <p className="text-xs line-clamp-2 mb-4" style={{ color: theme.textSecondary }}>
                    Comprehensive notes covering {resource.courseName} topics.
                  </p>

                  {/* Tags */}
                  <div className="flex items-center gap-2 mb-4">
                    <span 
                      className="text-[11px] font-medium px-2 py-1 rounded"
                      style={{ backgroundColor: theme.accentBg, color: theme.textSecondary }}
                    >
                      Level {resource.level}
                    </span>
                    <span 
                      className="text-[11px] font-medium px-2 py-1 rounded"
                      style={{ backgroundColor: theme.accentBg, color: theme.textSecondary }}
                    >
                      CS
                    </span>
                  </div>

                  {/* Spacer to push footer down */}
                  <div className="flex-1"></div>

                  {/* Uploader & Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-600 overflow-hidden shrink-0">
                        {/* Placeholder for avatar */}
                        <div className="w-full h-full bg-linear-to-tr from-slate-400 to-slate-300"></div>
                      </div>
                      <span className="text-xs font-semibold" style={{ color: theme.textPrimary }}>
                        {resource.uploadedBy}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-400">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs font-bold">4.9</span>
                    </div>
                  </div>

                  {/* Stats & Time */}
                  <div className="flex items-center justify-between mb-4 text-[11px]" style={{ color: theme.textMuted }}>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{resource.stats.views > 1000 ? (resource.stats.views/1000).toFixed(1) + 'k' : resource.stats.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" />
                        <span>{resource.stats.downloads > 1000 ? (resource.stats.downloads/1000).toFixed(1) + 'k' : resource.stats.downloads}</span>
                      </div>
                    </div>
                    <span>{resource.timestamp}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button 
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all hover:brightness-110 cursor-pointer"
                      style={{ backgroundColor: theme.primary, color: "#FFFFFF" }}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button 
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5 cursor-pointer"
                      style={{ borderColor: theme.border, color: theme.textSecondary }}
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Load More Button */}
            <div className="mt-8 flex justify-center">
              <button 
                className="px-6 py-2.5 rounded-full text-sm font-medium transition-colors hover:bg-white/10 cursor-pointer"
                style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
              >
                Load More Resources
              </button>
            </div>
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