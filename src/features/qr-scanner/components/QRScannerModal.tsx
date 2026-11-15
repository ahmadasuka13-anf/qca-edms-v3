"use client";

import React, { useState } from "react";
import {
  QrCode,
  X,
  Search,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { DocumentItem } from "@/features/documents/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: DocumentItem[];
  onOpenDocument?: (doc: DocumentItem) => void;
}

export function QRScannerModal({
  isOpen,
  onClose,
  documents,
  onOpenDocument,
}: QRScannerModalProps) {
  const [inputCode, setInputCode] = useState("");
  const [searchedDoc, setSearchedDoc] = useState<DocumentItem | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (codeToVerify?: string) => {
    const code = (codeToVerify || inputCode).trim().toLowerCase();
    if (!code) return;

    setHasSearched(true);
    const found = documents.find((d) => {
      const docCode = (d.documentCode || "").toLowerCase();
      const docNum = (d.documentNumber || "").toLowerCase();
      const docId = (d.docId || "").toLowerCase();
      return (
        docCode === code ||
        docNum === code ||
        docId === code ||
        docCode.includes(code)
      );
    });

    setSearchedDoc(found || null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0f172a] border border-[#1e293b] rounded-[8px] p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[4px] bg-[#163d78]/40 border border-[#163d78] flex items-center justify-center text-[#38bdf8]">
              <QrCode className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider">
                Verifikasi Dokumen & Pemindai QR
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Pemeriksaan keaslian dan status rilis resmi dokumen PT Asuka Engineering Indonesia
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-[4px] text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Technical Camera Viewfinder Placeholder */}
        <div className="relative aspect-video w-full rounded-[6px] bg-[#070b14] border border-[#1e293b] flex flex-col items-center justify-center overflow-hidden p-4 text-center">
          {/* Corner Guides */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#38bdf8]" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#38bdf8]" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#38bdf8]" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#38bdf8]" />

          <QrCode className="w-12 h-12 text-[#38bdf8]/60 mb-2" strokeWidth={1.5} />
          <div className="text-xs font-mono font-bold text-slate-200">
            Bidik QR Code Fisik Dokumen
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1 max-w-xs">
            Arahkan kamera ke QR Code pada lembar pengesahan ITP/MTR, atau masukkan kode di bawah
          </div>
        </div>

        {/* Manual Input Code Box */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono text-slate-300">
            Nomor Dokumen / Kode Verifikasi QR:
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                placeholder="Contoh: AEI-CHI-ITP-CV-001 atau 1"
                className="w-full bg-[#0a0f1d] border border-[#1e293b] rounded-[6px] pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-[#163d78]"
              />
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleVerify()}
              className="font-mono text-xs px-3 bg-[#163d78] hover:bg-[#1a4a91]"
            >
              Verifikasi
            </Button>
          </div>
        </div>

        {/* Verification Result */}
        {hasSearched && (
          <div className="pt-2 border-t border-[#1e293b]">
            {searchedDoc ? (
              <div className="p-3.5 rounded-[6px] bg-[#052e16]/30 border border-[#16a34a]/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#4ade80] text-xs font-mono font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>DOKUMEN TERVERIFIKASI ASLI</span>
                  </div>
                  <Badge variant="approved">VALID</Badge>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="font-mono font-bold text-slate-100">
                    {searchedDoc.documentCode || searchedDoc.documentNumber} Rev {searchedDoc.revision ?? 0}
                  </div>
                  <div className="font-semibold text-slate-200">{searchedDoc.title}</div>
                  <div className="text-[11px] font-mono text-slate-400">
                    {searchedDoc.projectName} • {searchedDoc.discipline}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Diajukan: {formatDate(searchedDoc.timestamp)}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#16a34a]/20">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[#4ade80]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>ISO 9001:2015 Compliant</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {onOpenDocument && (
                      <button
                        onClick={() => onOpenDocument(searchedDoc)}
                        className="text-xs font-mono text-[#4ade80] hover:underline"
                      >
                        Detail EDMS
                      </button>
                    )}
                    {searchedDoc.fileUrl && (
                      <a
                        href={searchedDoc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono text-[#38bdf8] hover:underline flex items-center gap-1"
                      >
                        <span>Buka File Drive</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-[6px] bg-[#450a0a]/30 border border-[#ed2e35]/40 text-center space-y-1">
                <div className="text-xs font-mono font-bold text-[#f87171]">
                  KODE DOKUMEN TIDAK DITEMUKAN
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  Periksa kembali penulisan nomor atau hubungi Document Controller QA/QC.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

