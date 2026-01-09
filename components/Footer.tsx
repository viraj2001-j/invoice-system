import React from "react";
import { Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-slate-100 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left Side: Brand */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-black italic uppercase tracking-tighter text-slate-900">
            LUCIFER<span className="text-blue-600">.</span>
          </span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest border-l pl-2 border-slate-200">
            Invoice System
          </span>
        </div>

        {/* Center: Your Name */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          Developed by 
          <span className="text-slate-900 font-black italic hover:text-blue-600 transition-colors cursor-pointer">
            VRJ
          </span>
        </div>

        {/* Right Side: Copyright */}
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          &copy; {currentYear} All Rights Reserved
        </div>
      </div>
    </footer>
  );
}