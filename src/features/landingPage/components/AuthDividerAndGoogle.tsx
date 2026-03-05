import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

const dividerStyle = {
  backgroundColor: "var(--border-divider, rgba(148, 163, 184, 0.2))",
};

export function AuthDividerAndGoogle() {
  return (
    <>
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px" style={dividerStyle} />
        <span style={{ color: "var(--text-muted, #94A3B8)" }}>or</span>
        <div className="flex-1 h-px" style={dividerStyle} />
      </div>
      <motion.button
        type="button"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full py-4 rounded-xl border-2 font-semibold transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
        style={{
          borderColor: "var(--border-divider, rgba(148, 163, 184, 0.2))",
          backgroundColor: "transparent",
          color: "#fff",
        }}
        onClick={() => {
          // TODO: Redirect to backend Google OAuth endpoint
        }}
      >
        <FcGoogle className="w-5 h-5" />
        Continue with Google
      </motion.button>
    </>
  );
}
