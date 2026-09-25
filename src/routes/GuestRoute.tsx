import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loader2 } from "lucide-react";

const GuestRoute = () => {
  const { user, isLoading } = useAuth();

  // Same loading shell as ProtectedRoute.tsx (spinner + heading + subtext on
  // the same dark background) so the auth check looks identical no matter
  // which guard the user happens to hit first.
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

  // No session -> show the landing/signup page.
  if (!user) return <Outlet />;

  // Signed in but never finished onboarding -> back to profile-setup, not
  // the dashboard. Without this check, a user who abandoned onboarding
  // could return to "/" and get bounced straight into /dashboard forever,
  // never completing onboarding.
  if (!user.isOnboarded) return <Navigate to="/profile-setup" replace />;

  // Same legacy-account gap as ProtectedRoute.tsx: don't bounce a
  // signed-in-but-unclaimed user straight to /dashboard.
  const needsIdentityClaim = user.isOnboarded && (!user.username || !user.gender);
  if (needsIdentityClaim) return <Navigate to="/claim-identity" replace />;

  return <Navigate to="/dashboard" replace />;
};

export default GuestRoute;
