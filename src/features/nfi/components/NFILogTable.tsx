"use client";

import React, { useState, useMemo } from "react";
import { Search, RefreshCw, Plus, CheckCircle2, Clock, XCircle, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { NFIEntry, NFISummary } from "../types";
import { formatDate } from "@/lib/utils";

interface NFILogTableProps {
  entries: NFIEntry[];
  summary: NFISummary;
  isLoading: boolean;
  onRefresh: () => void;
  onAddNew?: () => void;
}

export function NFILogTable({
  entries,
  summary,
  isLoading,
  onRefresh,
  onAddNew,
}: NFILogTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      const matchSearch =
        item.noNfi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subjectDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.picAei.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDiscipline = selectedDiscipline === "ALL" || item.discipline === selectedDiscipline;
      const matchStatus = selectedStatus === "ALL" || item.status === selectedStatus;

      return matchSearch && matchDiscipline && matchStatus;
    });
  }, [entries, searchTerm, selectedDiscipline, selectedStatus]);

  const renderResultBadge = (result: string) => {
    switch (result) {
      case "PASS":
        return <Badge variant="approved">PASS</Badge>;
      case "FAIL":
        return <Badge variant="overdue">FAIL</Badge>;
      case "RE-INSPECT":
        return <Badge variant="expiring">RE-INSPECT</Badge>;
      default:
        return <Badge variant="neutral">{result}</Badge>;
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
      case "PENDING":
        return <Badge variant="pending">OPEN</Badge>;
      case "CLOSED":
      case "RESOLVED":
        return <Badge variant="approved">CLOSED</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-[#1e293b]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Total Temuan NFI</span>
            <FileSpreadsheet className="w-4 h-4 text-slate-400" strokeWidth={1.8} />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-100 tabular-nums">
            {summary.total}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Notice of Finding tercatat</p>
        </Card>

        <Card className="p-4 border-[#1e293b]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#facc15]">Temuan Open</span>
            <Clock className="w-4 h-4 text-[#facc15]" strokeWidth={1.8} />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#facc15] tabular-nums">
            {summary.openCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Perlu tindakan perbaikan (CAPA)</p>
        </Card>

        <Card className="p-4 border-[#1e293b]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#f87171]">Hasil Fail / Re-Inspect</span>
            <XCircle className="w-4 h-4 text-[#f87171]" strokeWidth={1.8} />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#f87171] tabular-nums">
            {summary.failCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Tidak sesuai spesifikasi teknis</p>
        </Card>

        <Card className="p-4 border-[#1e293b]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#4ade80]">Selesai (Closed)</span>
            <CheckCircle2 className="w-4 h-4 text-[#4ade80]" strokeWidth={1.8} />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#4ade80] tabular-nums">
            {summary.closedCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Telah diverifikasi tuntas</p>
        </Card>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#0f172a] p-3.5 border border-[#1e293b] rounded-[6px]">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="w-full sm:w-72">
            <Input
              placeholder="Cari nomor NFI / uraian / area / PIC..."
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
            <option value="OPEN">OPEN / PENDING</option>
            <option value="CLOSED">CLOSED / RESOLVED</option>
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
              Catat Temuan NFI
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">NO</TableHead>
            <TableHead className="w-36">NO NFI</TableHead>
            <TableHead>URAIAN TEMUAN & LOKASI</TableHead>
            <TableHead className="w-28">DISIPLIN</TableHead>
            <TableHead className="w-24 text-center">TGL INSPEKSI</TableHead>
            <TableHead className="w-24 text-center">HASIL</TableHead>
            <TableHead className="w-24 text-center">STATUS</TableHead>
            <TableHead className="w-32">PIC AEI</TableHead>
            <TableHead className="w-40">TINDAK LANJUT / REMARK</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEntries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-slate-400 font-mono text-xs">
                {isLoading ? "Mengambil data NFI Log dari Master..." : "Tidak ada temuan NFI yang sesuai kriteria."}
              </TableCell>
            </TableRow>
          ) : (
            filteredEntries.map((item, idx) => (
              <TableRow key={item.nfiId}>
                <TableCell className="text-center font-mono text-slate-400 text-xs">
                  {idx + 1}
                </TableCell>
                <TableCell className="font-mono font-semibold text-[#38bdf8] text-xs">
                  {item.noNfi}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-100 text-xs">{item.subjectDescription}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {item.area} • {item.location}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-slate-300">
                  {item.discipline}
                </TableCell>
                <TableCell className="text-center font-mono text-xs text-slate-300">
                  {formatDate(item.inspectionDate)}
                </TableCell>
                <TableCell className="text-center">
                  {renderResultBadge(item.result)}
                </TableCell>
                <TableCell className="text-center">
                  {renderStatusBadge(item.status)}
                </TableCell>
                <TableCell className="text-xs text-slate-300">
                  {item.picAei}
                </TableCell>
                <TableCell className="text-[11px] text-slate-300 truncate max-w-[180px]">
                  {item.remark || "-"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
