import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "motion/react";
import CATEGORIES from "../constants/categories";
import TOP_MASTERS from "../constants/masters"; 
import TRENDING_DOCS from "../constants/trending_docs";
import { 
  Search, Shield,  Download, TrendingUp, Award, Target 
} from "lucide-react";
import { getFeedTheme } from "../constants/theme";



export default function Feed() {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  const theme = getFeedTheme(isDarkMode);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("textbooks");
  const [goalProgress, setGoalProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setGoalProgress(70), 400);
    return () => clearTimeout(timer);
  }, []);

  // Trending Docs Filter
  const filteredDocs = useMemo(() => {
    if (!searchQuery.trim()) return TRENDING_DOCS;
    const query = searchQuery.toLowerCase();
    return TRENDING_DOCS.filter(doc => 
      doc.title.toLowerCase().includes(query) ||
      doc.context.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Daily Goal Logic 
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (goalProgress / 100) * circumference;

  return (
    <div 
      className="min-h-screen font-sans pb-20 transition-colors duration-300"
      style={{ backgroundColor: theme.bg, color: theme.textPrimary }}
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* TOP SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Hero Banner */}
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
                    className="px-6 py-2.5 rounded-xl font-bold text-white shadow-lg cursor-pointer"
                    style={{ backgroundColor: theme.primary }}
                  >
                    Explore Vault
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="px-6 py-2.5 rounded-xl font-bold border cursor-pointer"
                    style={{ backgroundColor: theme.cardBg, borderColor: theme.border, color: theme.textPrimary }}
                  >
                    How it works
                  </motion.button>
                </div>
              </div>
              
              {/* Daily Goal Widget */}
              <div 
                className="hidden md:block rounded-xl p-5 border min-w-[200px]"
                style={{ backgroundColor: theme.bg, borderColor: theme.border }}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold">Daily Goal</span>
                  <Target className="w-4 h-4" style={{ color: theme.accent }} />
                </div>
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
                  <span className="text-2xl font-bold">{goalProgress}%</span>
                </div>
                <div className="flex justify-between text-xs" style={{ color: theme.textMuted }}>
                  <span>7 Day Streak</span>
                  <span className="flex items-center gap-1" style={{ color: theme.accent }}>
                    7 <TrendingUp className="w-3 h-3"/>
                  </span>
                </div>
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
            {/* Search */}
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
              <div className="flex gap-2">
                {["Mathematics", "Law", "Engineering"].map(tag => (
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
            </div>

            {/* Masters */}
            <div className="rounded-2xl p-6 border" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold flex items-center gap-2">
                  <Award className="w-5 h-5" style={{ color: theme.accent }} /> Top Masters
                </h2>
              </div>
              <div className="space-y-4">
                {TOP_MASTERS.map((user, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-3 p-2 rounded-lg border transition-colors"
                    style={{ 
                      backgroundColor: user.active ? theme.cardBg : 'transparent',
                      borderColor: user.active ? theme.border : 'transparent' 
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
                      <p className="text-[10px]" style={{ color: theme.textMuted }}>{user.xp}</p>
                    </div>
                    {user.active && <Shield className="w-4 h-4" style={{ color: theme.accent }} />}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* BANNER: Current Quest */}
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
              <h3 className="font-bold">Current Quest: Contributor</h3>
              <p className="text-sm" style={{ color: theme.textSecondary }}>Upload a resource to earn 50 XP</p>
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

        {/* CATEGORIES */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Browse by Category</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <div 
                  key={cat.id} 
                  onClick={() => setActiveCategory(cat.id)}
                  className="p-5 rounded-xl border transition-all cursor-pointer"
                  style={{ 
                    backgroundColor: isActive ? (isDarkMode ? `${theme.primary}15` : `${theme.primary}10`) : theme.surface,
                    borderColor: isActive ? theme.primary : theme.border 
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 border"
                    style={{ 
                      backgroundColor: isActive ? (isDarkMode ? `${theme.primary}33` : `${theme.primary}20`) : theme.input,
                      borderColor: isActive ? theme.primary : theme.border 
                    }}
                  >
                    <cat.icon className="w-6 h-6" style={{ color: isActive ? theme.primary : theme.textSecondary }} />
                  </div>
                  <h3 className="font-bold mb-2">{cat.title}</h3>
                  <p className="text-xs mb-6 leading-relaxed" style={{ color: theme.textMuted }}>{cat.desc}</p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold" style={{ color: isActive ? theme.primary : theme.textSecondary }}>
                      {cat.count}
                    </span>
                    <span className="flex items-center gap-1" style={{ color: theme.accent }}>☆ {cat.rating}</span>
                  </div>
                </div>
              );
            })}
          </div>
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
            <div className="space-y-4">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
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
                        <doc.icon className="w-6 h-6" style={{ color: theme.primary }} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{doc.title}</h4>
                        <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>{doc.context}</p>
                        <p className="text-[10px] mt-1" style={{ color: theme.accent }}>{doc.stats}</p>
                      </div>
                    </div>
                    <button 
                      className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors cursor-pointer hover:bg-slate-800"
                      style={{ borderColor: theme.border, color: theme.textPrimary }}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div 
                  className="p-8 text-center rounded-xl border"
                  style={{ backgroundColor: theme.surface, borderColor: theme.border }}
                >
                  <p style={{ color: theme.textSecondary }}>No resources found for "{searchQuery}".</p>
                  <button 
                    onClick={() => setSearchQuery("")} 
                    className="mt-2 text-sm hover:underline cursor-pointer"
                    style={{ color: theme.primary }}
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Community Impact */}
          <div 
            className="rounded-2xl p-6 border flex flex-col justify-center"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}
          >
            <h3 className="font-bold mb-6">Community Impact</h3>
            <div className="grid grid-cols-2 gap-y-8 gap-x-4">
              <div>
                <p className="text-3xl font-extrabold" style={{ color: theme.primary }}>15k</p>
                <p className="text-[10px] tracking-wider mt-1 uppercase" style={{ color: theme.textMuted }}>ACTIVE LEARNERS</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold" style={{ color: theme.accent }}>42k</p>
                <p className="text-[10px] tracking-wider mt-1 uppercase" style={{ color: theme.textMuted }}>RESOURCES</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold">98%</p>
                <p className="text-[10px] tracking-wider mt-1 uppercase" style={{ color: theme.textMuted }}>SUCCESS RATE</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold" style={{ color: theme.primary }}>10k</p>
                <p className="text-[10px] tracking-wider mt-1 uppercase" style={{ color: theme.textMuted }}>MONTHLY LIKES</p>
              </div>
            </div>
          </div>

        </motion.div>

      </main>
    </div>
  );
}