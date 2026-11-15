"use client";

import React, { useState } from "react";
import {
  Archive,
  Trash2,
  RotateCcw,
  Search,
} from "lucide-react";
import { DocumentItem } from "@/features/documents/types";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface ArchiveRecycleBinViewProps {
  documents: DocumentItem[];
  onRestore?: (docId: string) => void;
}

export function ArchiveRecycleBinView({
  documents,
  onRestore,
}: ArchiveRecycleBinViewProps) {
  const [activeTab, setActiveTab] = useState<"archive" | "trash">("archive");
  const [searchQuery, setSearchQuery] = useState("");

  const mockArchivedDocs: DocumentItem[] = [
    {
      docId: "ARC-001",
      documentCode: "AEI-CHI-ITP-CV-001",
      documentNumber: "ITP-CV-001",
      revision: "0",
      title: "Inspection and Test Plan for Bored Pile Foundation (Superseded)",
      projectName: "Chiyoda Manyar Smelter Project",
      projectCode: "AEI-CHI",
      discipline: "CIVIL",
      documentType: "ITP",
      status: "SUPERSEDED",
      timestamp: "2026-08-14T08:30:00Z",
      uploaderName: "Ahmad Nur Fatony",
      uploaderEmail: "ahmadasuka13@gmail.com",
    },
    {
      docId: "ARC-002",
      documentCode: "AEI-SML-MTR-ME-009",
      documentNumber: "MTR-ME-009",
      revision: "0",
      title: "Material Approval Request for Carbon Steel Flanges ASTM A105 (Obsolete)",
      projectName: "PT Smelting Expansion Gresik",
      projectCode: "AEI-SML",
      discipline: "MECHANICAL",
      documentType: "MTR",
      status: "OBSOLETE",
      timestamp: "2026-09-02T10:15:00Z",
      uploaderName: "Bambang Soedjarwo",
      uploaderEmail: "bambang.qc@asuka.co.id",
    },
  ];

  const mockTrashDocs: DocumentItem[] = [
    {
      docId: "TRASH-001",
      documentCode: "AEI-CHI-DRAFT-099",
      documentNumber: "DRAFT-099",
      revision: "0",
      title: "Draf Awal Method Statement Deep Foundation (Dibatalkan)",
      projectName: "Chiyoda Manyar Smelter Project",
      projectCode: "AEI-CHI",
      discipline: "CIVIL",
      documentType: "MS",
      status: "DELETED",
      timestamp: "2026-10-25T11:00:00Z",
      uploaderName: "Ahmad Nur Fatony",
      uploaderEmail: "ahmadasuka13@gmail.com",
    },
  ];

  const realArchived = documents.filter((d) => {
    const s = (d.status || "").toUpperCase();
    return s === "SUPERSEDED" || s === "OBSOLETE" || s === "ARCHIVED";
  });
  const realTrash = documents.filter((d) => {
    const s = (d.status || "").toUpperCase();
    return s === "DELETED" || s === "TRASH";
  });

  const sourceDocs =
    activeTab === "archive"
      ? realArchived.length > 0
        ? realArchived
        : mockArchivedDocs
      : realTrash.length > 0
      ? realTrash
      : mockTrashDocs;

  const displayedDocs = sourceDocs.filter(
    (d) =>
      (d.documentCode && d.documentCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.projectName && d.projectName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#1e293b] pb-4">
        <h1 className="text-lg font-bold tracking-wide text-slate-100 uppercase">
          Arsip & Tempat Sampah (Recycle Bin)
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Manajemen dokumen mutu superseded, masa retensi ISO 9001:2015 & pemulihan dokumen yang terhapus
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1e293b] pb-2">
        <button
          onClick={() => setActiveTab("archive")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-[4px] text-xs font-mono font-medium transition-colors ${
            activeTab === "archive"
              ? "bg-[#163d78] text-white"
              : "text-slate-400 hover:text-slate-200 hover:bg-[#1e293b]"
          }`}
        >
          <Archive className="w-3.5 h-3.5" />
          <span>Arsip Dokumen ({mockArchivedDocs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("trash")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-[4px] text-xs font-mono font-medium transition-colors ${
            activeTab === "trash"
              ? "bg-[#ed2e35] text-white"
              : "text-slate-400 hover:text-slate-200 hover:bg-[#1e293b]"
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Tempat Sampah ({mockTrashDocs.length})</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-[6px] p-3 flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Cari di ${activeTab === "archive" ? "arsip" : "tempat sampah"}...`}
            className="w-full bg-[#0a0f1d] border border-[#1e293b] rounded-[6px] pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-[#163d78]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-[6px] overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#0a0f1d] border-b border-[#1e293b] text-slate-400 font-mono uppercase text-[10.5px]">
              <th className="py-2.5 px-3">Kode Dokumen</th>
              <th className="py-2.5 px-3">Judul Dokumen</th>
              <th className="py-2.5 px-3">Proyek & Disiplin</th>
              <th className="py-2.5 px-3 text-center">Status Retensi</th>
              <th className="py-2.5 px-3">Tanggal Pengarsipan</th>
              <th className="py-2.5 px-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]">
            {displayedDocs.map((doc) => (
              <tr key={doc.docId} className="hover:bg-[#1e293b]/40 transition-colors">
                <td className="py-3 px-3 font-mono font-semibold text-slate-300">
                  {doc.documentCode}
                  <span className="text-[10px] text-slate-400 ml-1.5">Rev {doc.revision}</span>
                </td>
                <td className="py-3 px-3 text-slate-200 max-w-xs">{doc.title}</td>
                <td className="py-3 px-3 font-mono text-slate-400">
                  {doc.projectName} • {doc.discipline}
                </td>
                <td className="py-3 px-3 text-center">
                  <Badge variant={activeTab === "archive" ? "neutral" : "rejected"}>
                    {doc.status}
                  </Badge>
                </td>
                <td className="py-3 px-3 font-mono text-slate-400 tabular-nums">
                  {formatDate(doc.timestamp)}
                </td>
                <td className="py-3 px-3 text-center">
                  <button
                    onClick={() => onRestore && onRestore(doc.docId)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] bg-[#16a34a]/20 hover:bg-[#16a34a]/30 border border-[#16a34a]/40 text-[#4ade80] text-xs font-mono font-semibold transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Pulihkan</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

