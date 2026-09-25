import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loader2 } from "lucide-react";

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 text-sky-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Authenticating...</h2>
        <p className="text-sm text-slate-400 max-w-sm">
          Please wait while we verify your session. If our servers were asleep, this might take up to 30 seconds.
        </p>
      </div>
    );
  }

  // No session at all -> front door.
  if (!user) return <Navigate to="/" replace />;

  // Authenticated but never finished onboarding -> back to profile-setup,
  // not the dashboard. This is the check that was missing: previously any
  // authenticated user was let straight through regardless of onboarding
  // state, which is how accounts reach /dashboard and stay there with
  // onboarding: null in the DB forever.
  if (!user.isOnboarded) return <Navigate to="/profile-setup" replace />;

  // Onboarded, but a legacy pre-migration account never claimed a
  // username/gender (Phase 2.2's transaction guarantees new users can't
  // land here) -> finish identity claim before anything else.
  const needsIdentityClaim = user.isOnboarded && (!user.username || !user.gender);
  if (needsIdentityClaim) return <Navigate to="/claim-identity" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
