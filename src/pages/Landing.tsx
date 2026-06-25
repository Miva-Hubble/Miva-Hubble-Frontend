import { motion, AnimatePresence } from "framer-motion";
import { useState, type ImgHTMLAttributes } from "react";
import { authService } from "../services/authService";
import {
  Users,
  MessageCircle,
  GraduationCap,
  BookOpen,
  Zap,
} from "lucide-react";

function ImageWithFallback({
  fallbackSrc,
  onError,
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & { fallbackSrc?: string }) {
  return (
    <img
      onError={(e) => {
        if (fallbackSrc && e.currentTarget.src !== fallbackSrc) {
          e.currentTarget.src = fallbackSrc;
        }
        onError?.(e);
      }}
      {...props}
    />
  );
}

export default function LandingPage() {
  const [isSignIn, setIsSignIn] = useState(false);

  const handleGoogleAuth = () => {
    // Redirect user to backend Google routes
    if (isSignIn) {
      console.log("Redirecting to Google Sign In...");
      authService.initiateAuth(); // Calling the redirect
      } else {
      console.log("Redirecting to Google  Sign Up...");
      authService.initiateAuth(); 
          }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1120] text-slate-300 font-sans selection:bg-teal-500/30">
      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8">
        
        {/* Left Column: Branding, Images, and Features */}
        <div className="flex flex-col justify-between max-w-xl">
          <div>
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-12"
            >
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-[#38bdf8] to-[#0ea5e9] flex items-center justify-center shadow-lg shadow-sky-500/20">
                <span className="text-white font-black text-xl tracking-tighter">H</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Miva <span className="text-[#38bdf8]">Hubble</span>
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white mb-6"
            >
              The Ultimate Space <br /> For{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-300 to-emerald-400">
                Miva Students
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-400 font-medium leading-relaxed mb-12 max-w-md"
            >
              Connect, collaborate, and excel with fellow Hubblites. Your academic journey, amplified.
            </motion.p>

            {/* Image Grid */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4 mb-16"
            >
              {/* Top Row - Wide Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl h-48 w-full group">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758525862357-27fb39545240?auto=format&fit=crop&w=1080&q=80"
                  alt="Students collaborating"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0b1120]/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/5">
                    <Users className="w-4 h-4 text-sky-400" />
                    <span className="text-sm font-semibold text-white">2,500+ Active Students</span>
                  </div>
                </div>
              </div>

              {/* Bottom Row - Split Images */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative rounded-2xl overflow-hidden shadow-xl h-36 group">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1704748082614-8163a88e56b8?auto=format&fit=crop&w=800&q=80"
                    alt="Course Library"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#0b1120]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/5">
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-white">Course Library</span>
                    </div>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden shadow-xl h-36 group">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1663162550974-aaf76bcdeedf?auto=format&fit=crop&w=800&q=80"
                    alt="Study Groups"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#0b1120]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/5">
                      <MessageCircle className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-semibold text-white">Study Groups</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-y-8 gap-x-4"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-sky-500/10 shrink-0">
                <MessageCircle className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Discussions</h3>
                <p className="text-xs text-slate-400">Share ideas instantly</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 shrink-0">
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Communities</h3>
                <p className="text-xs text-slate-400">Find your cohort</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-indigo-500/10 shrink-0">
                <BookOpen className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Resources</h3>
                <p className="text-xs text-slate-400">Access shared study materials</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10 shrink-0">
                <GraduationCap className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Peer Support</h3>
                <p className="text-xs text-slate-400">Learn from upperclassmen</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Auth Card */}
        <div className="flex items-center justify-center lg:justify-end lg:pl-12 w-full">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-md bg-[#131b2f] border border-[#1e293b] rounded-4xl p-8 md:p-10 shadow-2xl relative overflow-hidden"
          >
            
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-sky-500/5 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={isSignIn ? "signin" : "signup"}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="mb-8"
                >
                  <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
                    {isSignIn ? "Welcome back" : "Join today"}
                  </h2>
                  <p className="text-sm text-slate-400 font-medium">
                    {isSignIn 
                      ? "Sign in with your university account to continue." 
                      : "Sign up with your university account to explore."}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl text-sm font-bold bg-[#e2e8f0] text-slate-900 hover:bg-white transition-all hover:scale-[1.02] active:scale-[0.98] mb-6"
              >
                <ImageWithFallback
                  src="https://www.gstatic.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
                  fallbackSrc="https://developers.google.com/static/identity/images/g-logo.png"
                  alt="Google logo"
                  className="w-5 h-5 object-contain"
                />
                {isSignIn ? "Sign in with Google" : "Sign up with Google"}
              </button>

              {/* Toggle Text */}
              <div className="text-center text-sm font-medium mb-12">
                <span className="text-slate-400">
                  {isSignIn ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button
                  onClick={() => setIsSignIn(!isSignIn)}
                  className="font-bold text-[#38bdf8] hover:text-sky-400 hover:underline transition-colors ml-1"
                >
                  {isSignIn ? "Sign up" : "Sign in"}
                </button>
              </div>

              {/* Legal Notice */}
              <p className="text-[13px] text-center leading-relaxed text-slate-500 mb-8">
                By continuing, you agree to our{" "}
                <a href="#" className="text-sky-500 hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-sky-500 hover:underline">Privacy Policy</a>.
              </p>

              {/* Trust Badge inside Card */}
              <div className="p-4 rounded-xl bg-white/3 border border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-0.5">
                    Verified Students Only
                  </p>
                  <p className="text-[13px] font-medium text-slate-400">
                    Seamless Miva account integration
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Global Footer */}
      <footer className="w-full border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <p>© 2024 Miva Hubble. Verified Students Only.</p>
          <div className="flex flex-wrap justify-center items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">University Integration</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
}