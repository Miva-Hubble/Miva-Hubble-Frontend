import { ArrowLeft } from "lucide-react";
import logo from "../../assets/miva-hubble-logo.png";

export const Navbar = () => {
  return (
    <nav className="absolute top-0 left-0 w-full p-6 flex items-center justify-between border-b border-slate-700/50">
      <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </button>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div>
          <img src={logo} alt="Miva Hubble Logo" className="w-auto h-8" />
        </div>
      </div>

      <div className="w-16"></div>
    </nav>
  );
};
