"use client";

import React, { useState, useMemo } from "react";
import { Search, RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { SiteReportEntry } from "../types";
import { formatDate } from "@/lib/utils";

interface SiteReportTableProps {
  reports: SiteReportEntry[];
  isLoading: boolean;
  onRefresh: () => void;
  onAddNew?: () => void;
}

export function SiteReportTable({
  reports,
  isLoading,
  onRefresh,
  onAddNew,
}: SiteReportTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("ALL");

  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      const matchSearch =
        item.reportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.activitySummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.areaLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.inspectorName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDiscipline = selectedDiscipline === "ALL" || item.discipline === selectedDiscipline;

      return matchSearch && matchDiscipline;
    });
  }, [reports, searchTerm, selectedDiscipline]);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return <Badge variant="approved">VERIFIED</Badge>;
      case "SUBMITTED":
        return <Badge variant="submitted">SUBMITTED</Badge>;
      case "DRAFT":
        return <Badge variant="neutral">DRAFT</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#0f172a] p-3.5 border border-[#1e293b] rounded-[6px]">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="w-full sm:w-72">
            <Input
              placeholder="Cari no laporan / uraian kegiatan / area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" strokeWidth={1.8} />}
            />
          </div>

          <select
            value={selectedDiscipline}
            onChange={(e) => setSelectedDiscipline(e.target.value)}
            className="h-9 bg-[#1e293b] text-slate-200 border border-[#334155] rounded-[6px] px-3 text-xs focus:outline-none focus:border-[#163d78]"
          >
            <option value="ALL">SEMUA DISIPLIN</option>
            <option value="CIVIL">CIVIL</option>
            <option value="MECHANICAL">MECHANICAL</option>
            <option value="ELECTRICAL">ELECTRICAL</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            isLoading={isLoading}
            icon={<RefreshCw className="w-4 h-4" strokeWidth={1.8} />}
          >
            Refresh
          </Button>

          {onAddNew && (
            <Button
              variant="primary"
              size="sm"
              onClick={onAddNew}
              icon={<Plus className="w-4 h-4" strokeWidth={1.8} />}
            >
              Buat Laporan Harian
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">NO</TableHead>
            <TableHead className="w-36">NO LAPORAN</TableHead>
            <TableHead className="w-24 text-center">TGL LAPORAN</TableHead>
            <TableHead>URAIAN KEGIATAN INSPEKSI & CATATAN MUTU</TableHead>
            <TableHead className="w-28">DISIPLIN</TableHead>
            <TableHead className="w-32">AREA LOKASI</TableHead>
            <TableHead className="w-24 text-center">MANPOWER</TableHead>
            <TableHead className="w-28 text-center">STATUS</TableHead>
            <TableHead className="w-32">INSPEKTOR</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-slate-400 font-mono text-xs">
                {isLoading ? "Mengambil laporan inspeksi lapangan..." : "Belum ada laporan inspeksi harian."}
              </TableCell>
            </TableRow>
          ) : (
            filteredReports.map((item, idx) => (
              <TableRow key={item.reportId}>
                <TableCell className="text-center font-mono text-slate-400 text-xs">
                  {idx + 1}
                </TableCell>
                <TableCell className="font-mono font-semibold text-[#38bdf8] text-xs">
                  {item.reportNumber}
                </TableCell>
                <TableCell className="text-center font-mono text-xs text-slate-300">
                  {formatDate(item.reportDate)}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-100 text-xs">{item.activitySummary}</div>
                  {item.qualityIssue && (
                    <div className="text-[11px] text-[#4ade80] font-mono mt-0.5">
                      Mutu: {item.qualityIssue}
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs text-slate-300">
                  {item.discipline}
                </TableCell>
                <TableCell className="text-xs text-slate-300 truncate max-w-[120px]">
                  {item.areaLocation}
                </TableCell>
                <TableCell className="text-center font-mono text-xs text-slate-300 tabular-nums">
                  {item.manpowerCount ? `${item.manpowerCount} Orang` : "-"}
                </TableCell>
                <TableCell className="text-center">
                  {renderStatusBadge(item.status)}
                </TableCell>
                <TableCell className="text-xs text-slate-300">
                  {item.inspectorName}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
