import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../../services/authService";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Grab the token from the URL 
    const token = searchParams.get("token");
    const isNewUser = searchParams.get("isNewUser");

    if (token) {
      // Save token to localStorage 
      authService.saveAuthData(token);

      // 3. Route user based on their status
      if (isNewUser === "true") {
        navigate("/profile-setup"); 
      } else {
        navigate("/feed"); 
      }
    } else {
      // Fallback: No token? route user back to landing
      console.error("Auth failed: No token found in URL");
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