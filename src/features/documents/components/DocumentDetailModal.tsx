"use client";

import React from "react";
import { X, ExternalLink, Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DocumentItem } from "../types";
import { formatDate } from "@/lib/utils";

interface DocumentDetailModalProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (docId: string) => void;
  onReject?: (docId: string) => void;
}

export function DocumentDetailModal({
  document,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: DocumentDetailModalProps) {
  if (!isOpen || !document) return null;

  const renderBadge = (status: string) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-[6px] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[4px] bg-[#163d78]/30 border border-[#163d78] flex items-center justify-center text-[#38bdf8]">
              <FileText className="w-4 h-4 text-white" strokeWidth={1.8} />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-slate-100 uppercase">
                Detail Dokumen EDMS
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {document.documentNumber} ({document.revision})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-[4px] hover:bg-[#1e293b] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Title & Status */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-[6px] bg-[#1e293b]/40 border border-[#334155]">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Judul Dokumen Mutu
              </span>
              <h4 className="text-sm font-semibold text-slate-100">{document.title}</h4>
              <p className="text-xs text-[#38bdf8] font-mono mt-0.5">{document.projectName}</p>
            </div>
            <div>{renderBadge(document.status)}</div>
          </div>

          {/* Grid Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 rounded-[4px] bg-[#1e293b]/30 border border-[#1e293b]">
              <span className="text-slate-400 text-[10px] uppercase block mb-1">Tipe Dokumen</span>
              <span className="text-slate-200 font-semibold">{document.documentType}</span>
            </div>

            <div className="p-3 rounded-[4px] bg-[#1e293b]/30 border border-[#1e293b]">
              <span className="text-slate-400 text-[10px] uppercase block mb-1">Disiplin</span>
              <span className="text-slate-200 font-semibold">{document.discipline}</span>
            </div>

            <div className="p-3 rounded-[4px] bg-[#1e293b]/30 border border-[#1e293b]">
              <span className="text-slate-400 text-[10px] uppercase block mb-1">Revisi</span>
              <span className="text-slate-200 font-semibold">{document.revision}</span>
            </div>

            <div className="p-3 rounded-[4px] bg-[#1e293b]/30 border border-[#1e293b]">
              <span className="text-slate-400 text-[10px] uppercase block mb-1">Tanggal Submit</span>
              <span className="text-slate-200">{formatDate(document.timestamp)}</span>
            </div>

            <div className="p-3 rounded-[4px] bg-[#1e293b]/30 border border-[#1e293b]">
              <span className="text-slate-400 text-[10px] uppercase block mb-1">Submitter</span>
              <span className="text-slate-200">{document.uploaderName}</span>
            </div>

            <div className="p-3 rounded-[4px] bg-[#1e293b]/30 border border-[#1e293b]">
              <span className="text-slate-400 text-[10px] uppercase block mb-1">Referensi Standar</span>
              <span className="text-slate-200 truncate block">{document.standardRef || "-"}</span>
            </div>
          </div>

          {/* File Attachment */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-300 uppercase tracking-wider block">
              Berkas Lampiran Resmi
            </span>
            {document.fileUrl ? (
              <div className="flex items-center justify-between p-3 rounded-[4px] bg-[#1e293b] border border-[#334155]">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-[#38bdf8] shrink-0" strokeWidth={1.8} />
                  <span className="text-xs font-mono text-slate-200 truncate">
                    {document.fileName || document.documentNumber + ".pdf"}
                  </span>
                </div>
                <a
                  href={document.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#163d78] hover:bg-[#113162] text-white text-xs font-medium transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.8} />
                  <span>Buka di Google Drive</span>
                </a>
              </div>
            ) : (
              <div className="text-xs text-slate-400 font-mono p-3 bg-[#1e293b]/20 border border-[#1e293b] rounded-[4px]">
                Tidak ada URL berkas Drive yang terlampir.
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-[#1e293b] flex items-center justify-between bg-[#0a0f1d]">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Tutup
          </Button>

          <div className="flex items-center gap-2">
            {document.status === "PENDING" && onReject && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  onReject(document.docId);
                  onClose();
                }}
                icon={<X className="w-4 h-4" strokeWidth={1.8} />}
              >
                Tolak Dokumen
              </Button>
            )}

            {document.status === "PENDING" && onApprove && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onApprove(document.docId);
                  onClose();
                }}
                icon={<Check className="w-4 h-4" strokeWidth={1.8} />}
              >
                Setujui Dokumen
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
