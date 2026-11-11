"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Target,
  Search,
  RefreshCw,
  Download,
  BarChart2,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileText,
  ClipboardCheck,
  PackageCheck,
  Filter,
  SlidersHorizontal,
  ExternalLink,
} from "lucide-react";
import { commandCenterService } from "../services/command-center-service";
import {
  ExecutiveProject,
  ExecutiveTotals,
  CCSortOrder,
} from "../types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface CommandCenterViewProps {
  onSelectProject?: (projectCode: string) => void;
  showToast?: (message: string, type?: "success" | "error" | "info") => void;
}

export function CommandCenterView({
  onSelectProject,
  showToast,
}: CommandCenterViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [projects, setProjects] = useState<ExecutiveProject[]>([]);
  const [totals, setTotals] = useState<ExecutiveTotals | null>(null);
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<CCSortOrder>("critical_first");
  const [showCharts, setShowCharts] = useState(true);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  // Fetch data
  const loadData = useCallback(async () => {
    try {
      const res = await commandCenterService.getExecutiveDashboard();
      if (res.success) {
        setProjects(res.projects || []);
        setTotals(res.totals || null);
        setDisciplines(res.disciplines || []);
        setLastUpdate(res.lastUpdate || new Date().toISOString());
      }
    } catch {
      showToast?.("Gagal memuat data Command Center", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      if (!active) return;
      await loadData();
    }, 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [loadData]);

  // Filter & Sort Logic
  const filteredProjects = useMemo(() => {
    let result = projects;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.code.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          (p.pic && p.pic.toLowerCase().includes(q))
      );
    }

    // Discipline filter
    if (selectedDiscipline) {
      if (selectedDiscipline === "MRIR") {
        result = result.filter((p) => (p.totalMRIR || 0) > 0);
      } else {
        result = result.filter((p) => {
          const inDisciplines = p.disciplines?.some(
            (d) => d.toLowerCase() === selectedDiscipline.toLowerCase()
          );
          const inItrDisc = p.itrByDiscipline
            ? Object.keys(p.itrByDiscipline).some(
                (k) =>
                  k.toLowerCase().includes(selectedDiscipline.toLowerCase()) &&
                  (p.itrByDiscipline?.[k] || 0) > 0
              )
            : false;
          return inDisciplines || inItrDisc;
        });
      }
    }

    // Sort order
    const sorted = [...result].sort((a, b) => {
      if (sortOrder === "critical_first") {
        const healthRank: Record<string, number> = { red: 0, yellow: 1, green: 2 };
        const hA = healthRank[a.health] ?? 3;
        const hB = healthRank[b.health] ?? 3;
        if (hA !== hB) return hA - hB;
        return (b.oldestOpenDays || 0) - (a.oldestOpenDays || 0);
      }
      if (sortOrder === "progress_asc") {
        const pctA = a.total > 0 ? a.closed / a.total : 0;
        const pctB = b.total > 0 ? b.closed / b.total : 0;
        return pctA - pctB;
      }
      if (sortOrder === "total_desc") {
        return (b.total || 0) - (a.total || 0);
      }
      if (sortOrder === "code_asc") {
        return a.code.localeCompare(b.code);
      }
      return 0;
    });

    return sorted;
  }, [projects, searchQuery, selectedDiscipline, sortOrder]);

  // Sync Action
  const handleSync = async () => {
    setIsSyncing(true);
    setIsLoading(true);
    try {
      const res = await commandCenterService.syncAllProjects();
      showToast?.(res.message || "Sinkronisasi selesai", "success");
      await loadData();
    } catch {
      showToast?.("Gagal sinkronisasi proyek", "error");
    } finally {
      setIsSyncing(false);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (!totals || projects.length === 0) {
      showToast?.("Tidak ada data untuk diekspor", "info");
      return;
    }
    commandCenterService.exportToCSV(filteredProjects, totals);
    showToast?.("Data Command Center berhasil diekspor ke CSV", "success");
  };

  // Toggle card details
  const toggleCard = (code: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [code]: !prev[code],
    }));
  };

  // Overall Global Completion
  const globalProgress = useMemo(() => {
    if (!totals || totals.total === 0) return 0;
    return Math.round((totals.closed / totals.total) * 100);
  }, [totals]);

  // Max Aging Project
  const maxAgingInfo = useMemo(() => {
    let maxDays = 0;
    let projCode = "";
    for (const p of projects) {
      if ((p.oldestOpenDays || 0) > maxDays && p.open > 0) {
        maxDays = p.oldestOpenDays || 0;
        projCode = p.code;
      }
    }
    return { maxDays, projCode };
  }, [projects]);

  return (
    <div className="space-y-6">
      {/* ═══ HEADER ═══ */}
      <div className="border-b border-[#1e293b] pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-[6px] bg-[#163d78]/30 border border-[#163d78]/60 flex items-center justify-center text-[#163d78]">
              <Target className="w-4 h-4 text-slate-100" strokeWidth={2} />
            </span>
            <h1 className="text-lg font-bold tracking-wide text-slate-100 uppercase">
              QA/QC Command Center
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Monitor seluruh portofolio proyek dalam 1 layar — terhubung langsung ke Master Hub & ITR
          </p>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCharts(!showCharts)}
            className={cn(
              "text-xs font-mono gap-1.5",
              showCharts && "bg-[#1e293b] text-slate-100 border-slate-600"
            )}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Grafik Presentasi</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="text-xs font-mono gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSync}
            disabled={isSyncing}
            className="text-xs font-mono gap-1.5 bg-[#163d78] hover:bg-[#1a4a91]"
          >
            <RefreshCw
              className={cn("w-3.5 h-3.5", isSyncing && "animate-spin")}
            />
            <span>{isSyncing ? "Menyinkronkan..." : "Sync Data"}</span>
          </Button>
        </div>
      </div>

      {/* ═══ EXECUTIVE 2-ZONE TOOLBAR ═══ */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-[8px] p-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left Zone: Search & Filters */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Box */}
          <div className="relative min-w-[240px] max-w-sm flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari proyek, kode, atau PIC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0f1d] border border-[#1e293b] focus:border-[#163d78] rounded-[6px] pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none"
            />
          </div>

          {/* Discipline Select */}
          <div className="flex items-center gap-1.5 bg-[#0a0f1d] border border-[#1e293b] rounded-[6px] px-2.5 py-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value)}
              className="bg-transparent text-xs text-slate-300 outline-none cursor-pointer pr-2"
            >
              <option value="" className="bg-[#0f172a]">
                Semua Disiplin
              </option>
              {disciplines.map((d) => (
                <option key={d} value={d} className="bg-[#0f172a]">
                  {d}
                </option>
              ))}
              <option value="MRIR" className="bg-[#0f172a]">
                MRIR (Material Receiving)
              </option>
            </select>
          </div>

          {/* Sort Order Select */}
          <div className="flex items-center gap-1.5 bg-[#0a0f1d] border border-[#1e293b] rounded-[6px] px-2.5 py-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as CCSortOrder)}
              className="bg-transparent text-xs text-slate-300 outline-none cursor-pointer pr-2"
            >
              <option value="critical_first" className="bg-[#0f172a]">
                Prioritas: Kritis Dulu
              </option>
              <option value="progress_asc" className="bg-[#0f172a]">
                Progres: Terendah Dulu
              </option>
              <option value="total_desc" className="bg-[#0f172a]">
                Volume: Terbanyak Dulu
              </option>
              <option value="code_asc" className="bg-[#0f172a]">
                Kode Proyek: A - Z
              </option>
            </select>
          </div>

          {/* Reset button if filtered */}
          {(searchQuery || selectedDiscipline) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDiscipline("");
              }}
              className="text-[11px] font-mono text-slate-400 hover:text-slate-200 underline px-1"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Right Zone: Status Indicator */}
        <div className="flex items-center gap-2 text-right justify-end shrink-0">
          <span className="text-[11px] font-mono text-slate-400 tabular-nums">
            {lastUpdate
              ? `Update: ${new Date(lastUpdate).toLocaleTimeString("id-ID")}`
              : "Menunggu sinkronisasi..."}
          </span>
        </div>
      </div>

      {/* ═══ 1. TOP EXECUTIVE 3-COLUMN GLASS DECK ═══ */}
      {totals && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column 1: Volume Dokumen Mutu */}
          <Card className="p-4 bg-[#0f172a] border border-[#1e293b] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-[#2563eb]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                  Volume Dokumen Mutu
                </h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-[6px] bg-[#0a0f1d] border-l-2 border-[#2563eb]">
                  <span className="text-xs text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#2563eb]" />
                    NFI Unik
                  </span>
                  <span className="text-sm font-bold font-mono text-slate-100 tabular-nums">
                    {(totals.totalNFI || 0).toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-[6px] bg-[#0a0f1d] border-l-2 border-slate-400">
                  <span className="text-xs text-slate-300 flex items-center gap-1.5">
                    <ClipboardCheck className="w-3.5 h-3.5 text-slate-400" />
                    ITR Terverifikasi
                  </span>
                  <span className="text-sm font-bold font-mono text-slate-100 tabular-nums">
                    {(totals.totalITR || 0).toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-[6px] bg-[#0a0f1d] border-l-2 border-[#d97706]">
                  <span className="text-xs text-[#d97706] flex items-center gap-1.5">
                    <PackageCheck className="w-3.5 h-3.5 text-[#d97706]" />
                    MRIR Material
                  </span>
                  <span className="text-sm font-bold font-mono text-[#d97706] tabular-nums">
                    {(totals.totalMRIR || 0).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1e293b] flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>
                Total:{" "}
                <strong className="text-slate-200 tabular-nums">
                  {totals.total.toLocaleString("id-ID")}
                </strong>{" "}
                records
              </span>
              <span>
                <strong className="text-slate-200 tabular-nums">
                  {totals.projectsActive}
                </strong>{" "}
                Proyek Aktif
              </span>
            </div>
          </Card>

          {/* Column 2: Klasifikasi Disiplin (ITR & MRIR) */}
          <Card className="p-4 bg-[#0f172a] border border-[#1e293b] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ClipboardCheck className="w-4 h-4 text-slate-300" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                  Klasifikasi Disiplin (ITR & MRIR)
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-1.5 max-h-[148px] overflow-y-auto pr-1">
                {Object.entries(totals.itrByDiscipline || {}).map(
                  ([disc, count]) => {
                    const isSelected = selectedDiscipline === disc.replace("ITR ", "");
                    return (
                      <button
                        key={disc}
                        onClick={() =>
                          setSelectedDiscipline(
                            isSelected ? "" : disc.replace("ITR ", "")
                          )
                        }
                        className={cn(
                          "flex items-center justify-between p-1.5 rounded-[4px] border text-left transition-colors",
                          isSelected
                            ? "bg-[#163d78] border-[#163d78] text-white"
                            : "bg-[#0a0f1d] border-[#1e293b] text-slate-300 hover:border-slate-600"
                        )}
                        title={`Filter proyek ${disc}`}
                      >
                        <span className="text-[11px] truncate">{disc}</span>
                        <span className="text-[11px] font-mono font-bold ml-1 tabular-nums">
                          {count.toLocaleString("id-ID")}
                        </span>
                      </button>
                    );
                  }
                )}

                {/* MRIR Badge */}
                <button
                  onClick={() =>
                    setSelectedDiscipline(
                      selectedDiscipline === "MRIR" ? "" : "MRIR"
                    )
                  }
                  className={cn(
                    "col-span-2 flex items-center justify-between p-1.5 rounded-[4px] border text-left transition-colors",
                    selectedDiscipline === "MRIR"
                      ? "bg-[#d97706]/30 border-[#d97706] text-[#f59e0b]"
                      : "bg-[#0a0f1d] border-[#d97706]/30 text-[#d97706] hover:bg-[#d97706]/10"
                  )}
                  title="Filter proyek dokumen MRIR"
                >
                  <span className="text-[11px] font-semibold flex items-center gap-1.5">
                    <PackageCheck className="w-3.5 h-3.5" />
                    MRIR (Material Receiving)
                  </span>
                  <span className="text-[11px] font-mono font-bold tabular-nums">
                    {(totals.totalMRIR || 0).toLocaleString("id-ID")}
                  </span>
                </button>
              </div>
            </div>

            <div className="mt-3 pt-2 text-[10.5px] font-mono text-slate-400">
              {totals.itrEmpty > 0 ? (
                <span className="text-[#ed2e35]">
                  {totals.itrEmpty} data belum terklasifikasi nomor ITR
                </span>
              ) : (
                "Seluruh data ITR terklasifikasi rapi — klik kartu untuk filter."
              )}
            </div>
          </Card>

          {/* Column 3: Status Pelaksanaan Global */}
          <Card className="p-4 bg-[#0f172a] border border-[#1e293b] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                  Status Pelaksanaan Global
                </h3>
              </div>

              <div className="flex items-center gap-4 my-2">
                {/* Progress Dial */}
                <div className="w-16 h-16 rounded-[4px] bg-[#0a0f1d] border border-[#1e293b] flex flex-col items-center justify-center shrink-0">
                  <span className="text-lg font-bold font-mono text-[#16a34a] tabular-nums">
                    {globalProgress}%
                  </span>
                  <span className="text-[9px] uppercase font-mono text-slate-400">
                    Selesai
                  </span>
                </div>

                <div className="space-y-0.5">
                  <div className="text-sm font-bold font-mono text-[#16a34a] tabular-nums">
                    {totals.closed.toLocaleString("id-ID")} Closed
                  </div>
                  <div className="text-xs font-bold font-mono text-[#ed2e35] tabular-nums">
                    {totals.open.toLocaleString("id-ID")} Open Aktif
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 tabular-nums">
                    {(totals.canceled + totals.other).toLocaleString("id-ID")}{" "}
                    Canceled / Lain
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Status Banner */}
            <div className="mt-3 pt-2 border-t border-[#1e293b]">
              {maxAgingInfo.maxDays > 30 ? (
                <div className="p-2 rounded-[4px] bg-[#ed2e35]/10 border border-[#ed2e35]/30 flex items-center gap-2 text-xs text-[#ed2e35] font-mono">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    Aging Terlama: <strong>{maxAgingInfo.maxDays} hari</strong>{" "}
                    (Proyek {maxAgingInfo.projCode})
                  </span>
                </div>
              ) : (
                <div className="p-2 rounded-[4px] bg-[#16a34a]/10 border border-[#16a34a]/30 flex items-center gap-2 text-xs text-[#16a34a] font-mono">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Seluruh Proyek Berjalan Sesuai Jadwal</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* ═══ PRESENTATION CHARTS DECK ═══ */}
      {showCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Chart 1: Project Comparison Bar Chart */}
          <Card className="p-4 bg-[#0f172a] border border-[#1e293b]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1e293b]">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-slate-300" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                  Komparasi Status Dokumen per Proyek
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                {filteredProjects.length} Proyek
              </span>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {filteredProjects.map((p) => {
                const total = p.total || 1;
                const closedPct = Math.round((p.closed / total) * 100);
                const openPct = Math.round((p.open / total) * 100);
                const mrirCount = p.totalMRIR || 0;

                return (
                  <div key={p.code} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-200">
                          {p.code}
                        </span>
                        <span className="text-slate-400 truncate max-w-[160px] hidden sm:inline">
                          {p.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-mono tabular-nums">
                        <span className="text-[#16a34a]">{p.closed} Cls</span>
                        <span className="text-[#ed2e35]">{p.open} Opn</span>
                        {mrirCount > 0 && (
                          <span className="text-[#d97706]">{mrirCount} MRIR</span>
                        )}
                      </div>
                    </div>

                    {/* Technical Multi-bar */}
                    <div className="h-2 w-full bg-[#0a0f1d] rounded-[2px] overflow-hidden flex">
                      <div
                        style={{ width: `${closedPct}%` }}
                        className="bg-[#16a34a] h-full"
                        title={`Closed: ${p.closed}`}
                      />
                      <div
                        style={{ width: `${openPct}%` }}
                        className="bg-[#ed2e35] h-full"
                        title={`Open: ${p.open}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-2 border-t border-[#1e293b] flex items-center justify-center gap-6 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-[1px] bg-[#16a34a]" />
                Closed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-[1px] bg-[#ed2e35]" />
                Open Aktif
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-[1px] bg-[#d97706]" />
                MRIR Material
              </span>
            </div>
          </Card>

          {/* Chart 2: Discipline & Material Distribution */}
          <Card className="p-4 bg-[#0f172a] border border-[#1e293b]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1e293b]">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-slate-300" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                  Distribusi Disiplin Mutu Portofolio
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                ITR & MRIR
              </span>
            </div>

            {totals && (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {Object.entries(totals.itrByDiscipline || {}).map(
                  ([disc, count]) => {
                    const pct =
                      totals.totalITR > 0
                        ? Math.round((count / totals.totalITR) * 100)
                        : 0;

                    return (
                      <div key={disc} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-mono">
                            {disc}
                          </span>
                          <span className="font-mono text-slate-400 tabular-nums">
                            {count} dok ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-[#0a0f1d] rounded-[2px] overflow-hidden">
                          <div
                            style={{ width: `${pct}%` }}
                            className="bg-[#163d78] h-full"
                          />
                        </div>
                      </div>
                    );
                  }
                )}

                {/* MRIR Distribution Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#d97706] font-mono font-semibold flex items-center gap-1.5">
                      <PackageCheck className="w-3.5 h-3.5" />
                      Material Receiving (MRIR)
                    </span>
                    <span className="font-mono text-[#d97706] tabular-nums">
                      {totals.totalMRIR || 0} dok
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#0a0f1d] rounded-[2px] overflow-hidden">
                    <div
                      style={{
                        width: `${
                          totals.total > 0
                            ? Math.round(
                                ((totals.totalMRIR || 0) / totals.total) * 100
                              )
                            : 0
                        }%`,
                      }}
                      className="bg-[#d97706] h-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ═══ 2. ACTIVE PROJECTS GRID ═══ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono">
            Portofolio Proyek Aktif ({filteredProjects.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="p-8 text-center bg-[#0f172a] border border-[#1e293b] rounded-[8px]">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-slate-400 mb-2" />
            <p className="text-xs text-slate-400 font-mono">
              Memuat portofolio proyek...
            </p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-8 text-center bg-[#0f172a] border border-[#1e293b] rounded-[8px]">
            <Search className="w-6 h-6 mx-auto text-slate-500 mb-2" />
            <p className="text-xs text-slate-400 font-mono">
              Tidak ada proyek yang sesuai dengan kriteria filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((p) => {
              const pct = p.total > 0 ? Math.round((p.closed / p.total) * 100) : 0;
              const isExpanded = !!expandedCards[p.code];
              const mrirCount = p.totalMRIR || 0;

              return (
                <Card
                  key={p.code}
                  className={cn(
                    "p-4 bg-[#0f172a] border transition-colors flex flex-col justify-between",
                    p.health === "red"
                      ? "border-[#ed2e35]/50 hover:border-[#ed2e35]"
                      : p.health === "yellow"
                      ? "border-[#d97706]/50 hover:border-[#d97706]"
                      : "border-[#1e293b] hover:border-slate-500"
                  )}
                >
                  <div>
                    {/* Header: Code & Health Badge */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono font-bold text-sm text-[#163d78] bg-[#163d78]/10 px-2 py-0.5 rounded-[3px] border border-[#163d78]/30">
                        {p.code}
                      </span>
                      {p.health === "red" ? (
                        <Badge variant="rejected" className="rounded-[3px] font-mono">
                          Kritis
                        </Badge>
                      ) : p.health === "yellow" ? (
                        <Badge variant="pending" className="rounded-[3px] font-mono">
                          Waspada
                        </Badge>
                      ) : (
                        <Badge variant="approved" className="rounded-[3px] font-mono">
                          Lancar
                        </Badge>
                      )}
                    </div>

                    {/* Project Name */}
                    <h3
                      className="text-sm font-bold text-slate-100 line-clamp-1 mb-3"
                      title={p.name}
                    >
                      {p.name}
                    </h3>

                    {/* Mini Metric Grid */}
                    <div className="grid grid-cols-5 gap-1 text-center bg-[#0a0f1d] p-2 rounded-[6px] border border-[#1e293b] mb-3">
                      <div>
                        <div className="text-xs font-mono font-bold text-slate-100 tabular-nums">
                          {p.totalNFI || 0}
                        </div>
                        <div className="text-[9px] font-mono text-slate-400">NFI</div>
                      </div>
                      <div>
                        <div className="text-xs font-mono font-bold text-slate-100 tabular-nums">
                          {p.totalITR || 0}
                        </div>
                        <div className="text-[9px] font-mono text-slate-400">ITR</div>
                      </div>
                      <div>
                        <div className="text-xs font-mono font-bold text-[#d97706] tabular-nums">
                          {mrirCount}
                        </div>
                        <div className="text-[9px] font-mono text-[#d97706]">MRIR</div>
                      </div>
                      <div>
                        <div className="text-xs font-mono font-bold text-[#ed2e35] tabular-nums">
                          {p.open || 0}
                        </div>
                        <div className="text-[9px] font-mono text-[#ed2e35]">Open</div>
                      </div>
                      <div>
                        <div className="text-xs font-mono font-bold text-[#16a34a] tabular-nums">
                          {p.closed || 0}
                        </div>
                        <div className="text-[9px] font-mono text-[#16a34a]">Clsd</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>Penyelesaian Dokumen</span>
                        <span className="font-bold text-slate-200 tabular-nums">
                          {pct}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-[#0a0f1d] rounded-[2px] overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className="bg-[#16a34a] h-full transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: PIC & Aging */}
                  <div>
                    <div className="pt-2 border-t border-[#1e293b] flex items-center justify-between text-xs text-slate-400 font-mono">
                      <div
                        className="flex items-center gap-1.5 truncate max-w-[180px]"
                        title={`PIC: ${p.pic || "Belum ditentukan"}`}
                      >
                        <User className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        <span className="truncate">{p.pic || "—"}</span>
                      </div>

                      {p.oldestOpenDays && p.oldestOpenDays > 0 && p.open > 0 ? (
                        <span
                          className={cn(
                            "flex items-center gap-1 font-bold tabular-nums",
                            p.oldestOpenDays > 30 ? "text-[#ed2e35]" : "text-[#d97706]"
                          )}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          {p.oldestOpenDays} hari
                        </span>
                      ) : (
                        <span className="text-[#16a34a] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          On Schedule
                        </span>
                      )}
                    </div>

                    {/* Detail Actions & Expansion Drawer */}
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <button
                        onClick={() => toggleCard(p.code)}
                        className="text-[11px] font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1"
                      >
                        <span>{isExpanded ? "Tutup Rincian" : "Lihat Rincian"}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {onSelectProject && (
                        <button
                          onClick={() => onSelectProject(p.code)}
                          className="text-[11px] font-mono text-[#163d78] hover:text-[#2563eb] flex items-center gap-1 font-semibold"
                        >
                          <span>Buka Dokumen</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Collapsible Rincian Drawer */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-[#1e293b] space-y-2 text-xs">
                        {/* ITR per Disiplin */}
                        {p.itrByDiscipline && Object.keys(p.itrByDiscipline).length > 0 && (
                          <div>
                            <div className="text-[10px] font-mono uppercase text-slate-400 mb-1">
                              ITR per Disiplin
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(p.itrByDiscipline).map(([d, c]) => (
                                <span
                                  key={d}
                                  className="px-1.5 py-0.5 rounded-[3px] bg-[#0a0f1d] border border-[#1e293b] text-[10px] font-mono text-slate-300"
                                >
                                  {d}: <strong className="text-white">{c}</strong>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Disciplines Chips */}
                        {p.disciplines && p.disciplines.length > 0 && (
                          <div>
                            <div className="text-[10px] font-mono uppercase text-slate-400 mb-1">
                              Disiplin Teknis
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {p.disciplines.map((d) => (
                                <span
                                  key={d}
                                  className="px-1.5 py-0.5 rounded-[3px] bg-[#163d78]/20 border border-[#163d78]/40 text-[10px] font-mono text-slate-200"
                                >
                                  {d}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

