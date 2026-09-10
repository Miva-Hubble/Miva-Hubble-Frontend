import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import AppLayout from "../components/Layout/AppLayout";

// Pre-Auth Pages
import LandingPage from "../pages/Landing";
import NotFoundPage from "../pages/NotFound";
import AuthCallback from "../components/ui/AuthCallback";

// Feature Pages
import ProfileSetupPage from "../features/auth/pages/ProfileSetup";
import ClaimIdentityPage from "../features/auth/pages/ClaimIdentity";
import DashboardPage from "../features/dashboard/pages/Dashboard";
import ResourcesPage from "../features/resources/pages/Vault";
import AskPage from "../features/ask/pages/Ask";
import QuestionDetailPage from "../features/ask/pages/QuestionDetail";
import ProfilePage from "../features/profile/pages/ProfilePage";

// Auth Components
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import OnboardingRoute from "./OnboardingRoute";
import ClaimIdentityRoute from "./ClaimIdentityRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* UNWRAPPED ROUTES */}
      <Route path="/auth-callback" element={<AuthCallback />} />

      {/* ONBOARDING GATE */}
      {/* Must be signed in AND not yet onboarded to reach this. Already-onboarded
          users get bounced to /dashboard; signed-out visitors get bounced to "/". */}
      <Route element={<OnboardingRoute />}>
        <Route path="/profile-setup" element={<ProfileSetupPage />} />
      </Route>

      {/* CLAIM-IDENTITY GATE */}
      {/* Legacy pre-migration accounts only: onboarded but missing a
          username/gender. Completes the four-state routing matrix:
          signed-out -> onboarding-incomplete -> identity-incomplete -> dashboard. */}
      <Route element={<ClaimIdentityRoute />}>
        <Route path="/claim-identity" element={<ClaimIdentityPage />} />
      </Route>

      {/* GUEST ROUTES */}
      {/* Instagram-style entry gate: an authenticated visitor hitting "/"
          never sees the sign-up landing page again — GuestRoute bounces them
          straight to /dashboard. Only a session-less visitor sees LandingPage. */}
      <Route element={<GuestRoute />}>
        <Route path="/" element={<LandingPage />} />
      </Route>
      
      {/* PROTECTED ROUTES */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/feed" element={<Navigate to="/dashboard" replace />} />
          <Route path="/ask" element={<AskPage />} />
          <Route path="/ask/:id" element={<QuestionDetailPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* CATCH ALL */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
