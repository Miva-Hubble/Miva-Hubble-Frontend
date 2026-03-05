import { useState } from "react";
import { motion } from "framer-motion";
import { authInputClassName, getInputStyle } from "./authStyles";
import { AuthDividerAndGoogle } from "./AuthDividerAndGoogle";

type SignInFormProps = {
  onSignInSuccess: () => void;
  onForgotPassword: () => void;
};

export function SignInForm({ onSignInSuccess, onForgotPassword }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: await auth.signIn({ email, password })
    onSignInSuccess();
  };

  const inputStyle = getInputStyle();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-4xl font-bold mb-2 text-slate-50">Welcome back</h2>
      <p className="mb-8" style={{ color: "#94A3B8" }}>
        Sign in to continue your academic journey
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
          <input
            type="email"
            placeholder="student@miva.edu.ng"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authInputClassName}
            style={inputStyle}
            required
          />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authInputClassName}
            style={inputStyle}
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-right"
        >
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm font-semibold transition-colors duration-200 cursor-pointer"
            style={{ color: "var(--primary-blue, #3b82f6)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--hover-blue, #2563eb)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--primary-blue, #3b82f6)";
            }}
          >
            Forgot password?
          </button>
        </motion.div>

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
            e.currentTarget.style.backgroundColor = "var(--hover-blue, #2563eb)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--primary-blue, #3b82f6)";
          }}
        >
          Sign in
        </motion.button>

        <AuthDividerAndGoogle />
      </form>
    </motion.div>
  );
}
