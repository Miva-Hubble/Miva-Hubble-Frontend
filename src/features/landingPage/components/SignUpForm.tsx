import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { authInputClassName, getInputStyle } from "./authStyles";
import { AuthDividerAndGoogle } from "./AuthDividerAndGoogle";

const MIVA_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@miva\.edu\.ng$/i;

function validateMivaEmail(value: string): boolean {
  return MIVA_EMAIL_REGEX.test(value.trim());
}

type SignUpFormProps = {
  onSignUpSuccess: (email: string) => void;
};

export function SignUpForm({ onSignUpSuccess }: SignUpFormProps) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (!validateMivaEmail(email)) {
      setEmailError("Please use your Miva university email address");
      return;
    }
    // TODO: await auth.requestOtp({ email })
    onSignUpSuccess(email);
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
      <h2 className="text-4xl font-bold mb-2 text-slate-50">Join today</h2>
      <p className="mb-8" style={{ color: "#94A3B8" }}>
        Start collaborating with fellow Miva students
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
          <input
            type="email"
            placeholder="student@miva.edu.ng"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError("");
            }}
            className={authInputClassName}
            style={inputStyle}
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
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{emailError}</span>
          </motion.div>
        )}

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
          Create account
        </motion.button>

        <AuthDividerAndGoogle />
      </form>
    </motion.div>
  );
}
