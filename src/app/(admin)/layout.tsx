import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root-container min-h-screen bg-[#ecf0f5]">
      {children}
    </div>
  );
}
