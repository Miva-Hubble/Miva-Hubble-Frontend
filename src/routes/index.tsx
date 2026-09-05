import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import AppLayout from "../components/Layout/AppLayout";

// Pre-Auth Pages
import LandingPage from "../pages/Landing";
import NotFoundPage from "../pages/NotFound";
import AuthCallback from "../components/ui/AuthCallback";

// Feature Pages
import ProfileSetupPage from "../features/auth/pages/ProfileSetup";
import DashboardPage from "../features/dashboard/pages/Dashboard";
import ResourcesPage from "../features/resources/pages/Vault";
import AskPage from "../features/ask/pages/Ask";
import QuestionDetailPage from "../features/ask/pages/QuestionDetail";

// Auth Components
import ProtectedRoute from "./ProtectedRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* UNWRAPPED ROUTES */}
      <Route path="/auth-callback" element={<AuthCallback />} />
      <Route path="/profile-setup" element={<ProfileSetupPage />} />

      {/* GUEST ROUTES */}
      <Route path="/" element={<LandingPage />} />
      
      {/* PROTECTED ROUTES */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/feed" element={<Navigate to="/dashboard" replace />} />
          <Route path="/ask" element={<AskPage />} />
          <Route path="/ask/:id" element={<QuestionDetailPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
        </Route>
      </Route>

      {/* CATCH ALL */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
