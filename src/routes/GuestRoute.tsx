import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; 

const GuestRoute = () => {
  const { user, isLoading } = useAuth();

  // Keep it matching your dark theme while it checks status
  if (isLoading) return <div className="min-h-screen bg-[#0b1120]" />; 
  
  // If user exists, send them to the action. If not, let them see the landing page.
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default GuestRoute;