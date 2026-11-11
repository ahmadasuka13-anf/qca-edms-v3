"use client";

import React from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  Target,
  FileText,
  UploadCloud,
  Send,
  Ruler,
  AlertCircle,
  ClipboardList,
  BarChart3,
  Building2,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type NavTab =
  | "dashboard"
  | "command"
  | "documents"
  | "upload"
  | "transmittals"
  | "calibration"
  | "nfilog"
  | "sitereport"
  | "analytics"
  | "projects"
  | "settings";

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuGroups: {
    group: string;
    items: { id: NavTab; label: string; icon: React.ReactNode }[];
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
          id: "settings",
          label: "Pengaturan Sistem",
          icon: <Settings className="w-4 h-4" strokeWidth={1.8} />,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#0a0f1d] border-r border-[#1e293b] flex flex-col h-[calc(100vh-3.5rem)] shrink-0 select-none">
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
                      "w-full flex items-center gap-3 px-3 py-2 rounded-[6px] text-xs font-medium transition-colors text-left",
                      isActive
                        ? "bg-[#163d78] text-white font-semibold border border-[#163d78]"
                        : "text-slate-300 hover:bg-[#1e293b] hover:text-white"
                    )}
                  >
                    <span className={cn(isActive ? "text-white" : "text-slate-400")}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Official Footer Branding */}
      <div className="p-4 border-t border-[#1e293b] text-center bg-[#070b14]">
        <Image
          src="/icons/logo.png"
          alt="ASUKA Logo"
          width={100}
          height={24}
          className="h-6 w-auto object-contain mx-auto mb-1.5 opacity-80"
        />
        <div className="text-[10px] font-mono font-semibold text-slate-300 uppercase tracking-wider">
          PT Asuka Engineering Indonesia
        </div>
        <div className="text-[9px] font-mono text-slate-400 mt-0.5">
          QCA EDMS Engine v3.0
        </div>
      </div>
    </aside>
  );
}
