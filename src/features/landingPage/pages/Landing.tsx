import { motion, AnimatePresence } from "framer-motion";
import { useState, type ImgHTMLAttributes } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  MessageCircle,
  GraduationCap,
  BookOpen,
  Zap,
} from "lucide-react";
import { SignInForm } from "../components/SignInForm";
import { SignUpForm } from "../components/SignUpForm";

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
  const [isSignIn, setIsSignIn] = useState(false);

  const handleSignInSuccess = () => {
    navigate("/dashboard");
  };

  const handleSignUpSuccess = (email: string) => {
    navigate("/otp-verification", { state: { email } });
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
        <div
          className="absolute inset-0 from-primary/20 via-surface/50 to-accent/20 pointer-events-none"
          aria-hidden="true"
        />

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
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl from-primary to-accent flex items-center justify-center shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-bold text-white">MIVA HUBBLE</span>
            </div>
            <h1
              className="text-5xl font-bold mb-4 leading-tight"
              style={{ color: "var(--accent-teal, #19e3c7)" }}
            >
              Let&apos;s get started!
            </h1>
            <p className="text-lg" style={{ color: "#94A3B8" }}>
              Join thousands of Miva students collaborating and succeeding
              together.
            </p>
          </motion.div>

          <div className="space-y-6">
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
                    <span className="text-xs font-semibold">Course Library</span>
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
        <div
          className="absolute inset-0 from-primary/20 via-surface/50 to-accent/20 pointer-events-none"
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
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                MIVA HUBBLE
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isSignIn ? (
              <SignInForm
                key="signin"
                onSignInSuccess={handleSignInSuccess}
                onForgotPassword={handleForgotPassword}
              />
            ) : (
              <SignUpForm key="signup" onSignUpSuccess={handleSignUpSuccess} />
            )}
          </AnimatePresence>

          {/* Toggle Sign In / Sign Up */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <span style={{ color: "#94A3B8" }}>
              {isSignIn ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              type="button"
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
            transition={{ delay: 0.5 }}
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
            transition={{ delay: 0.6 }}
            className="mt-6 p-4 rounded-xl flex items-center gap-3"
            style={{ backgroundColor: "var(--surface, #111827)" }}
          >
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Zap
                className="w-5 h-5"
                style={{ color: "var(--accent-teal, #14b8a6)" }}
              />
            </div>
            <div className="flex-1">
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
      </div>
    </div>
  );
}
