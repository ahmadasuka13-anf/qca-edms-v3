"use client";

import React, { useState, useMemo } from "react";
import { Search, RefreshCw, Plus, QrCode, FileText, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { CalibrationTool, CalibrationSummary } from "../types";
import { formatDate } from "@/lib/utils";

interface CalibrationTableProps {
  tools: CalibrationTool[];
  summary: CalibrationSummary;
  isLoading: boolean;
  onRefresh: () => void;
  onAddNew: () => void;
  onScanLabel?: () => void;
}

export function CalibrationTable({
  tools,
  summary,
  isLoading,
  onRefresh,
  onAddNew,
  onScanLabel,
}: CalibrationTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchSearch =
        tool.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tool.certificateNo && tool.certificateNo.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchDiscipline = selectedDiscipline === "ALL" || tool.discipline === selectedDiscipline;
      const matchStatus = selectedStatus === "ALL" || tool.status === selectedStatus;

      return matchSearch && matchDiscipline && matchStatus;
    });
  }, [tools, searchTerm, selectedDiscipline, selectedStatus]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VALID":
      case "CALIBRATED":
        return <Badge variant="approved">VALID</Badge>;
      case "EXPIRING_SOON":
        return <Badge variant="expiring">EXPIRING</Badge>;
      case "EXPIRED":
        return <Badge variant="overdue">EXPIRED</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Technical Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-[#1e293b]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Total Alat Ukur</span>
            <FileText className="w-4 h-4 text-slate-400" strokeWidth={1.8} />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-100 tabular-nums">
            {summary.totalTools}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Terdaftar di master kalibrasi</p>
        </Card>

        <Card className="p-4 border-[#1e293b]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#4ade80]">Sertifikat Valid</span>
            <CheckCircle2 className="w-4 h-4 text-[#4ade80]" strokeWidth={1.8} />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#4ade80] tabular-nums">
            {summary.validCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Status kalibrasi aktif</p>
        </Card>

        <Card className="p-4 border-[#1e293b]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#facc15]">Segera Berakhir</span>
            <Clock className="w-4 h-4 text-[#facc15]" strokeWidth={1.8} />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#facc15] tabular-nums">
            {summary.expiringCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">&le; 30 hari ke depan</p>
        </Card>

        <Card className="p-4 border-[#1e293b]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#f87171]">Sudah Kedaluwarsa</span>
            <AlertTriangle className="w-4 h-4 text-[#f87171]" strokeWidth={1.8} />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#f87171] tabular-nums">
            {summary.expiredCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Perlu re-kalibrasi segera</p>
        </Card>
      </div>

      {/* Industrial Filter & Action Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0f172a] p-4 border border-[#1e293b] rounded-[6px]">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="w-full sm:w-64">
            <Input
              placeholder="Cari ID alat / Nama / No Sertifikat..."
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
            <option value="CIVIL">CIVIL & ARCHITECTURAL</option>
            <option value="MECHANICAL">MECHANICAL & PIPING</option>
            <option value="ELECTRICAL">ELECTRICAL</option>
            <option value="INSTRUMENT">INSTRUMENTATION</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 bg-[#1e293b] text-slate-200 border border-[#334155] rounded-[6px] px-3 text-xs focus:outline-none focus:border-[#163d78]"
          >
            <option value="ALL">SEMUA STATUS</option>
            <option value="VALID">VALID</option>
            <option value="EXPIRING_SOON">EXPIRING SOON</option>
            <option value="EXPIRED">EXPIRED</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {onScanLabel && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onScanLabel}
              icon={<QrCode className="w-4 h-4" strokeWidth={1.8} />}
            >
              Scan Label
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            isLoading={isLoading}
            icon={<RefreshCw className="w-4 h-4" strokeWidth={1.8} />}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onAddNew}
            icon={<Plus className="w-4 h-4" strokeWidth={1.8} />}
          >
            Update Kalibrasi
          </Button>
        </div>
      </div>

      {/* Main Technical Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">NO</TableHead>
            <TableHead className="w-32">TOOL ID</TableHead>
            <TableHead>NAMA ALAT & SPESIFIKASI</TableHead>
            <TableHead className="w-32">DISIPLIN</TableHead>
            <TableHead className="w-28 text-center">TGL KALIBRASI</TableHead>
            <TableHead className="w-28 text-center">TGL KEDALUWARSA</TableHead>
            <TableHead className="w-28 text-center">STATUS</TableHead>
            <TableHead className="w-36">NO SERTIFIKAT</TableHead>
            <TableHead className="w-28">PIC</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTools.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-slate-400 font-mono text-xs">
                {isLoading ? "Memuat data kalibrasi dari Google Apps Script..." : "Tidak ada data alat ukur yang sesuai kriteria."}
              </TableCell>
            </TableRow>
          ) : (
            filteredTools.map((tool, index) => (
              <TableRow key={tool.id}>
                <TableCell className="text-center font-mono text-slate-400 text-xs">
                  {index + 1}
                </TableCell>
                <TableCell className="font-mono font-semibold text-[#38bdf8] text-xs">
                  {tool.id}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-100">{tool.name}</div>
                  {tool.brand && (
                    <div className="text-[11px] text-slate-400 font-mono">
                      {tool.brand} {tool.serialNumber ? `| SN: ${tool.serialNumber}` : ""}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs text-slate-300">{tool.discipline}</span>
                </TableCell>
                <TableCell className="text-center font-mono text-xs text-slate-300">
                  {formatDate(tool.lastCalDate)}
                </TableCell>
                <TableCell className="text-center font-mono text-xs text-slate-300">
                  {formatDate(tool.nextCalDate)}
                </TableCell>
                <TableCell className="text-center">
                  {getStatusBadge(tool.status)}
                </TableCell>
                <TableCell className="font-mono text-[11px] text-slate-300 truncate max-w-[140px]">
                  {tool.certificateNo || "-"}
                </TableCell>
                <TableCell className="text-xs text-slate-300">
                  {tool.pic || "-"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
