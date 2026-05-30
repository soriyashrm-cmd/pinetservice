import React from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="client-root-container min-h-screen bg-zinc-100 sm:bg-white">
      {children}
    </div>
  );
}
