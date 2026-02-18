import { useState, useEffect } from "react";
import { ShieldCheck, Shield } from "lucide-react";
import { Navbar } from "../../../components/Layout/NavBar";

const OtpVerification = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState<number>(60);

  // Helper Array
  const inputs = Array(6).fill(0);

  {
    /* Input Handling*/
  }
  // Update State and Auto-focus
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = e.target.nextElementSibling as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  // Delete Code Auto-focus
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const currentInput = e.target as HTMLInputElement;
        const prevInput =
          currentInput.previousElementSibling as HTMLInputElement;
        if (prevInput) prevInput.focus();
      }
    }
  };

  // Resend Code Timer
  useEffect(() => {
    if (timeLeft === 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const handleResend = () => {
    alert("New OTP code sent!"); // placeholder for API call
    setTimeLeft(60);
  };

  // Verify Code
  const handleVerify = () => {
    const code = otp.join("");
    alert("Verifying your email....");
    console.log("Ready to send to backend:", code); //placeholder for API call
  };

  return (
    // Background
    <div className="min-h-screen bg-[#0b101b] flex flex-col items-center justify-center p-4">
      <Navbar />
      <div className="w-full max-w-md bg-[#151c2c] rounded-3xl p-8 border border-slate-800 shadow-2xl mt-20">
        <div className="flex flex-col items-center gap-5">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex flex-col items-center justify-center">
            {/* Shield Icon */}
            <ShieldCheck className=" w-12 h-12 text-green-500" />
          </div>
          <div className="text-white flex flex-col items-center justify-center text-center">
            <h3 className="text-2xl font-bold mb-2">Enter verification code</h3>
            <p className="text-sm text-slate-400">
              We sent a 6-digit code to <br />{" "}
              <span className="text-cyan-500 font-medium">
                student@miva.edu.ng
              </span>
            </p>
          </div>

          {/* OTP Input */}
          <div className="flex justify-between w-full gap-2">
            {inputs.map((_, index) => (
              <input
                key={index}
                value={otp[index]}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                type="text"
                maxLength={1}
                className="w-10 h-12 sm:w-12 sm-h-14 bg-slate-900 border border-slate-700 rounded-lg text-center text-white text-xl focus:border-cyan-500 focus:outline-none transition-colors"
              />
            ))}
          </div>
        </div>
        {/* Verify OTP button */}
        <button
          onClick={handleVerify}
          className="w-10/12 mx-auto block  bg-slate-700 py-3 mt-8 rounded-lg text-white font-semibold hover:bg-slate-600 transition-colors cursor-pointer"
        >
          Verify Code
        </button>

        {/* OTP Resend button */}
        <div className="text-center mt-6 text-sm">
          {timeLeft > 0 ? (
            <p className="text-slate-400">
              Resend code in{" "}
              <span className="text-cyan-500 font-medium">{timeLeft}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-cyan-500 hover:text-cyan-400 font-medium transition-colors cursor-pointer"
            >
              Resend Code
            </button>
          )}
        </div>
        <div>
          <p className="text-cyan-500 text-sm text-center mt-6 text-shadow-lg/30">
            The verification code expires in 10 minutes. Check your spam folder
            if you don't see the email
          </p>
        </div>
      </div>
      <div className="w-full max-w-md bg-[#151c2c] rounded-3xl p-4 mt-6 border border-slate-800 shadow-2xl">
        <Shield className="inline w-6 h-6 text-blue-500 text-md" />{" "}
        <h3 className="inline text-white font-bold text-sm">
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
