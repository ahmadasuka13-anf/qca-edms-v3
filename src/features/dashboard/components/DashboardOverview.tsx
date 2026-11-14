"use client";

import React from "react";
import { FileText, CheckCircle2, Clock, Layers, Ruler } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DocumentItem } from "@/features/documents/types";
import { CalibrationSummary } from "@/features/calibration/types";
import { formatDate } from "@/lib/utils";

import { NavTab } from "@/components/layout/Sidebar";

interface DashboardOverviewProps {
  documents: DocumentItem[];
  calibrationSummary: CalibrationSummary;
  onNavigateToTab: (tab: NavTab) => void;
}

export function DashboardOverview({
  documents,
  calibrationSummary,
  onNavigateToTab,
}: DashboardOverviewProps) {
  const approvedDocs = documents.filter((d) => (d.status || "").toUpperCase() === "APPROVED").length;
  const pendingDocs = documents.filter((d) =>
    ["PENDING", "SUBMITTED", "IN REVIEW", "IN_REVIEW"].includes((d.status || "").toUpperCase())
  ).length;
  const rejectedDocs = documents.filter((d) => (d.status || "").toUpperCase() === "REJECTED").length;

  return (
    <div className="space-y-6">
      {/* Executive QA/QC Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-[#1e293b] cursor-pointer hover:border-[#334155] transition-colors" onClick={() => onNavigateToTab("documents")}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Total Dokumen EDMS</span>
            <FileText className="w-4 h-4 text-slate-400" strokeWidth={1.8} />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-100 tabular-nums">
            {documents.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">ITP, MS, MTR & Laporan</p>
        </Card>

        <Card className="p-4 border-[#1e293b] cursor-pointer hover:border-[#334155] transition-colors" onClick={() => onNavigateToTab("documents")}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#38bdf8]">Menunggu Approval</span>
            <Clock className="w-4 h-4 text-[#38bdf8]" strokeWidth={1.8} />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#38bdf8] tabular-nums">
            {pendingDocs}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Perlu review QA/QC Manager</p>
        </Card>

        <Card className="p-4 border-[#1e293b] cursor-pointer hover:border-[#334155] transition-colors" onClick={() => onNavigateToTab("documents")}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#4ade80]">Dokumen Disetujui</span>
            <CheckCircle2 className="w-4 h-4 text-[#4ade80]" strokeWidth={1.8} />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#4ade80] tabular-nums">
            {approvedDocs}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {rejectedDocs ? `${rejectedDocs} Ditolak | ` : ""}Status Approved / Valid
          </p>
        </Card>

        <Card className="p-4 border-[#1e293b] cursor-pointer hover:border-[#334155] transition-colors" onClick={() => onNavigateToTab("calibration")}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#facc15]">Alat Perlu Kalibrasi</span>
            <Ruler className="w-4 h-4 text-[#facc15]" strokeWidth={1.8} />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#facc15] tabular-nums">
            {calibrationSummary.expiringCount + calibrationSummary.expiredCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{calibrationSummary.expiredCount} expired, {calibrationSummary.expiringCount} expiring</p>
        </Card>
      </div>

      {/* Two Column Layout: Recent Documents & QA/QC Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Submissions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Dokumen QA/QC Terbaru</CardTitle>
              <button
                onClick={() => onNavigateToTab("documents")}
                className="text-xs font-mono text-[#38bdf8] hover:underline uppercase"
              >
                Lihat Semua &rarr;
              </button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[#1e293b]">
                {documents.slice(0, 5).map((doc) => (
                  <div key={doc.docId} className="p-4 flex items-center justify-between hover:bg-[#1e293b]/40 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-[#38bdf8]">
                          {doc.documentCode || doc.documentNumber}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-[#1e293b] px-1.5 py-0.5 rounded-[2px]">
                          Rev {doc.revision ?? 0}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-slate-100">{doc.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {doc.projectName} • {doc.discipline}
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <div>
                        {(() => {
                          const s = (doc.status || "").toUpperCase();
                          if (s === "APPROVED") return <Badge variant="approved">APPROVED</Badge>;
                          if (s === "PENDING" || s === "SUBMITTED" || s === "IN REVIEW")
                            return <Badge variant="pending">PENDING</Badge>;
                          if (s === "REJECTED") return <Badge variant="rejected">REJECTED</Badge>;
                          return <Badge variant="neutral">{doc.status || "DRAFT"}</Badge>;
                        })()}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {formatDate(doc.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QA/QC Operational Status */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Status Disiplin Proyek</CardTitle>
              <Layers className="w-4 h-4 text-slate-400" strokeWidth={1.8} />
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Civil & Architectural", docs: 18, status: "Normal" },
                { name: "Mechanical & Piping", docs: 12, status: "Normal" },
                { name: "Electrical & Instrument", docs: 9, status: "Attention" },
                { name: "Health, Safety & Env", docs: 5, status: "Normal" },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between p-2.5 rounded-[4px] bg-[#1e293b]/50 border border-[#334155]">
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{item.docs} Dokumen Aktif</div>
                  </div>
                  <Badge variant={item.status === "Normal" ? "approved" : "expiring"}>
                    {item.status}
                  </Badge>
                </div>
              ))}

              <div className="pt-2 border-t border-[#1e293b]">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Aturan Standar Mutu
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Semua ITP, MTR, dan Kalibrasi diverifikasi bertingkat sesuai ISO 9001:2015 & Project Quality Plan (PQP).
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
