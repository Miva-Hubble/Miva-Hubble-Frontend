import { motion } from "framer-motion";
import { useState, type ImgHTMLAttributes } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  MessageCircle,
  GraduationCap,
  BookOpen,
  Zap,
  AlertCircle,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";

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
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateMivaEmail = (value: string): boolean =>
    /^student@miva\.edu\.ng$/i.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (!isSignIn) {
      if (!validateMivaEmail(email)) {
        setEmailError("Please use your Miva university email address");
        return;
      }
      // TODO: await auth.requestOtp({ email })
      navigate("/otp-verification", { state: { email } });
    } else {
      // TODO: await auth.signIn({ email, password })
      navigate("/dashboard");
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div
      className="min-h-screen flex relative"
      style={{
        fontFamily: "Arimo, sans-serif",
        backgroundColor: "var(--canvas)",
      }}
    >
      {/* Left Section - Student Images (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden">
        {/* Background gradient overlay */}
        <div
          className="absolute inset-0  from-primary/20 via-surface/50 to-accent/20 pointer-events-none"
          aria-hidden="true"
        />

        {/* Animated decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-20 right-20 w-72 h-72 bg-primary rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-accent rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-xl w-full">
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl  from-primary to-accent flex items-center justify-center shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-bold  text-white ">
                MIVA HUBBLE
              </span>
            </div>
            {/* UPDATED: "Let's get started!" text color changed for background harmony */}
            <h1
              className="text-5xl font-bold mb-4 leading-tight"
              style={{ color: "var(--accent-teal, #19e3c7)" }}
            >
              Let's get started!
            </h1>
            <p className="text-lg" style={{ color: "#94A3B8" }}>
              Join thousands of Miva students collaborating and succeeding
              together.
            </p>
          </motion.div>

          {/* Student Images Grid */}
          <div className="space-y-6">
            {/* Main large image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.02 }}
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758525862357-27fb39545240?auto=format&fit=crop&w=1080&q=80"
                alt="Students collaborating"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 from-canvas/80 via-transparent to-transparent" />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-6 left-6 right-6"
              >
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-md"
                  style={{ backgroundColor: "rgba(59, 130, 246, 0.2)" }}
                >
                  <Users
                    className="w-4 h-4"
                    style={{ color: "var(--accent-teal, #14b8a6)" }}
                  />
                  <span className="text-sm font-semibold">
                    2,500+ Active Students
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Two smaller images side by side */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative rounded-xl overflow-hidden shadow-xl"
                whileHover={{ scale: 1.05 }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1704748082614-8163a88e56b8?auto=format&fit=crop&w=1080&q=80"
                  alt="Student with laptop"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 from-canvas/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md backdrop-blur-sm"
                    style={{ backgroundColor: "rgba(6, 182, 212, 0.2)" }}
                  >
                    <BookOpen
                      className="w-3.5 h-3.5"
                      style={{ color: "var(--accent-teal, #14b8a6)" }}
                    />
                    <span className="text-xs font-semibold">
                      Course Library
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="relative rounded-xl overflow-hidden shadow-xl"
                whileHover={{ scale: 1.05 }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1663162550974-aaf76bcdeedf?auto=format&fit=crop&w=1080&q=80"
                  alt="Group study"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 from-canvas/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md backdrop-blur-sm"
                    style={{ backgroundColor: "rgba(59, 130, 246, 0.2)" }}
                  >
                    <MessageCircle
                      className="w-3.5 h-3.5"
                      style={{ color: "var(--primary-blue, #3b82f6)" }}
                    />
                    <span className="text-xs font-semibold">Study Groups</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-hidden">
        {" "}
        <div
          className="absolute inset-0  from-primary/20 via-surface/50 to-accent/20 pointer-events-none"
          aria-hidden="true"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-accent rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl from-primary to-accent flex items-center justify-center">
                <GraduationCap className="w-7 h-7 blacktext-" />
              </div>
              <span className="text-3xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                MIVA HUBBLE
              </span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-4xl font-bold mb-2 text-slate-50">
              {isSignIn ? "Welcome back" : "Join today"}
            </h2>
            <p className="mb-8" style={{ color: "#94A3B8" }}>
              {isSignIn
                ? "Sign in to continue your academic journey"
                : "Start collaborating with fellow Miva students"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <input
                  type="email"
                  placeholder="student@miva.edu.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:border-primary cursor-text"
                  style={{
                    backgroundColor: "var(--input-fill, #0b1220)",
                    borderColor:
                      "var(--border-divider, rgba(148, 163, 184, 0.2))",
                    color: "#F8FAFC",
                  }}
                  required
                />
              </motion.div>

              {emailError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-sm text-red-500"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{emailError}</span>
                </motion.div>
              )}

              {isSignIn && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:border-primary cursor-text"
                    style={{
                      backgroundColor: "var(--input-fill, #0b1220)",
                      borderColor:
                        "var(--border-divider, rgba(148, 163, 184, 0.2))",
                      color: "#F8FAFC",
                    }}
                    required
                  />
                </motion.div>
              )}

              {/* Forgot Password Link - Only shown in Sign In mode */}
              {isSignIn && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-right"
                >
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm font-semibold transition-colors duration-200 cursor-pointer"
                    style={{ color: "var(--primary-blue, #3b82f6)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color =
                        "var(--hover-blue, #2563eb)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color =
                        "var(--primary-blue, #3b82f6)";
                    }}
                  >
                    Forgot password?
                  </button>
                </motion.div>
              )}

              {/* CTA Button */}
              <motion.button
                type="submit"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 30px rgba(59, 130, 246, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 cursor-pointer"
                style={{ backgroundColor: "var(--primary-blue, #3b82f6)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--hover-blue, #2563eb)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--primary-blue, #3b82f6)";
                }}
              >
                {isSignIn ? "Sign in" : "Create account"}
              </motion.button>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div
                  className="flex-1 h-px"
                  style={{
                    backgroundColor:
                      "var(--border-divider, rgba(148, 163, 184, 0.2))",
                  }}
                />
                <span style={{ color: "var(--text-muted, #94A3B8)" }}>or</span>
                <div
                  className="flex-1 h-px"
                  style={{
                    backgroundColor:
                      "var(--border-divider, rgba(148, 163, 184, 0.2))",
                  }}
                />
              </div>

              {/* Secondary Auth Options */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-4 rounded-xl border-2 font-semibold transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
                style={{
                  borderColor:
                    "var(--border-divider, rgba(148, 163, 184, 0.2))",
                  backgroundColor: "transparent",
                  color: "#fff",
                }}
                onClick={() => {
                  // TODO: Redirect to backend Google OAuth endpoint
                  // window.location.href = import.meta.env.VITE_OAUTH_GOOGLE_URL
                }}
              >
                <FcGoogle className="w-5 h-5" />
                Continue with Google
              </motion.button>
            </form>

            {/* Toggle Sign In/Sign Up */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-center"
            >
              <span style={{ color: "#94A3B8" }}>
                {isSignIn
                  ? "Don't have an account? "
                  : "Already have an account? "}
              </span>
              <button
                onClick={() => setIsSignIn(!isSignIn)}
                className="font-semibold transition-colors duration-200 cursor-pointer"
                style={{ color: "var(--primary-blue, #3b82f6)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--hover-blue, #2563eb)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--primary-blue, #3b82f6)";
                }}
              >
                {isSignIn ? "Sign up" : "Sign in"}
              </button>
            </motion.div>

            {/* Terms & Privacy */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-sm text-center"
              style={{ color: "var(--text-muted, #94A3B8)" }}
            >
              By signing up, you agree to the{" "}
              <a
                href="#"
                className="hover:underline"
                style={{ color: "var(--primary-blue, #3b82f6)" }}
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="hover:underline"
                style={{ color: "var(--primary-blue, #3b82f6)" }}
              >
                Privacy Policy
              </a>
              , including Cookie Use.
            </motion.p>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-6 p-4 rounded-xl flex items-center gap-3"
              // Updated: backgroundColor + text color for trust badge for optimal contrast
              style={{ backgroundColor: "var(--surface, #111827)" }}
            >
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Zap
                  className="w-5 h-5"
                  style={{ color: "var(--accent-teal, #14b8a6)" }}
                />
              </div>
              <div className="flex-1">
                {/* UPDATED: Trust badge heading color for more vivid contrast */}
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--accent-teal, #19e3c7)" }}
                >
                  Verified Students Only
                </p>
                <p className="text-xs" style={{ color: "#94A3B8" }}>
                  Email verification within 60 seconds
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
