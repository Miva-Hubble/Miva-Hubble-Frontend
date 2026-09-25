import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loader2 } from "lucide-react";

/**
 * Gates /profile-setup specifically:
 *   - Not signed in            -> "/"        (must authenticate first)
 *   - Signed in, already onboarded -> "/dashboard" (no re-onboarding)
 *   - Signed in, not onboarded -> render the setup flow
 *
 * Without this, /profile-setup was reachable and skippable by anyone,
 * unauthenticated or not — it had no guard at all.
 */
const OnboardingRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 text-sky-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Checking your session...</h2>
        <p className="text-sm text-slate-400 max-w-sm italic">
          "How pathetically scanty my self-knowledge is compared with, say, my knowledge of my room."
        </p>
        <p className="text-xs text-slate-500 mt-1">— Franz Kafka, Diaries (1910)</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;
  if (user.isOnboarded) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};

export default OnboardingRoute;
