import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const success = searchParams.get("success");
      const isNewUser = searchParams.get("isNewUser");

      if (success !== "true") {
        console.error("Auth failed: None or invalid cookies received");
        navigate("/");
        return;
      }

      try {
        await refreshUser();
      } catch {
        navigate("/");
        return;
      }

      if (isNewUser === "true") {
        navigate("/profile-setup");
      } else {
        navigate("/feed");
      }
    };

    void handleAuthCallback();
  }, [navigate, refreshUser, searchParams]);

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