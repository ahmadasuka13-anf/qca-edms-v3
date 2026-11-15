"use client";

import React from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  Target,
  FileText,
  UploadCloud,
  Send,
  ClipboardCheck,
  Ruler,
  AlertCircle,
  ClipboardList,
  BarChart3,
  Building2,
  Users,
  Archive,
  Settings,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type NavTab =
  | "dashboard"
  | "command"
  | "documents"
  | "upload"
  | "transmittals"
  | "approval"
  | "calibration"
  | "nfilog"
  | "sitereport"
  | "analytics"
  | "projects"
  | "users"
  | "archive"
  | "settings";

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  selectedProject?: string;
  onProjectChange?: (projectCode: string) => void;
  projects?: { code: string; name: string }[];
  pendingApprovalCount?: number;
  onOpenAIChat?: () => void;
}

export function Sidebar({
  activeTab,
  onTabChange,
  selectedProject = "",
  onProjectChange,
  projects = [],
  pendingApprovalCount = 0,
  onOpenAIChat,
}: SidebarProps) {
  const menuGroups: {
    group: string;
    items: {
      id: NavTab;
      label: string;
      icon: React.ReactNode;
      badge?: number | string;
    }[];
  }[] = [
    {
      group: "DOKUMEN MUTU (EDMS)",
      items: [
        {
          id: "dashboard",
          label: "Overview Dashboard",
          icon: <LayoutDashboard className="w-4 h-4" strokeWidth={1.8} />,
        },
        {
          id: "command",
          label: "Command Center",
          icon: <Target className="w-4 h-4" strokeWidth={1.8} />,
        },
        {
          id: "documents",
          label: "Daftar Dokumen",
          icon: <FileText className="w-4 h-4" strokeWidth={1.8} />,
        },
        {
          id: "upload",
          label: "Unggah Dokumen",
          icon: <UploadCloud className="w-4 h-4" strokeWidth={1.8} />,
        },
        {
          id: "transmittals",
          label: "Transmittal Dokumen",
          icon: <Send className="w-4 h-4" strokeWidth={1.8} />,
        },
        {
          id: "approval",
          label: "Approval & Tugas Saya",
          icon: <ClipboardCheck className="w-4 h-4" strokeWidth={1.8} />,
          badge: pendingApprovalCount > 0 ? pendingApprovalCount : undefined,
        },
      ],
    },
    {
      group: "INSPEKSI & ALAT UKUR",
      items: [
        {
          id: "calibration",
          label: "Kalibrasi Alat Ukur",
          icon: <Ruler className="w-4 h-4" strokeWidth={1.8} />,
        },
        {
          id: "nfilog",
          label: "NFI Log (Temuan Mutu)",
          icon: <AlertCircle className="w-4 h-4" strokeWidth={1.8} />,
        },
        {
          id: "sitereport",
          label: "Inspeksi Lapangan",
          icon: <ClipboardList className="w-4 h-4" strokeWidth={1.8} />,
        },
      ],
    },
    {
      group: "MONITORING & SISTEM",
      items: [
        {
          id: "analytics",
          label: "Executive Analytics",
          icon: <BarChart3 className="w-4 h-4" strokeWidth={1.8} />,
        },
        {
          id: "projects",
          label: "Kelola Proyek",
          icon: <Building2 className="w-4 h-4" strokeWidth={1.8} />,
        },
        {
          id: "users",
          label: "Manajemen Pengguna",
          icon: <Users className="w-4 h-4" strokeWidth={1.8} />,
        },
        {
          id: "archive",
          label: "Arsip & Sampah",
          icon: <Archive className="w-4 h-4" strokeWidth={1.8} />,
        },
        {
          id: "settings",
          label: "Pengaturan Sistem",
          icon: <Settings className="w-4 h-4" strokeWidth={1.8} />,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#0a0f1d] border-r border-[#1e293b] flex flex-col h-[calc(100vh-3.5rem)] shrink-0 select-none">
      {/* 🎯 GLOBAL PROJECT FOCUS (Top of Sidebar) */}
      <div className="p-3 border-b border-[#1e293b] bg-[#070b14] space-y-1.5">
        <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-[#38bdf8]">
            <Target className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Fokus Proyek</span>
          </span>
          {selectedProject && (
            <button
              onClick={() => onProjectChange && onProjectChange("")}
              className="text-[9.5px] text-slate-400 hover:text-white underline"
            >
              Reset
            </button>
          )}
        </div>
        <select
          value={selectedProject}
          onChange={(e) => onProjectChange && onProjectChange(e.target.value)}
          className="w-full bg-[#0f172a] border border-[#1e293b] text-xs text-slate-200 rounded-[6px] px-2.5 py-1.5 outline-none focus:border-[#163d78] cursor-pointer"
        >
          <option value="">Semua Proyek (Global Portfolio)</option>
          {projects.map((p) => (
            <option key={p.code} value={p.code}>
              {p.code} — {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Main Navigation Menu */}
      <div className="p-3 space-y-5 flex-1 overflow-y-auto">
        {menuGroups.map((group) => (
          <div key={group.group} className="space-y-1">
            <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400">
              {group.group}
            </div>
            <div className="mt-1 space-y-0.5">
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-medium transition-colors text-left",
                      isActive
                        ? "bg-[#163d78] text-white font-semibold border border-[#163d78]"
                        : "text-slate-300 hover:bg-[#1e293b] hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(isActive ? "text-white" : "text-slate-400")}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={cn(
                          "px-1.5 py-0.2 rounded-[2px] font-mono text-[10px] font-bold tabular-nums",
                          isActive
                            ? "bg-white text-[#163d78]"
                            : "bg-[#ed2e35] text-white"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 🤖 TANYA AI QC & OFFICIAL FOOTER BRANDING */}
      <div className="p-3 border-t border-[#1e293b] bg-[#070b14] space-y-3">
        {onOpenAIChat && (
          <button
            onClick={onOpenAIChat}
            className="w-full flex items-center justify-between px-3 py-2 rounded-[6px] bg-[#163d78]/20 hover:bg-[#163d78]/40 border border-[#163d78]/50 text-xs text-slate-200 transition-colors"
            title="Buka Asisten Tanya AI QC"
          >
            <span className="flex items-center gap-2 font-medium">
              <Bot className="w-4 h-4 text-[#38bdf8]" />
              <span>Tanya AI QC</span>
            </span>
            <span className="text-[10px] font-mono bg-[#163d78] text-white px-1.5 py-0.5 rounded-[2px] font-bold">
              AI
            </span>
          </button>
        )}

        <div className="text-center pt-1">
          <Image
            src="/icons/logo.png"
            alt="ASUKA Logo"
            width={100}
            height={24}
            className="h-5 w-auto object-contain mx-auto mb-1 opacity-80"
          />
          <div className="text-[10px] font-mono font-semibold text-slate-300 uppercase tracking-wider">
            PT Asuka Engineering Indonesia
          </div>
          <div className="text-[9px] font-mono text-slate-400 mt-0.5">
            QCA EDMS Engine v3.0 (Next.js + TS)
          </div>
        </div>
      </div>
    </aside>
  );
}
