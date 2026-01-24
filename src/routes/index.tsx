import { Routes, Route } from "react-router-dom";

// Layouts
import AppLayout from "../components/Layout/AppLayout";
import AuthLayout from "../components/Layout/AuthLayout";

// Pages
import LandingPage from "../pages/Landing";
import NotFoundPage from "../pages/NotFound";

// Feature Pages
import LoginPage from "../features/auth/pages/Login";
import SignupPage from "../features/auth/pages/Signup";
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

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
