"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  ExternalLink,
  Check,
  X,
  RefreshCw,
  Eye,
  History,
  FileText,
  QrCode,
  FileSpreadsheet,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { DocumentItem } from "../types";
import { formatDate } from "@/lib/utils";

interface DocumentListTableProps {
  documents: DocumentItem[];
  isLoading: boolean;
  onRefresh: () => void;
  onAddNew?: () => void;
  onViewDetail?: (doc: DocumentItem) => void;
  onPreviewDoc?: (doc: DocumentItem) => void;
  onHistoryDoc?: (doc: DocumentItem) => void;
  onApprove?: (docId: string) => void;
  onReject?: (docId: string) => void;
  onOpenQRScanner?: () => void;
}

export function DocumentListTable({
  documents,
  isLoading,
  onRefresh,
  onAddNew,
  onViewDetail,
  onPreviewDoc,
  onHistoryDoc,
  onApprove,
  onReject,
  onOpenQRScanner,
}: DocumentListTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchSearch =
        doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.projectName && doc.projectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.uploaderName && doc.uploaderName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchType = selectedType === "ALL" || doc.documentType === selectedType;
      const matchDiscipline = selectedDiscipline === "ALL" || doc.discipline === selectedDiscipline;
      const matchStatus =
        selectedStatus === "ALL" ||
        (doc.status || "").toUpperCase() === selectedStatus.toUpperCase();

      return matchSearch && matchType && matchDiscipline && matchStatus;
    });
  }, [documents, searchTerm, selectedType, selectedDiscipline, selectedStatus]);

  // Donut chart status breakdown (Matching CMS Screenshot)
  const statusCounts = useMemo(() => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    let superseded = 0;

    documents.forEach((d) => {
      const s = (d.status || "").toUpperCase();
      if (s === "APPROVED") approved++;
      else if (s === "PENDING" || s === "SUBMITTED" || s === "IN REVIEW" || s === "IN_REVIEW") pending++;
      else if (s === "REJECTED") rejected++;
      else if (s === "SUPERSEDED" || s === "OBSOLETE") superseded++;
      else pending++;
    });

    return {
      Pending: pending,
      Approved: approved,
      Rejected: rejected,
      Superseded: superseded,
    };
  }, [documents]);

  const totalDocs = documents.length;

  const donutElements = useMemo(() => {
    if (totalDocs === 0) return null;
    const size = 160;
    const r = 56;
    const sw = 22;
    const cx = size / 2;
    const cy = size / 2;
    const cir = 2 * Math.PI * r;

    const items = [
      { key: "Pending", count: statusCounts.Pending, color: "#f59e0b" },
      { key: "Approved", count: statusCounts.Approved, color: "#16a34a" },
      { key: "Rejected", count: statusCounts.Rejected, color: "#dc2626" },
      { key: "Superseded", count: statusCounts.Superseded, color: "#64748b" },
    ].filter((it) => it.count > 0);

    let cum = 0;
    const circles = items.map((it) => {
      const frac = it.count / totalDocs;
      const dash = frac * cir;
      const gap = cir - dash;
      const offset = -cum;
      cum += dash;
      return (
        <circle
          key={it.key}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={it.color}
          strokeWidth={sw}
          strokeDasharray={`${dash} ${gap}`}
          strokeDashoffset={offset}
        />
      );
    });

    return { size, cx, cy, circles, items };
  }, [totalDocs, statusCounts]);

  const renderStatusBadge = (status: string) => {
    const s = (status || "").toUpperCase();
    switch (s) {
      case "APPROVED":
        return <Badge variant="approved">APPROVED</Badge>;
      case "PENDING":
        return <Badge variant="pending">PENDING</Badge>;
      case "SUBMITTED":
        return <Badge variant="submitted">SUBMITTED</Badge>;
      case "IN REVIEW":
      case "IN_REVIEW":
        return <Badge variant="pending">IN REVIEW</Badge>;
      case "REJECTED":
        return <Badge variant="rejected">REJECTED</Badge>;
      default:
        return <Badge variant="neutral">{status || "DRAFT"}</Badge>;
    }
  };

  const handleExportCSV = () => {
    if (!documents.length) return;
    const headers = [
      "No",
      "Kode Dokumen",
      "Revisi",
      "Judul Dokumen",
      "Proyek",
      "Tipe",
      "Disiplin",
      "Status",
      "Pengunggah",
      "Tanggal",
    ];

    const rows = filteredDocs.map((doc, idx) => [
      idx + 1,
      `"${doc.documentCode || doc.documentNumber}"`,
      doc.revision ?? 0,
      `"${doc.title.replace(/"/g, '""')}"`,
      `"${(doc.projectName || "").replace(/"/g, '""')}"`,
      doc.documentType,
      doc.discipline,
      doc.status,
      `"${(doc.uploaderName || "").replace(/"/g, '""')}"`,
      formatDate(doc.timestamp),
    ]);

    const csv = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Master_Dokumen_QAQC_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-6 space-y-5">
      {/* Top Banner Row matching CMS Screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Daftar Dokumen Mutu
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Semua dokumen proyek yang terdaftar dan riwayat approval.
          </p>
        </div>

        {onAddNew && (
          <button
            onClick={onAddNew}
            className="flex items-center gap-2.5 px-6 py-3 rounded-[8px] bg-[#ed2e35] hover:bg-[#c92026] text-white font-bold text-sm tracking-wide shadow-md shadow-[#ed2e35]/20 transition-all self-start sm:self-auto cursor-pointer"
          >
            <UploadCloud className="w-5 h-5" strokeWidth={2} />
            <span>Unggah Dokumen Baru</span>
          </button>
        )}
      </div>

      {/* Filter Row 1 (Search, Scan, Types, Status, Muat Ulang) */}
      <div className="flex flex-wrap items-center gap-2.5 bg-slate-50/70 p-3 border border-slate-200 rounded-[8px]">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Cari nama file, proyek, atau jud..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4 text-slate-400" strokeWidth={1.8} />}
            className="bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white"
          />
        </div>

        {onOpenQRScanner && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenQRScanner}
            icon={<QrCode className="w-4 h-4 text-slate-500" strokeWidth={1.8} />}
            className="bg-white hover:bg-slate-50 text-slate-700 border-slate-300"
          >
            Scan
          </Button>
        )}

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="h-9 bg-white text-slate-700 border border-slate-300 rounded-[6px] px-3 text-xs focus:outline-none focus:border-[#163d78]"
        >
          <option value="ALL">Semua Jenis</option>
          <option value="ITP">ITP (Inspection & Test Plan)</option>
          <option value="MS">Method Statement (MS)</option>
          <option value="MTR">Material Approval (MTR)</option>
          <option value="NCR">Non-Conformance Report (NCR)</option>
        </select>

        <select
          value={selectedDiscipline}
          onChange={(e) => setSelectedDiscipline(e.target.value)}
          className="h-9 bg-white text-slate-700 border border-slate-300 rounded-[6px] px-3 text-xs focus:outline-none focus:border-[#163d78]"
        >
          <option value="ALL">Semua Disiplin</option>
          <option value="CIVIL">Civil & Architectural</option>
          <option value="MECHANICAL">Mechanical & Piping</option>
          <option value="ELECTRICAL">Electrical & Instrument</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="h-9 bg-white text-slate-700 border border-slate-300 rounded-[6px] px-3 text-xs focus:outline-none focus:border-[#163d78]"
        >
          <option value="ALL">Semua Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="SUPERSEDED">Superseded</option>
        </select>

        <Button
          variant="secondary"
          size="sm"
          onClick={onRefresh}
          isLoading={isLoading}
          icon={<RefreshCw className="w-4 h-4 text-slate-500" strokeWidth={1.8} />}
          className="bg-white hover:bg-slate-50 text-slate-700 border-slate-300"
        >
          Muat Ulang
        </Button>
      </div>

      {/* Filter Row 2 (Ekspor Excel, Laporan Harian, Laporan Mingguan) */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleExportCSV}
          icon={<FileSpreadsheet className="w-4 h-4 text-[#16a34a]" strokeWidth={1.8} />}
          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200"
        >
          Ekspor Excel
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleExportCSV}
          icon={<FileText className="w-4 h-4 text-slate-500" strokeWidth={1.8} />}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
        >
          Laporan Harian
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleExportCSV}
          icon={<FileText className="w-4 h-4 text-slate-500" strokeWidth={1.8} />}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
        >
          Laporan Mingguan
        </Button>
      </div>

      {/* Donut Chart Summary Card (Matching CMS Screenshot) */}
      {donutElements && (
        <Card className="p-5 border-slate-200 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* SVG Donut */}
            <div className="relative flex items-center justify-center flex-shrink-0">
              <svg
                viewBox={`0 0 ${donutElements.size} ${donutElements.size}`}
                width={donutElements.size}
                height={donutElements.size}
                className="transform -rotate-90"
              >
                {donutElements.circles}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                  {totalDocs}
                </span>
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500">
                  DOKUMEN
                </span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-2.5 flex-1 w-full font-mono text-xs">
              {donutElements.items.map((it) => {
                const pct = Math.round((it.count / totalDocs) * 100);
                return (
                  <div key={it.key} className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: it.color }}
                    />
                    <span className="text-slate-700 w-24">{it.key}</span>
                    <span className="font-bold text-slate-900 tabular-nums w-8">
                      {it.count}
                    </span>
                    <span className="text-slate-500 tabular-nums">({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Technical Engineering Document Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">NO</TableHead>
            <TableHead className="w-48">NO DOKUMEN & REV</TableHead>
            <TableHead>JUDUL DOKUMEN & PROYEK</TableHead>
            <TableHead className="w-32">TIPE / DISIPLIN</TableHead>
            <TableHead className="w-28 text-center">TGL SUBMIT</TableHead>
            <TableHead className="w-28 text-center">STATUS</TableHead>
            <TableHead className="w-32">SUBMITTER</TableHead>
            <TableHead className="w-28 text-center">AKSI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDocs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-slate-400 font-mono text-xs">
                {isLoading ? "Mengambil daftar dokumen dari EDMS Master..." : "Tidak ada dokumen yang ditemukan."}
              </TableCell>
            </TableRow>
          ) : (
            filteredDocs.map((doc, idx) => (
              <TableRow key={doc.docId}>
                <TableCell className="text-center font-mono text-slate-400 text-xs">
                  {idx + 1}
                </TableCell>
                <TableCell>
                  <div className="font-mono font-semibold text-[#163d78] text-xs">
                    {doc.documentCode || doc.documentNumber}
                  </div>
                  {onHistoryDoc ? (
                    <button
                      onClick={() => onHistoryDoc(doc)}
                      className="font-mono text-[11px] text-slate-500 hover:text-[#163d78] transition-colors mt-0.5 flex items-center gap-1 group"
                      title="Lihat Riwayat & Rollback Revisi"
                    >
                      <History className="w-3 h-3 text-slate-400 group-hover:text-[#163d78]" />
                      <span>Rev {doc.revision ?? 0}</span>
                    </button>
                  ) : (
                    <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                      Rev {doc.revision ?? 0}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-900 text-xs">{doc.title}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {doc.projectName}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs text-slate-800 font-medium">{doc.documentType}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{doc.discipline}</div>
                </TableCell>
                <TableCell className="text-center font-mono text-xs text-slate-600">
                  {formatDate(doc.timestamp)}
                </TableCell>
                <TableCell className="text-center">
                  {renderStatusBadge(doc.status)}
                </TableCell>
                <TableCell className="text-xs text-slate-700">
                  {doc.uploaderName}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    {onPreviewDoc && doc.fileUrl && (
                      <button
                        onClick={() => onPreviewDoc(doc)}
                        className="p-1.5 rounded-[4px] bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition-colors"
                        title="Pratinjau Dokumen (In-App)"
                      >
                        <FileText className="w-3.5 h-3.5" strokeWidth={1.8} />
                      </button>
                    )}
                    {onViewDetail && (
                      <button
                        onClick={() => onViewDetail(doc)}
                        className="p-1.5 rounded-[4px] bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
                        title="Lihat Detail Dokumen"
                      >
                        <Eye className="w-3.5 h-3.5" strokeWidth={1.8} />
                      </button>
                    )}
                    {doc.fileUrl && (
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-[4px] hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                        title="Buka File di Drive"
                      >
                        <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.8} />
                      </a>
                    )}
                    {doc.status === "PENDING" && onApprove && (
                      <button
                        onClick={() => onApprove(doc.docId)}
                        className="p-1.5 rounded-[4px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 transition-colors"
                        title="Setujui Dokumen"
                      >
                        <Check className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                    )}
                    {doc.status === "PENDING" && onReject && (
                      <button
                        onClick={() => onReject(doc.docId)}
                        className="p-1.5 rounded-[4px] bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 transition-colors"
                        title="Tolak Dokumen"
                      >
                        <X className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
