"use client";

import React, { useState } from "react";
import {
  X,
  ExternalLink,
  Download,
  Maximize2,
  Minimize2,
  FileText,
  AlertCircle,
} from "lucide-react";
import { DocumentItem } from "../types";
import { Badge } from "@/components/ui/Badge";

interface DocumentPreviewModalProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentPreviewModal({
  document: doc,
  isOpen,
  onClose,
}: DocumentPreviewModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (!isOpen || !doc) return null;

  // Extract Drive ID or construct preview URL
  const extractDriveId = (url?: string): string | null => {
    if (!url) return null;
    const match = url.match(/[-\w]{25,}/);
    return match ? match[0] : null;
  };

  const fileId = extractDriveId(doc.fileUrl);
  const previewUrl = fileId
    ? `https://drive.google.com/file/d/${fileId}/preview`
    : doc.fileUrl;

  const downloadUrl = fileId
    ? `https://drive.google.com/uc?export=download&id=${fileId}`
    : doc.fileUrl;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div
        className={`bg-[#0f172a] border border-[#1e293b] rounded-[6px] flex flex-col shadow-2xl transition-all duration-200 overflow-hidden ${
          isFullscreen
            ? "w-full h-full"
            : "w-full max-w-5xl h-[85vh] max-h-[900px]"
        }`}
      >
        {/* Modal Header */}
        <div className="h-14 bg-[#0a0f1d] border-b border-[#1e293b] px-4 sm:px-6 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="w-5 h-5 text-[#38bdf8] flex-shrink-0" strokeWidth={1.8} />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-slate-100 truncate">
                  {doc.documentCode || doc.documentNumber}
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-[#1e293b] px-1.5 py-0.5 rounded-[2px]">
                  Rev {doc.revision ?? 0}
                </span>
                <Badge
                  variant={
                    (doc.status || "").toUpperCase() === "APPROVED"
                      ? "approved"
                      : (doc.status || "").toUpperCase() === "REJECTED"
                      ? "rejected"
                      : "pending"
                  }
                >
                  {doc.status}
                </Badge>
              </div>
              <div className="text-xs text-slate-400 truncate mt-0.5">
                {doc.title}
              </div>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {downloadUrl && (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="px-2.5 py-1.5 rounded-[4px] bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
                title="Unduh Berkas"
              >
                <Download className="w-3.5 h-3.5" strokeWidth={1.8} />
                <span className="hidden sm:inline">Unduh</span>
              </a>
            )}

            {doc.fileUrl && (
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1.5 rounded-[4px] bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
                title="Buka di Tab Baru"
              >
                <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.8} />
                <span className="hidden sm:inline">Tab Baru</span>
              </a>
            )}

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-[4px] bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-slate-200 transition-colors"
              title={isFullscreen ? "Kecilkan Tampilan" : "Layar Penuh"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" strokeWidth={1.8} />
              ) : (
                <Maximize2 className="w-4 h-4" strokeWidth={1.8} />
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-[4px] hover:bg-[#450a0a] text-slate-400 hover:text-[#f87171] transition-colors"
              title="Tutup (Esc)"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Security / Drive Hint Banner */}
        <div className="bg-[#0b1f3a] border-b border-[#1e40af]/30 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-[#93c5fd]">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-[#38bdf8] flex-shrink-0" strokeWidth={1.8} />
            <span>
              Pratinjau terintegrasi Google Drive. Jika pratinjau terhalang izin akun Google, klik tombol Tab Baru di kanan atas.
            </span>
          </div>
        </div>

        {/* Modal Body / Viewer */}
        <div className="flex-1 bg-[#020617] relative overflow-hidden flex items-center justify-center">
          {previewUrl && !hasError ? (
            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              title={doc.title}
              allow="autoplay"
              onError={() => setHasError(true)}
            />
          ) : (
            <div className="text-center p-8 space-y-3">
              <FileText className="w-12 h-12 text-slate-500 mx-auto" strokeWidth={1.5} />
              <div className="text-sm font-semibold text-slate-300">
                Tidak ada pratinjau langsung untuk berkas ini
              </div>
              <p className="text-xs text-slate-400 max-w-sm font-mono">
                Berkas mungkin memerlukan izin khusus Google Drive atau berformat non-PDF.
              </p>
              {doc.fileUrl && (
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[6px] bg-[#163d78] hover:bg-[#1a4a91] text-xs font-mono font-semibold text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Buka Langsung di Google Drive</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

