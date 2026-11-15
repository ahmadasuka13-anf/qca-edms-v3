"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, LogOut, User as UserIcon, QrCode, Bot, Target } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { User } from "@/features/auth/types";

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onGlobalSearch?: (query: string) => void;
  selectedProject?: string;
  onOpenQRScanner?: () => void;
  onOpenAIChat?: () => void;
}

export function Navbar({
  user,
  onLogout,
  onGlobalSearch,
  selectedProject,
  onOpenQRScanner,
  onOpenAIChat,
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

  return (
    <header className="h-14 bg-[#0f172a] border-b border-[#1e293b] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Official Brand Logo & System Title */}
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
        <div className="border-l border-[#334155] pl-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs tracking-wider text-slate-100 uppercase">
              PT ASUKA ENGINEERING INDONESIA
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] bg-[#163d78]/40 text-[#38bdf8] border border-[#163d78]">
              EDMS v3.0
            </span>
            {selectedProject && (
              <span className="hidden xl:inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] bg-[#16a34a]/20 text-[#4ade80] border border-[#16a34a]/40">
                <Target className="w-2.5 h-2.5" />
                <span>{selectedProject}</span>
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 font-mono tracking-tight">
            Quality Control & Quality Assurance EDMS System
          </p>
        </div>
      </div>

      {/* Global Document Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 pointer-events-none" strokeWidth={1.8} />
          <input
            type="text"
            placeholder="Cari cepat dokumen, ITP, kalibrasi, atau proyek..."
            onChange={(e) => onGlobalSearch && onGlobalSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-xs bg-[#1e293b] text-slate-200 border border-[#334155] rounded-[6px] placeholder-slate-400 focus:outline-none focus:border-[#163d78]"
          />
        </div>
      </div>

      {/* Quick Action Tools & Status Indicators */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Scan QR Button */}
        {onOpenQRScanner && (
          <button
            onClick={onOpenQRScanner}
            className="flex items-center gap-1.5 h-8 px-2.5 rounded-[6px] bg-[#1e293b] hover:bg-[#334155] text-slate-300 hover:text-white border border-[#334155] text-xs font-mono transition-colors"
            title="Pindai QR / Verifikasi Dokumen"
          >
            <QrCode className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className="hidden sm:inline">Scan QR</span>
          </button>
        )}

        {/* Tanya AI QC Button */}
        {onOpenAIChat && (
          <button
            onClick={onOpenAIChat}
            className="flex items-center gap-1.5 h-8 px-2.5 rounded-[6px] bg-[#163d78]/30 hover:bg-[#163d78]/50 text-[#38bdf8] hover:text-white border border-[#163d78] text-xs font-mono font-semibold transition-colors"
            title="Buka Tanya AI QC"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tanya AI QC</span>
          </button>
        )}

        {/* Steady Connection Beacon */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-300 pl-2">
          <span className="w-2 h-2 rounded-[2px] bg-[#22c55e] inline-block" />
          <span className="text-[11px] text-slate-400">ONLINE</span>
        </div>

        {/* Tabular Clock */}
        {timeStr && (
          <div className="hidden lg:block font-mono text-xs text-slate-400 tabular-nums px-2 py-1 bg-[#1e293b] rounded-[4px] border border-[#334155]">
            {timeStr}
          </div>
        )}

        {/* User Badge */}
        {user ? (
          <div className="flex items-center gap-2.5 pl-2 border-l border-[#1e293b]">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-slate-200">{user.name}</div>
              <div className="text-[10px] font-mono text-[#38bdf8] uppercase tracking-wider">
                {user.role}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="h-8 px-2 text-slate-300 hover:text-white"
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
