"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Login failed");
      }

      // Successful login
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ecf0f5] flex flex-col items-center justify-center p-6 text-[#333] font-sans">
      <div className="w-full max-w-sm bg-white border border-gray-300 rounded-lg p-8 shadow-sm space-y-6">
        
        {/* Title */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Admin Portal</h1>
          <p className="text-zinc-500 text-xs">
            Authenticate to manage passphrase records
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-xs font-semibold">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-white border border-gray-300 rounded py-2 px-3 text-sm outline-none focus:border-zinc-400 text-zinc-800 transition-colors"
              disabled={isLoading}
              suppressHydrationWarning
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#007bff] hover:bg-[#0056b3] text-white py-2 rounded font-semibold text-sm transition-colors cursor-pointer border-none disabled:opacity-75 mt-2"
            suppressHydrationWarning
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link 
            href="/" 
            className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium no-underline"
          >
            Return to Client Application
          </Link>
        </div>
      </div>
    </div>
  );
}
