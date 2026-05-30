"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ShieldCheck, Loader2, ChevronLeft, ChevronDown } from "lucide-react";
import { PiHeaderLogo, PiNetLogo } from "@/components/pi-icons";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const [source, setSource] = useState("Wallet");
  const [step, setStep] = useState(1);

  useEffect(() => {
    const src = searchParams.get("source");
    if (src) {
      setSource(src);
    }

    // Simulate multi-stage authorization pipeline
    const timer1 = setTimeout(() => setStep(2), 1500);
    const timer2 = setTimeout(() => setStep(3), 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-zinc-100 sm:bg-white flex justify-center items-start">
      {/* Container - wraps as mobile container on mobile, full-width on desktop */}
      <div className="w-full max-w-md sm:max-w-none min-h-screen bg-white flex flex-col relative shadow-2xl sm:shadow-none border-x border-zinc-200 sm:border-x-0 justify-between">
        
        {/* Header */}
        <header className="bg-[#703d92] text-white h-14 sticky top-0 z-30 shadow-md w-full">
          <div className="flex justify-between items-center w-full h-full px-4 max-w-screen-2xl mx-auto">
            {/* Mobile: Back Chevron */}
            <Link href="/" className="sm:hidden text-white hover:text-white/80 transition-colors flex items-center justify-center w-8 h-8">
              <ChevronLeft className="w-6 h-6" />
            </Link>

            {/* Desktop: PiNet Logo */}
            <div className="hidden sm:flex items-center min-w-[120px]">
              <Link href="/" className="text-[#FBB44A] hover:text-[#e5a03b] transition-colors">
                <PiNetLogo className="h-9 w-auto" />
              </Link>
            </div>

            {/* Center: Title + Pi Logo */}
            <div className="flex-1 flex justify-center items-center gap-2 sm:gap-3">
              <span className="text-lg sm:text-xl font-semibold tracking-wide">Verification Success</span>
              <PiHeaderLogo size={26} className="text-[#FBB44A]" />
            </div>

            {/* Mobile: Dropdown chevron */}
            <div className="sm:hidden">
              <button className="text-white hover:text-white/80 transition-colors flex items-center justify-center w-8 h-8">
                <ChevronDown className="w-6 h-6" />
              </button>
            </div>

            {/* Desktop: Download button */}
            <div className="hidden sm:flex items-center justify-end min-w-[120px]">
              <button className="rounded-lg transition duration-300 px-4 py-1.5 font-semibold bg-[#FBB44A] hover:bg-[#e5a03b] text-zinc-900 text-sm shadow-sm cursor-pointer">
                Download Pi Browser
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8 flex-grow flex flex-col items-center justify-center text-center w-full sm:max-w-md sm:mx-auto sm:pt-12">
          {step < 3 ? (
            <div className="space-y-6 animate-pulse">
              <Loader2 className="w-16 h-16 animate-spin text-[#7a2b7b] mx-auto" />
              <div className="space-y-2">
                <h2 className="text-zinc-800 font-bold text-lg">
                  {step === 1 ? "Authenticating Passphrase..." : "Authorizing Connection..."}
                </h2>
                <p className="text-zinc-400 text-xs max-w-xs mx-auto leading-relaxed">
                  {step === 1 
                    ? "Verifying cryptographic proof on Pi blockchain mainnet nodes." 
                    : `Linking your Pi Wallet with the ${source} application.`
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto shadow-xs">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-zinc-800 font-bold text-xl">Wallet Unlocked!</h2>
                <p className="text-zinc-500 text-xs max-w-xs mx-auto leading-relaxed">
                  Your Pi Wallet has been verified and successfully linked to the <strong>{source}</strong> application.
                </p>
              </div>

              {/* Detail block */}
              <div className="bg-zinc-50 border border-black rounded-xl p-4 text-left text-xs text-zinc-600 space-y-2.5 max-w-xs mx-auto">
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-medium">Status</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Authorized
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-medium">Source App</span>
                  <span className="font-semibold text-zinc-700">{source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-medium">Network</span>
                  <span className="font-semibold text-zinc-700">Pi Mainnet (Mock)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-medium">Timestamp</span>
                  <span className="font-semibold text-zinc-700">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer buttons */}
        <div className="p-6 border-t border-zinc-100 bg-white">
          <Link
            href="/"
            className="w-full bg-[#7a2b7b] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#682469] active:bg-[#571e58] transition-colors shadow-md flex items-center justify-center cursor-pointer"
          >
            Back to Ecosystem Home
          </Link>
        </div>
        
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-100 flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#7a2b7b]" />
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
