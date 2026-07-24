import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Grab user status from the URL
    const success = searchParams.get("success");
    const isNewUser = searchParams.get("isNewUser");

    if (success === "true") {
      // Route the user based on their status
      if (isNewUser === "true") {
        navigate("/profile-setup"); 
      } else {
        navigate("/feed"); 
      }
    } else {
      // Fallback: If success isn't true:
      console.error("Auth failed: None or invalid cookies received");
      navigate("/"); 
    }
  }, [navigate, searchParams]);

  // Loading UI
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b1120] text-slate-300">
      <Loader2 className="w-10 h-10 animate-spin text-[#38bdf8] mb-4" />
      <h2 className="text-xl font-bold text-white mb-2">Authenticating...</h2>
      <p className="text-sm font-medium text-slate-400">
        Securing your connection to Hubble
      </p>
    </div>
  );
}