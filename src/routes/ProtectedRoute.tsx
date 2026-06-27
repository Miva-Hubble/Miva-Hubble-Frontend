import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; 

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen bg-[#0b1120]" />; 
  
  // If no user, kick them back to the front door
  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;