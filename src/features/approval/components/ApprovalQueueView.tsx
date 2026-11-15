"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
  Clock,
  AlertTriangle,
  Search,
} from "lucide-react";
import { DocumentItem } from "@/features/documents/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

interface ApprovalQueueViewProps {
  documents: DocumentItem[];
  onApprove: (docId: string, comments: string) => Promise<void>;
  onReject: (docId: string, comments: string) => Promise<void>;
  onRefresh: () => void;
  isLoading?: boolean;
}

export function ApprovalQueueView({
  documents,
  onApprove,
  onReject,
  onRefresh,
  isLoading,
}: ApprovalQueueViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter pending documents
  const pendingDocs = documents.filter((doc) => {
    const s = (doc.status || "").toUpperCase();
    const isPending = s === "PENDING" || s === "SUBMITTED" || s === "IN REVIEW" || s === "IN_REVIEW";
    if (!isPending) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (doc.documentCode && doc.documentCode.toLowerCase().includes(q)) ||
      (doc.documentNumber && doc.documentNumber.toLowerCase().includes(q)) ||
      doc.title.toLowerCase().includes(q) ||
      (doc.projectName && doc.projectName.toLowerCase().includes(q)) ||
      (doc.uploaderName && doc.uploaderName.toLowerCase().includes(q))
    );
  });

  const handleOpenActionModal = (doc: DocumentItem, type: "approve" | "reject") => {
    setSelectedDoc(doc);
    setActionType(type);
    setComment(
      type === "approve"
        ? "Dokumen telah diperiksa dan disetujui sesuai kriteria penerimaan ITP."
        : ""
    );
  };

  const handleConfirmAction = async () => {
    if (!selectedDoc || !actionType) return;
    setIsSubmitting(true);
    try {
      if (actionType === "approve") {
        await onApprove(selectedDoc.docId, comment);
      } else {
        await onReject(selectedDoc.docId, comment || "Ditolak - Mohon perbaiki dan unggah revisi.");
      }
      setSelectedDoc(null);
      setActionType(null);
      setComment("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Deck */}
      <div className="border-b border-[#1e293b] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold tracking-wide text-slate-100 uppercase">
            Approval & Antrean Tugas Mutu
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Verifikasi bertingkat dokumen kontrol, ITP, Method Statement & MTR sebelum rilis ke lapangan
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="text-xs font-mono self-start sm:self-auto"
        >
          <span>Refresh Data</span>
        </Button>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-[#0f172a] border border-[#1e293b]">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-[#38bdf8]">
            <span>Menunggu Verifikasi</span>
            <Clock className="w-4 h-4 text-[#38bdf8]" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100 mt-2 tabular-nums">
            {pendingDocs.length}
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">Dokumen perlu tindakan review</div>
        </Card>

        <Card className="p-4 bg-[#0f172a] border border-[#1e293b]">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-[#4ade80]">
            <span>Total Disetujui</span>
            <CheckCircle2 className="w-4 h-4 text-[#4ade80]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#4ade80] mt-2 tabular-nums">
            {documents.filter((d) => (d.status || "").toUpperCase() === "APPROVED").length}
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">Status valid / rilis resmi</div>
        </Card>

        <Card className="p-4 bg-[#0f172a] border border-[#1e293b]">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-[#facc15]">
            <span>Kepatuhan SLA QA/QC</span>
            <AlertTriangle className="w-4 h-4 text-[#facc15]" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100 mt-2 tabular-nums">
            100%
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">Target evaluasi &lt; 48 jam</div>
        </Card>
      </div>

      {/* Search Toolbar */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-[6px] p-3 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari dokumen dalam antrean approval..."
            className="w-full bg-[#0a0f1d] border border-[#1e293b] rounded-[6px] pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-[#163d78]"
          />
        </div>
        <span className="text-xs font-mono text-slate-400 tabular-nums">
          Ditemukan: <strong className="text-slate-200">{pendingDocs.length}</strong> dokumen
        </span>
      </div>

      {/* Task List Table */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-[6px] overflow-hidden">
        {pendingDocs.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="w-8 h-8 text-[#4ade80] mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-200">Seluruh Dokumen Telah Diperiksa</h4>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Tidak ada antrean dokumen yang memerlukan persetujuan saat ini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0a0f1d] border-b border-[#1e293b] text-slate-400 font-mono uppercase text-[10.5px]">
                  <th className="py-2.5 px-3">Kode Dokumen</th>
                  <th className="py-2.5 px-3">Judul & Proyek</th>
                  <th className="py-2.5 px-3">Tipe / Disiplin</th>
                  <th className="py-2.5 px-3">Diajukan Oleh</th>
                  <th className="py-2.5 px-3">Tanggal Unggah</th>
                  <th className="py-2.5 px-3 text-center">Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]">
                {pendingDocs.map((doc) => (
                  <tr key={doc.docId} className="hover:bg-[#1e293b]/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-[#38bdf8]">
                        {doc.documentCode || doc.documentNumber}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        Rev {doc.revision ?? 0}
                      </div>
                    </td>

                    <td className="py-3 px-3 max-w-xs">
                      <div className="font-semibold text-slate-100 line-clamp-1">{doc.title}</div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {doc.projectName}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-mono text-slate-200 font-medium">
                        {doc.documentType}
                      </span>
                      <div className="text-[10px] font-mono text-slate-400">
                        {doc.discipline}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="text-slate-200 font-medium">{doc.uploaderName || "—"}</div>
                      <div className="text-[10px] font-mono text-slate-400 truncate max-w-[140px]">
                        {doc.uploaderEmail}
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-300 tabular-nums">
                      {formatDate(doc.timestamp)}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center justify-center gap-1.5">
                        {doc.fileUrl && (
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-[4px] bg-[#1e293b] hover:bg-[#334155] text-slate-300 hover:text-white border border-[#334155] transition-colors"
                            title="Buka Berkas di Drive"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <button
                          onClick={() => handleOpenActionModal(doc, "approve")}
                          className="px-2.5 py-1 rounded-[4px] bg-[#16a34a]/20 hover:bg-[#16a34a]/30 border border-[#16a34a]/40 text-[#4ade80] text-xs font-mono font-semibold flex items-center gap-1 transition-colors"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Setujui</span>
                        </button>

                        <button
                          onClick={() => handleOpenActionModal(doc, "reject")}
                          className="px-2.5 py-1 rounded-[4px] bg-[#ed2e35]/20 hover:bg-[#ed2e35]/30 border border-[#ed2e35]/40 text-[#f87171] text-xs font-mono font-semibold flex items-center gap-1 transition-colors"
                        >
                          <XCircle className="w-3 h-3" />
                          <span>Tolak</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation & Comment Modal */}
      {selectedDoc && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#0f172a] border border-[#1e293b] rounded-[8px] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
              <div className="flex items-center gap-2">
                {actionType === "approve" ? (
                  <CheckCircle2 className="w-5 h-5 text-[#4ade80]" />
                ) : (
                  <XCircle className="w-5 h-5 text-[#f87171]" />
                )}
                <h3 className="text-sm font-bold font-mono text-slate-100 uppercase">
                  {actionType === "approve" ? "Setujui Dokumen Mutu" : "Tolak / Minta Revisi"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedDoc(null);
                  setActionType(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <div className="text-slate-400 font-mono">Kode Dokumen:</div>
              <div className="font-mono font-bold text-slate-100">
                {selectedDoc.documentCode || selectedDoc.documentNumber} Rev {selectedDoc.revision ?? 0}
              </div>
              <div className="text-slate-300 font-medium mt-1">{selectedDoc.title}</div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">
                {actionType === "approve" ? "Catatan Verifikasi (Opsional):" : "Alasan Penolakan / Poin Revisi (Wajib):"}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                required={actionType === "reject"}
                placeholder={
                  actionType === "approve"
                    ? "Masukkan catatan verifikasi..."
                    : "Jelaskan pasal atau kriteria yang belum sesuai..."
                }
                className="w-full bg-[#0a0f1d] border border-[#1e293b] rounded-[6px] p-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-[#163d78]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1e293b]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedDoc(null);
                  setActionType(null);
                }}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                variant={actionType === "approve" ? "primary" : "danger"}
                size="sm"
                onClick={handleConfirmAction}
                disabled={isSubmitting || (actionType === "reject" && !comment.trim())}
                className={
                  actionType === "approve"
                    ? "bg-[#16a34a] hover:bg-[#15803d]"
                    : "bg-[#ed2e35] hover:bg-[#cf2228]"
                }
              >
                {isSubmitting
                  ? "Menyimpan..."
                  : actionType === "approve"
                  ? "Konfirmasi Setujui"
                  : "Konfirmasi Tolak"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

