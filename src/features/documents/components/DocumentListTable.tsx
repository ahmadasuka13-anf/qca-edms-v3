"use client";

import React, { useState, useMemo } from "react";
import { Search, ExternalLink, Check, X, RefreshCw, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { DocumentItem } from "../types";
import { formatDate } from "@/lib/utils";

interface DocumentListTableProps {
  documents: DocumentItem[];
  isLoading: boolean;
  onRefresh: () => void;
  onAddNew?: () => void;
  onViewDetail?: (doc: DocumentItem) => void;
  onApprove?: (docId: string) => void;
  onReject?: (docId: string) => void;
}

export function DocumentListTable({
  documents,
  isLoading,
  onRefresh,
  onAddNew,
  onViewDetail,
  onApprove,
  onReject,
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
      const matchStatus = selectedStatus === "ALL" || doc.status === selectedStatus;

      return matchSearch && matchType && matchDiscipline && matchStatus;
    });
  }, [documents, searchTerm, selectedType, selectedDiscipline, selectedStatus]);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge variant="approved">APPROVED</Badge>;
      case "PENDING":
        return <Badge variant="pending">PENDING</Badge>;
      case "SUBMITTED":
        return <Badge variant="submitted">SUBMITTED</Badge>;
      case "REJECTED":
        return <Badge variant="rejected">REJECTED</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#0f172a] p-3.5 border border-[#1e293b] rounded-[6px]">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="w-full sm:w-72">
            <Input
              placeholder="Cari nomor dokumen / judul / project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" strokeWidth={1.8} />}
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="h-9 bg-[#1e293b] text-slate-200 border border-[#334155] rounded-[6px] px-3 text-xs focus:outline-none focus:border-[#163d78]"
          >
            <option value="ALL">SEMUA TIPE DOKUMEN</option>
            <option value="ITP">ITP (INSPECTION & TEST PLAN)</option>
            <option value="METHOD_STATEMENT">METHOD STATEMENT</option>
            <option value="MATERIAL_APPROVAL">MATERIAL APPROVAL (MTR)</option>
            <option value="NCR">NON-CONFORMANCE REPORT (NCR)</option>
            <option value="RFI">REQUEST FOR INSPECTION (RFI)</option>
          </select>

          <select
            value={selectedDiscipline}
            onChange={(e) => setSelectedDiscipline(e.target.value)}
            className="h-9 bg-[#1e293b] text-slate-200 border border-[#334155] rounded-[6px] px-3 text-xs focus:outline-none focus:border-[#163d78]"
          >
            <option value="ALL">SEMUA DISIPLIN</option>
            <option value="CIVIL">CIVIL</option>
            <option value="MECHANICAL">MECHANICAL</option>
            <option value="ELECTRICAL">ELECTRICAL</option>
            <option value="INSTRUMENT">INSTRUMENT</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 bg-[#1e293b] text-slate-200 border border-[#334155] rounded-[6px] px-3 text-xs focus:outline-none focus:border-[#163d78]"
          >
            <option value="ALL">SEMUA STATUS</option>
            <option value="APPROVED">APPROVED</option>
            <option value="PENDING">PENDING</option>
            <option value="SUBMITTED">SUBMITTED</option>
            <option value="REJECTED">REJECTED</option>
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
              Unggah Dokumen
            </Button>
          )}
        </div>
      </div>

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
                  <div className="font-mono font-semibold text-[#38bdf8] text-xs">
                    {doc.documentNumber}
                  </div>
                  <div className="font-mono text-[11px] text-slate-400 mt-0.5">
                    {doc.revision}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-100 text-xs">{doc.title}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {doc.projectName}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs text-slate-200 font-medium">{doc.documentType}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{doc.discipline}</div>
                </TableCell>
                <TableCell className="text-center font-mono text-xs text-slate-300">
                  {formatDate(doc.timestamp)}
                </TableCell>
                <TableCell className="text-center">
                  {renderStatusBadge(doc.status)}
                </TableCell>
                <TableCell className="text-xs text-slate-300">
                  {doc.uploaderName}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    {onViewDetail && (
                      <button
                        onClick={() => onViewDetail(doc)}
                        className="p-1.5 rounded-[4px] bg-[#1e293b] hover:bg-[#334155] text-slate-300 hover:text-white border border-[#334155] transition-colors"
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
                        className="p-1.5 rounded-[4px] hover:bg-[#334155] text-slate-300 hover:text-white transition-colors"
                        title="Buka File di Drive"
                      >
                        <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.8} />
                      </a>
                    )}
                    {doc.status === "PENDING" && onApprove && (
                      <button
                        onClick={() => onApprove(doc.docId)}
                        className="p-1.5 rounded-[4px] bg-[#052e16] hover:bg-[#166534] text-[#4ade80] border border-[#166534] transition-colors"
                        title="Setujui Dokumen"
                      >
                        <Check className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                    )}
                    {doc.status === "PENDING" && onReject && (
                      <button
                        onClick={() => onReject(doc.docId)}
                        className="p-1.5 rounded-[4px] bg-[#450a0a] hover:bg-[#991b1b] text-[#f87171] border border-[#991b1b] transition-colors"
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
