import { Routes, Route } from "react-router-dom";

// Layouts
import AppLayout from "../components/Layout/AppLayout";

// Pre-Auth Pages
import LandingPage from "../pages/Landing";
import NotFoundPage from "../pages/NotFound";
import AuthCallback from "../components/ui/AuthCallback";

// Feature Pages
import ProfileSetupPage from "../features/auth/pages/ProfileSetup";
import FeedPage from "../features/feed/pages/Feed";
import ResourcesPage from "../features/resources/pages/Vault";
import AskPage from "../features/ask/pages/Ask";
import QuestionDetailPage from "../features/ask/pages/QuestionDetail";

// Auth Components
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* UNWRAPPED ROUTE */}
      <Route path="/auth-callback" element={<AuthCallback />} />

      {/* GUEST ROUTES */}
      <Route element={<GuestRoute />}>
        <Route path="/" element={<LandingPage />} />
      </Route>
      
      {/* PROTECTED ROUTES */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile-setup" element={<ProfileSetupPage />} />

        <Route element={<AppLayout />}>
          <Route path="/feed" element={<FeedPage />} />          {/* Add more app features here */}
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/ask" element={<AskPage />} />
          <Route path="/ask/:id" element={<QuestionDetailPage />} />
        </Route>
        
      </Route>
      {/* CATCH ALL */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};