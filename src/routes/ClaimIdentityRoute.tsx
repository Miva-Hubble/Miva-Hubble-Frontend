import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loader2 } from "lucide-react";

/**
 * Gates /claim-identity:
 *   - Not signed in                              -> "/"
 *   - Signed in, not onboarded                    -> "/profile-setup"
 *   - Signed in, onboarded, identity complete      -> "/dashboard"
 *   - Signed in, onboarded, identity incomplete    -> render the claim screen
 *
 * This state should only ever be reached by legacy pre-migration accounts —
 * the Phase 2.2 transaction guarantees new users can never land here with a
 * partial identity. Mirrors OnboardingRoute.tsx's structure.
 */
const ClaimIdentityRoute = () => {
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
  if (!user.isOnboarded) return <Navigate to="/profile-setup" replace />;

  const needsIdentityClaim = user.isOnboarded && (!user.username || !user.gender);
  if (!needsIdentityClaim) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};

export default ClaimIdentityRoute;
