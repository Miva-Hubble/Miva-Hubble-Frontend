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
  
  // If no user, kick them back to the front door
  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;