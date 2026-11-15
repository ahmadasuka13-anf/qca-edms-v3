"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  LogOut,
  User as UserIcon,
  QrCode,
  Bot,
  Target,
  Bell,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { User } from "@/features/auth/types";

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onGlobalSearch?: (query: string) => void;
  selectedProject?: string;
  onOpenQRScanner?: () => void;
  onOpenAIChat?: () => void;
  unreadNotificationsCount?: number;
}

export function Navbar({
  user,
  onLogout,
  onGlobalSearch,
  selectedProject,
  onOpenQRScanner,
  onOpenAIChat,
  unreadNotificationsCount = 22,
}: NavbarProps) {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " WIB"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) return "Selamat pagi";
    if (hour >= 11 && hour < 15) return "Selamat siang";
    if (hour >= 15 && hour < 18) return "Selamat sore";
    return "Selamat malam";
  };

  const firstName = user?.name ? user.name.split(" ")[0] : "Ahmad";

  return (
    <header className="h-14 bg-[#0d2347] border-b border-[#1b3a6b] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-md">
      {/* Official Brand Logo & Dynamic Greeting */}
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <Image
            src="/icons/logo.png"
            alt="PT Asuka Engineering Indonesia"
            width={120}
            height={28}
            className="h-7 max-w-[130px] w-auto object-contain"
            priority
          />
        </div>
        <div className="border-l border-[#244785] pl-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs tracking-wider text-white uppercase">
              PT Asuka Engineering Indonesia
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] bg-[#163d78] text-[#38bdf8] border border-[#255bb5]">
              CMS EDMS
            </span>
            {selectedProject && (
              <span className="hidden xl:inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] bg-[#16a34a]/30 text-[#4ade80] border border-[#16a34a]/50">
                <Target className="w-2.5 h-2.5" />
                <span>{selectedProject}</span>
              </span>
            )}
          </div>
          <p className="text-[10.5px] text-slate-300 font-mono tracking-tight flex items-center gap-1">
            <span>{getGreeting()}, {firstName}</span>
          </p>
        </div>
      </div>

      {/* Global Document Search */}
      <div className="hidden md:flex items-center flex-1 max-w-sm mx-6">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 pointer-events-none" strokeWidth={1.8} />
          <input
            type="text"
            placeholder="Cari cepat dokumen, ITP, kalibrasi, atau proyek..."
            onChange={(e) => onGlobalSearch && onGlobalSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-xs bg-[#091830] text-slate-200 border border-[#244785] rounded-[6px] placeholder-slate-400 focus:outline-none focus:border-[#38bdf8]"
          />
        </div>
      </div>

      {/* Quick Action Tools & Status Indicators */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sync Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#052e16]/80 border border-[#166534] text-[11px] font-mono text-[#4ade80]">
          <span className="w-2 h-2 rounded-[2px] bg-[#22c55e] inline-block" />
          <span>Tersinkronisasi</span>
          <RefreshCw className="w-3 h-3 text-[#4ade80]" />
        </div>

        {/* Tabular Clock */}
        {timeStr && (
          <div className="hidden xl:block font-mono text-[11px] text-slate-300 tabular-nums px-2 py-1 bg-[#091830] rounded-[4px] border border-[#244785]">
            {timeStr}
          </div>
        )}

        {/* Scan QR Button */}
        {onOpenQRScanner && (
          <button
            onClick={onOpenQRScanner}
            className="hidden lg:flex items-center gap-1.5 h-8 px-2.5 rounded-[6px] bg-[#163d78]/50 hover:bg-[#163d78] text-slate-200 hover:text-white border border-[#244785] text-xs font-mono transition-colors"
            title="Pindai QR / Verifikasi Dokumen"
          >
            <QrCode className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Scan QR</span>
          </button>
        )}

        {/* Tanya AI QC Button */}
        {onOpenAIChat && (
          <button
            onClick={onOpenAIChat}
            className="hidden lg:flex items-center gap-1.5 h-8 px-2.5 rounded-[6px] bg-[#163d78]/70 hover:bg-[#163d78] text-[#38bdf8] hover:text-white border border-[#255bb5] text-xs font-mono font-semibold transition-colors"
            title="Buka Tanya AI QC"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Tanya AI QC</span>
          </button>
        )}

        {/* Notification Bell with Badge */}
        <button
          className="relative p-1.5 rounded-[4px] bg-[#163d78]/50 hover:bg-[#163d78] border border-[#244785] text-slate-200 transition-colors"
          title="Notifikasi Sistem"
        >
          <Bell className="w-4 h-4" strokeWidth={1.8} />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 px-1 min-w-[16px] h-4 rounded-[2px] bg-[#ed2e35] text-white text-[9.5px] font-mono font-bold flex items-center justify-center shadow">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* User Badge */}
        {user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-[#244785]">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-[6px] bg-[#091830] border border-[#244785]">
              <span className="text-xs font-semibold text-slate-100 hidden sm:inline">
                {user.name}
              </span>
              <span className="px-1.5 py-0.5 rounded-[3px] bg-[#ed2e35] text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                {user.role || "Admin"}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="h-8 px-2 text-slate-300 hover:text-white border-[#244785] bg-[#091830] hover:bg-[#163d78]"
              title="Keluar dari Sistem"
            >
              <LogOut className="w-3.5 h-3.5" strokeWidth={1.8} />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <UserIcon className="w-3.5 h-3.5" />
            <span>Guest</span>
          </div>
        )}
      </div>
    </header>
  );
}
