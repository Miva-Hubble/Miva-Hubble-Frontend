import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, Shield } from "lucide-react";
import { Navbar } from "../../../components/Layout/NavBar";

const OTP_LENGTH = 6;

const sanitizeDigits = (str: string) => str.replace(/\D/g, "");

const OtpVerification = () => {
  const [otp, setOtp] = useState<string[]>(() => Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const { state } = useLocation() as { state?: { email?: string } | null };
  const displayEmail = state?.email ?? "student@miva.edu.ng";
  const navigate = useNavigate();

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const verifyAbortRef = useRef<AbortController | null>(null);

  const code = useMemo(() => otp.join("").replace(/\D/g, ""), [otp]);
  const inputs = Array(OTP_LENGTH).fill(0);

  const focusAt = (i: number) => {
    const el = inputRefs.current[i] ?? null;
    if (el) el.focus();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const digits = sanitizeDigits(e.target.value);
    if (digits.length === 0) {
      setOtp((prev) => {
        if (prev[index] === "") return prev;
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    setOtp((prev) => {
      const next = [...prev];
      let i = 0;
      while (i < digits.length && index + i < OTP_LENGTH) {
        next[index + i] = digits[i]!;
        i++;
      }
      return next;
    });

    const nextIndex = Math.min(
      index + Math.max(1, digits.length),
      OTP_LENGTH - 1,
    );
    if (index < OTP_LENGTH - 1) focusAt(nextIndex);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    const key = e.key;

    if (key === "Backspace") {
      e.preventDefault();
      setOtp((prev) => {
        const next = [...prev];
        if (next[index]) {
          next[index] = "";
          return next;
        }
        if (index > 0) {
          focusAt(index - 1);
          if (next[index - 1]) next[index - 1] = "";
        }
        return next;
      });
      return;
    }

    if (key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusAt(index - 1);
      return;
    }
    if (key === "ArrowRight" && index < OTP_LENGTH - 1) {
      e.preventDefault();
      focusAt(index + 1);
      return;
    }

    if (/^[0-9]$/.test(key) || ["Tab", "Enter"].includes(key)) return;
    e.preventDefault();
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text") || "";
    const digits = sanitizeDigits(text).slice(0, OTP_LENGTH);
    if (!digits) return;

    setOtp((prev) => {
      const next = [...prev];
      let i = 0;
      while (i < digits.length && index + i < OTP_LENGTH) {
        next[index + i] = digits[i]!;
        i++;
      }
      return next;
    });

    const nextIndex = Math.min(index + digits.length, OTP_LENGTH - 1);
    focusAt(nextIndex);
  };

  useEffect(() => {
    if (timeLeft === 0) return;
    const intervalId = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const apiBase = import.meta.env?.VITE_API_BASE_URL ?? "";
  const verifyUrl = apiBase ? `${apiBase}/auth/verify-otp` : "/api/auth/verify-otp";
  const resendUrl = apiBase ? `${apiBase}/auth/resend-otp` : "/api/auth/resend-otp";

  const postJSON = async (
    url: string,
    body: unknown,
    signal?: AbortSignal,
  ): Promise<unknown> => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
      signal,
    });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
  };

  // TODO: Remove DEV bypass once backend is running
  const isDev = import.meta.env.DEV;

  const handleResend = async () => {
    if (isResending || timeLeft > 0) return;
    setIsResending(true);
    try {
      if (!isDev) {
        await postJSON(resendUrl, { email: displayEmail });
      }
      setTimeLeft(60);
      setOtp(Array(OTP_LENGTH).fill(""));
      focusAt(0);
    } catch (err) {
      console.error("Resend OTP failed:", err);
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async () => {
    const sanitized = code.slice(0, OTP_LENGTH);
    if (sanitized.length !== OTP_LENGTH || isVerifying) return;

    if (verifyAbortRef.current) verifyAbortRef.current.abort();
    const controller = new AbortController();
    verifyAbortRef.current = controller;

    setIsVerifying(true);
    try {
      if (!isDev) {
        await postJSON(verifyUrl, { code: sanitized, email: displayEmail }, controller.signal);
      }
      navigate("/profile-setup", { replace: true });
    } catch (err) {
      console.error("OTP verification failed:", err);
    } finally {
      setIsVerifying(false);
      verifyAbortRef.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b101b] flex flex-col items-center justify-center p-4">
      <Navbar />
      <div className="w-full max-w-md bg-[#151c2c] rounded-3xl p-8 border border-slate-800 shadow-2xl mt-20">
        <div className="flex flex-col items-center gap-5">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-12 h-12 text-green-500" />
          </div>
          <div className="text-white flex flex-col items-center justify-center text-center">
            <h3 className="text-2xl font-bold mb-2">Enter verification code</h3>
            <p className="text-sm text-slate-400">
              We sent a 6-digit code to <br />
              <span className="text-cyan-500 font-medium">{displayEmail}</span>
            </p>
          </div>

          <div className="flex justify-between w-full gap-2">
            {inputs.map((_, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                value={otp[index]}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={(e) => handlePaste(e, index)}
                type="text"
                maxLength={1}
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]*"
                className="w-10 h-12 sm:w-12 sm:h-14 bg-slate-900 border border-slate-700 rounded-lg text-center text-white text-xl focus:border-cyan-500 focus:outline-none transition-colors"
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-10/12 mx-auto block bg-slate-700 py-3 mt-8 rounded-lg text-white font-semibold hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {isVerifying ? "Verifying…" : "Verify Code"}
        </button>

        <div className="text-center mt-6 text-sm">
          {timeLeft > 0 ? (
            <p className="text-slate-400">
              Resend code in{" "}
              <span className="text-cyan-500 font-medium">{timeLeft}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-cyan-500 hover:text-cyan-400 disabled:opacity-50 font-medium transition-colors cursor-pointer"
            >
              {isResending ? "Sending…" : "Resend Code"}
            </button>
          )}
        </div>

        <p className="text-cyan-500 text-sm text-center mt-6">
          The verification code expires in 10 minutes. Check your spam folder
          if you don&apos;t see the email.
        </p>
      </div>

      <div className="w-full max-w-md bg-[#151c2c] rounded-3xl p-4 mt-6 border border-slate-800 shadow-2xl">
        <Shield className="inline w-6 h-6 text-blue-500" />
        <h3 className="inline text-white font-bold text-sm ml-1">
          Secure Verification
        </h3>
        <p className="text-xs text-slate-400 mt-2">
          We sent a verification code to your Miva email. This helps us ensure
          only verified students can access Miva Hubble.
        </p>
      </div>
    </div>
  );
};

export default OtpVerification;
