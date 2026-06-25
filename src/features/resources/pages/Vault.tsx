import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import MOCK_RESOURCES from "../constants/mock_resources";
import UploadResourceModal from "../components/UploadResourceModal";
import { getVaultTheme } from "../constants/theme";
import { 
  Library,
  Home,
  UserCircle,
  Sparkles,
  GraduationCap,
  FileText,
  BookMarked,
  Star,
  Filter,
  ChevronDown,
  BookOpen,
  FolderOpen,
  Clock,
  ThumbsUp,
  MessageCircle,
  Eye,
  Download,
  FileCode,
  File,
  Search,
  Upload
} from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";

export default function Vault() {
  const navigate = useNavigate();
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  const [activeNav, setActiveNav] = useState("vault");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
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
      default:
        return <FileText className="w-5 h-5" />
      }
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
    <div className="flex w-full max-w-7xl mx-auto">
      {/* Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20}}
        animate={{ opacity: 1, x: 0}}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="hidden lg:block w-72 min-h-screen p-4 sticky top-20 h-fit"
      >
      
        {/* Navigation */}
        <nav className="space-y-2 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setActiveNav("feed");
              navigate("../../feed/pages/Feed")
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
            style={{
              backgroundColor: activeNav === "feed" ? theme.primary + "20" : "transparent",
              color: activeNav === "feed" ? theme.primary : theme.textSecondary,
            }}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setActiveNav("vault");
              navigate("/resources");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
            style={{
              backgroundColor: activeNav === "vault" ? theme.primary : "transparent",
              color: activeNav === "vault" ? "#FFFFFF" : theme.textPrimary, 
            }}
          >
            <Library className="w-5 h-5" />
            <span className="font-semibold">Resource Vault</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, x: 5}}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setActiveNav("me");
              navigate("/profile");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
            style={{
              backgroundColor: activeNav === "me" ? theme.primary : "transparent",
              color: activeNav === "me" ? "#FFFFFF" : theme.textPrimary,
            }}
          >
            <UserCircle className="w-5 h-5" />
            <span className="font-semibold">My Profile</span>
          </motion.button>
        </nav>  

        {/* Recommended for You Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl p-4 border mb-4"
          style={{
            backgroundColor: theme.cardBg,
            borderColor: theme.border,
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5" style={{ color: theme.primary }} />
            <h3 className="font-bold" style={{ color: theme.textPrimary }}>
              Recommended for You
            </h3>
          </div>
          <div className="space-y-3">
            {/* User Context */}
            <div 
              className="p-3 rounded-xl"
              style={{
              backgroundColor: theme.accentBg,
              }}  
            >
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-4 h-4" style={{ color: theme.accent}} />
                <span className="text-xs font-semibold" style={{ color: theme.textSecondary}}>
                  Based on your profile
                </span>
              </div>
              <p className="text-sm font-bold" style={{color: theme.textPrimary }}>
                Computer Science • Level 300
              </p>
          </div>

          {/* Popular in Your Course */}
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: theme.textMuted }} >
              POPULAR IN YOUR COURSES
            </p>
            <div className="space-y-2">
              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                className="w-full text-left p-3 rounded-xl transition-all duration-200"
                style={{
                  backgroundColor: theme.accentBg,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4" style={{ color: theme.accent }} />
                  <span className="text-sm font-semibold" style={{ color: theme.textPrimary }}>
                    CSC 302 Past Questions
                  </span>
                </div>
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  189 downloads this week
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                className="w-full text-left p-3 rounded-xl transition-all duration-200"
                style={{
                  backgroundColor: theme.accentBg,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <BookMarked className="w-4 h-4" style={{ color: theme.primary }} />
                  <span className="text-sm font-semibold" style={{ color: theme.textPrimary}}>
                    Database Study Guide 
                  </span>
                </div>

                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  156 downloads this week
                </p>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-4 rounded-2xl p-4 border"
        style={{
          backgroundColor: theme.cardBg,
          borderColor: theme.border,
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-5 h-5" style={{ color: theme.accentLight }} />
          <h3 className="font-bold text-sm" style={{ color: theme.textPrimary}}>
            Your Activity
          </h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: theme.textSecondary }}>Downloads</span>
            <span className="font-semibold" style={{ color: theme.textPrimary }}>42</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: theme.textSecondary }}>Uploads</span>
            <span className="font-semibold" style={{ color: theme.textPrimary }}>8</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: theme.textSecondary }}>Downloads</span>
            <span className="font-semibold" style={{ color: theme.textPrimary }}>23</span>
          </div>
        </div>
      </motion.div>
    </motion.aside>

    {/* Main Content */}
    <main className="flex-1 min-w-0 min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center"
        >
          <div className="inline-flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor: theme.primary + "20",
              }}
            >
              <Library className="w-7 h-7" style={{ color: theme.primary }} />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: theme.textPrimary }}>
            Miva Resource Library
          </h1>
          <p className="text-lg" style={{ color: theme.textSecondary }}>
            Your academic knowledge repository - Explore, learn, and share 
          </p>
        </motion.div>

        {/* Search + Upload */}
        <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="flex-1 relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: theme.textMuted }}
                />
                <input
                  type="text"
                  placeholder="Search by course, topic, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{
                    backgroundColor: theme.cardBg,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  }}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold shrink-0"
                style={{ backgroundColor: theme.primary, color: "#FFFFFF" }}
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Upload Resource</span>
                <span className="sm:hidden">Upload</span>
              </motion.button>
            </motion.div>

        {/* Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl p-4 border mb-6"
          style={{
            backgroundColor: theme.cardBg,
            borderColor: theme.border,
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5" style={{ color: theme.accent }} />
            <h3 className="font-bold" style={{ color: theme.textPrimary }}>
              Filter Resources
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Level Filter */}
            <div className="relative">
              <select 
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-appearance-none cursor-pointer focus:outline-none focus:ring-2 transition-all duration-200"
                style={{
                  backgroundColor: theme.input,
                  borderColor: theme.border,
                  color: theme.textPrimary,
                }}
              >
                <option>All Levels</option>
                <option>100 Level</option>
                <option>200 Level</option>
                <option>300 Level</option>
                <option>400 Level</option>
                <option>500 Level</option>
              </select>
              <ChevronDown 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                style={{ color: theme.textMuted }}
              />
            </div>

            {/* Department Filter */}
            <div className="relative">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border appearance-none cursor-pointer focus:otline-none focus:ring-2 transition-all duration-200"
                style={{
                  backgroundColor: theme.input,
                  borderColor: theme.border,
                  color: theme.textPrimary,
                }}
              >
                <option>All Departments</option>
                <option>Computer Science</option>
                <option>Mathematics</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Biology</option>
                <option>Engineering</option>
              </select>
              <ChevronDown 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                style={{ color: theme.textMuted }}
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border appearance-none cursor-pointer focus:outline-none focus:ring-2 transition-all duration-200"
                style={{
                  backgroundColor: theme.input,
                  borderColor: theme.border,
                  color: theme.textPrimary,
                }}
              >
                <option>All Categories</option>
                <option>Past Questions</option>
                <option>Lecture Notes</option>
                <option>Study Guides</option>
                <option>Lab Manuals</option>
                <option>Textbooks</option>
              </select>
              <ChevronDown 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                style={{ color: theme.textMuted }}
              />
            </div>
          </div>
        </motion.div>

        {/* Resource Grid */}
        <div className="grid grid-cols-1 gap-6">
          {MOCK_RESOURCES.map((resource, index) => (
            <motion.article
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-2xl"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.border,
              }}
            >
              {/* Book Cover Preview */}
              <div className="flex flex-col md:flex-row">
                <div className="md:w-48 shrink-0">
                  <div 
                    className="h-64 md:h-full relative overflow-hidden"
                    style={{ backgroundColor: theme.accentBg }}
                  >
                    {resource.previewImage ? (
                      <ImageWithFallback
                        src={resource.previewImage}
                        alt={resource.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-16 h-16" style={{ color:theme.textMuted }}/>
                      </div>
                    )}
                    {/* Category Badge Overlay */}
                    <div
                      className="absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-sm"
                      style={{ 
                        backgroundColor: theme.accent + "DD",
                        color: "FFFFFF"
                      }}
                    >
                      {resource.category}
                    </div>
                  </div>
                </div>

                {/* Resource Details */}
                <div className="flex-1 p-6">
                  {/* Title & Course */}
                  <div className="mb-4">
                    <h3 
                      className="text-xl font-bold mb-2 leading-tight"
                      style={{ color: theme.textPrimary }}
                    >
                      {resource.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap text-sm">
                      <span
                        className="font-bold px-2 py-1 rounded"
                        style={{
                          backgroundColor: theme.primary + "20",
                          color: theme.primary,
                        }}
                      >
                        {resource.courseCode}
                      </span>
                      <span style={{ color: theme.textSecondary }}>
                        {resource.courseName}
                      </span>
                    </div>
                  </div>

                  {/* Meta Information */}
                  <div className="flex items-center gap-4 flex-wrap mb-4 text-sm">
                    <div
                      className="flex items-center gap-4 flex-wrap mb-4 text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      <GraduationCap className="w-4 h-4"/>
                      <span>Level {resource.level}</span>
                    </div>
                    <div 
                      className="flex items-center gap-1.5"
                      style={{ color: theme.textSecondary }}
                    >
                      <FolderOpen className="w-4 h-4" />
                      <span>{resource.department}</span>
                    </div>
                    <div
                      className="flex items-center gap-1.5"
                      style={{ color: theme.textSecondary }}
                    >
                      {getFileIcon(resource.fileType)}
                      <span>{resource.fileType}</span>
                    </div>
                    <div
                      className="flex items-center gap-1.5"
                      style={{ color: theme.textSecondary }}
                    >
                      <Clock className="w-4 h-4"/>
                      <span>{resource.timestamp}</span>
                    </div>
                  </div>

                  {/* Upload Info */}
                  <div className="mb-4 text-sm" style={{ color: theme.textMuted }}>
                    Shared by {""}
                    <span className="font-semibold" style={{ color: theme.textSecondary}}>
                      {resource.uploadedBy}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 mb-4 text-sm">
                    <div className="flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
                      <ThumbsUp className="w-4 h-4" />
                      <span className="font-semibold">{resource.stats.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
                      <MessageCircle className="w-4 h-4" />
                      <span className="font-semibold">{resource.stats.comments}</span>
                    </div>
                    <div className="flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
                      <Eye className="w-4 h-4" />
                      <span className="font-semibold">{resource.stats.views}</span>
                    </div>
                    <div className="flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
                      <Download className="w-4 h-4" />
                      <span className="font-semibold">{resource.stats.downloads}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: theme.primary,
                        color: "FFFFFF"
                      }}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-4 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 border"
                      style={{ 
                        backgroundColor: "transparent",
                        borderColor: theme.border,
                        color: theme.textPrimary,
                      }}
                    > 
                      <Eye className="w-4 h-4" />
                      Preview
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </main>
    </div>

    <UploadResourceModal
      open={showUploadModal}
      onClose={() => setShowUploadModal(false)}
      theme={theme}
    />
  </div>
  )
}