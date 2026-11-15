"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  History,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Clock,
  User,
  MessageSquare,
} from "lucide-react";
import { DocumentItem } from "../types";
import { documentService } from "../services/document-service";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

interface RevisionHistoryModalProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRollbackSuccess?: () => void;
}

export function RevisionHistoryModal({
  document: doc,
  isOpen,
  onClose,
  onRollbackSuccess,
}: RevisionHistoryModalProps) {
  const [revisions, setRevisions] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !doc) return;

    let active = true;
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const res = await documentService.getRevisionHistory(doc.docId);
        if (active) {
          if (res.success && res.revisions.length > 0) {
            setRevisions(res.revisions);
          } else {
            // Fallback: show current doc if no other revisions exist
            setRevisions([doc]);
          }
        }
      } catch {
        if (active) setRevisions([doc]);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchHistory();
    return () => {
      active = false;
    };
  }, [isOpen, doc]);

  if (!isOpen || !doc) return null;

  const handleRollback = async (targetDocId: string, revNum: string | number) => {
    if (
      !confirm(
        `Konfirmasi: Jadikan Revisi ${revNum} sebagai revisi aktif dokumen ini?`
      )
    ) {
      return;
    }

    setActionInProgress(targetDocId);
    try {
      const res = await documentService.rollbackToRevision(targetDocId);
      alert(res.message);
      if (res.success && onRollbackSuccess) {
        onRollbackSuccess();
        onClose();
      }
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-[6px] w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="h-14 bg-[#0a0f1d] border-b border-[#1e293b] px-4 sm:px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-[#38bdf8]" strokeWidth={1.8} />
            <div>
              <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <span>Riwayat Revisi Dokumen</span>
                <span className="font-mono text-xs text-[#38bdf8]">
                  {doc.documentCode || doc.documentNumber}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                {doc.projectName} • {doc.discipline}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[4px] hover:bg-[#450a0a] text-slate-400 hover:text-[#f87171] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content / Timeline */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="text-xs text-slate-300 font-mono">
            {doc.title}
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs font-mono text-slate-400">
              <div className="w-6 h-6 border-2 border-[#163d78] border-t-[#38bdf8] rounded-full animate-spin mx-auto mb-2" />
              Memuat silsilah revisi dari Google Sheets...
            </div>
          ) : revisions.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-slate-400">
              Belum ada riwayat revisi tambahan. Dokumen ini adalah revisi awal.
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1e293b]">
              {revisions.map((rev, idx) => {
                const isCurrent = rev.docId === doc.docId || idx === 0;
                const s = (rev.status || "").toUpperCase();

                return (
                  <div key={rev.docId} className="relative space-y-2">
                    {/* Timeline Node Dot */}
                    <div
                      className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isCurrent
                          ? "bg-[#163d78] border-[#38bdf8]"
                          : "bg-[#0f172a] border-[#334155]"
                      }`}
                    >
                      {isCurrent && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
                      )}
                    </div>

                    {/* Revision Card */}
                    <div
                      className={`p-3.5 rounded-[6px] border transition-colors ${
                        isCurrent
                          ? "bg-[#1e293b]/70 border-[#38bdf8]/40"
                          : "bg-[#0a0f1d] border-[#1e293b]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-100">
                            Rev {rev.revision ?? 0}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-mono uppercase bg-[#163d78] text-[#38bdf8] px-1.5 py-0.5 rounded-[2px] font-semibold">
                              Aktif Sekarang
                            </span>
                          )}
                          <Badge
                            variant={
                              s === "APPROVED"
                                ? "approved"
                                : s === "REJECTED"
                                ? "rejected"
                                : s === "SUPERSEDED"
                                ? "neutral"
                                : "pending"
                            }
                          >
                            {rev.status || "DRAFT"}
                          </Badge>
                        </div>

                        {rev.fileUrl && (
                          <a
                            href={rev.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-mono text-[#38bdf8] hover:underline flex items-center gap-1"
                          >
                            <span>Berkas</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      <div className="text-xs text-slate-200 mt-2 font-medium">
                        {rev.title}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#1e293b] text-[11px] font-mono text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          <span>Pengunggah: {rev.uploaderName || "-"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>Diunggah: {formatDate(rev.timestamp)}</span>
                        </div>
                      </div>

                      {/* Approver Information */}
                      {rev.approverName && (
                        <div className="mt-2 text-[11px] font-mono text-[#4ade80] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>
                            Disetujui oleh {rev.approverName}{" "}
                            {rev.approvalDate ? `pada ${formatDate(rev.approvalDate)}` : ""}
                          </span>
                        </div>
                      )}

                      {/* Comments */}
                      {rev.description && (
                        <div className="mt-2 text-[11px] font-mono text-slate-400 bg-[#0a0f1d] p-2 rounded-[4px] border border-[#1e293b] flex items-start gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                          <span>{rev.description}</span>
                        </div>
                      )}

                      {/* Rollback Action Button */}
                      {!isCurrent && s !== "DELETED" && (
                        <div className="mt-3 pt-2 border-t border-[#1e293b] flex justify-end">
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={actionInProgress === rev.docId}
                            onClick={() => handleRollback(rev.docId, rev.revision ?? 0)}
                            className="text-xs font-mono gap-1 text-[#38bdf8] border-[#38bdf8]/30 hover:bg-[#38bdf8]/10"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>
                              {actionInProgress === rev.docId
                                ? "Memproses..."
                                : "Jadikan Revisi Aktif"}
                            </span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="h-12 bg-[#0a0f1d] border-t border-[#1e293b] px-4 sm:px-6 flex items-center justify-between flex-shrink-0 text-[11px] font-mono text-slate-400">
          <span>Total Revisi: {revisions.length} versi</span>
          <Button variant="secondary" size="sm" onClick={onClose} className="text-xs font-mono">
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}

