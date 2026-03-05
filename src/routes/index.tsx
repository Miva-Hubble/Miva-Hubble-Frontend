import { Routes, Route } from "react-router-dom";

// Layouts
import AppLayout from "../components/Layout/AppLayout";
import AuthLayout from "../components/Layout/AuthLayout";

// Pages
import LandingPage from "../features/landingPage/pages/Landing";
import NotFoundPage from "../features/landingPage/pages/NotFound";

// Feature Pages
import SignupPage from "../features/auth/pages/Signup";
import OtpVerificationPage from "../features/auth/pages/OtpVerification";
import ProfileSetupPage from "../features/auth/pages/ProfileSetup";
import ForgotPasswordPage from "../features/auth/pages/ForgotPassword";
import DashboardPage from "../features/dashboard/pages/Dashboard";
import FeedPage from "../features/feed/pages/Feed";
import ResourcesPage from "../features/resources/pages/Vault";

import ProtectedRoute from "./ProtectedRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<LandingPage />} />

      {/* AUTH ROUTES */}
      <Route element={<AuthLayout />}>
       
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>
      <Route path="/otp-verification" element={<OtpVerificationPage />} />
      <Route path="/profile-setup" element={<ProfileSetupPage />} />

      {/* PRIVATE ROUTES */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          {/* Add more app features here */}
        </Route>
      </Route>

      {/* CATCH ALL */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};