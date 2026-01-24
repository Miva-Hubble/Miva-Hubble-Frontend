import { Navigate, Outlet } from "react-router-dom";
// Assuming you have a store or hook for auth
import { useAuth } from "../hooks/useAuth"; 

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>; // Or a spinner component
  
  // If no user, send them to login
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;