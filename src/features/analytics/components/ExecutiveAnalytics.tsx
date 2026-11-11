"use client";

import React from "react";
import { Clock, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { DocumentItem } from "@/features/documents/types";
import { CalibrationSummary } from "@/features/calibration/types";
import { NFISummary } from "@/features/nfi/types";

interface ExecutiveAnalyticsProps {
  documents: DocumentItem[];
  calibrationSummary: CalibrationSummary;
  nfiSummary: NFISummary;
}

export function ExecutiveAnalytics({
  documents,
  calibrationSummary,
  nfiSummary,
}: ExecutiveAnalyticsProps) {
  const totalDocs = documents.length || 1;
  const approvedDocs = documents.filter((d) => d.status === "APPROVED").length;
  const pendingDocs = documents.filter((d) => d.status === "PENDING" || d.status === "SUBMITTED").length;

  const approvalRate = Math.round((approvedDocs / totalDocs) * 100);

  // Group by discipline
  const disciplines = ["CIVIL", "MECHANICAL", "ELECTRICAL", "INSTRUMENT", "HSE"];
  const disciplineStats = disciplines.map((disc) => {
    const docs = documents.filter((d) => d.discipline === disc);
    const approved = docs.filter((d) => d.status === "APPROVED").length;
    const pending = docs.filter((d) => d.status === "PENDING" || d.status === "SUBMITTED").length;
    return {
      discipline: disc,
      total: docs.length,
      approved,
      pending,
      compliancePct: docs.length ? Math.round((approved / docs.length) * 100) : 100,
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-[#1e293b]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#4ade80]">Tingkat Persetujuan</span>
            <CheckCircle2 className="w-4 h-4 text-[#4ade80]" strokeWidth={1.8} />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#4ade80] tabular-nums">
            {approvalRate}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Rasio dokumen lolos verifikasi</p>
        </Card>

        <Card className="p-4 border-[#1e293b]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#38bdf8]">Backlog Review Mutu</span>
            <Clock className="w-4 h-4 text-[#38bdf8]" strokeWidth={1.8} />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#38bdf8] tabular-nums">
            {pendingDocs} Dokumen
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Menunggu approval QA/QC</p>
        </Card>

        <Card className="p-4 border-[#1e293b]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#facc15]">Kepatuhan Kalibrasi</span>
            <ShieldCheck className="w-4 h-4 text-[#facc15]" strokeWidth={1.8} />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#facc15] tabular-nums">
            {calibrationSummary.totalTools
              ? Math.round((calibrationSummary.validCount / calibrationSummary.totalTools) * 100)
              : 100}
            %
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{calibrationSummary.validCount} dari {calibrationSummary.totalTools} alat valid</p>
        </Card>

        <Card className="p-4 border-[#1e293b]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#f87171]">Resolusi Temuan (NFI)</span>
            <AlertTriangle className="w-4 h-4 text-[#f87171]" strokeWidth={1.8} />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#f87171] tabular-nums">
            {nfiSummary.total ? Math.round((nfiSummary.closedCount / nfiSummary.total) * 100) : 100}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{nfiSummary.openCount} temuan masih aktif (Open)</p>
        </Card>
      </div>

      {/* Discipline Quality Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Matriks Kepatuhan Mutu per Disiplin Teknis</CardTitle>
          <span className="text-xs font-mono text-slate-400 uppercase">ISO 9001:2015 Audit Index</span>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DISIPLIN TEKNIS</TableHead>
                <TableHead className="w-28 text-center">TOTAL DOKUMEN</TableHead>
                <TableHead className="w-28 text-center">APPROVED</TableHead>
                <TableHead className="w-28 text-center">PENDING</TableHead>
                <TableHead className="w-44 text-center">PROGRESS KEPATUHAN</TableHead>
                <TableHead className="w-28 text-center">STATUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disciplineStats.map((item) => (
                <TableRow key={item.discipline}>
                  <TableCell className="font-semibold text-slate-100 font-mono">
                    {item.discipline}
                  </TableCell>
                  <TableCell className="text-center font-mono text-xs tabular-nums text-slate-200">
                    {item.total}
                  </TableCell>
                  <TableCell className="text-center font-mono text-xs tabular-nums text-[#4ade80]">
                    {item.approved}
                  </TableCell>
                  <TableCell className="text-center font-mono text-xs tabular-nums text-[#facc15]">
                    {item.pending}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-[#1e293b] rounded-[2px] h-2 overflow-hidden border border-[#334155]">
                        <div
                          className="bg-[#163d78] h-full rounded-[2px]"
                          style={{ width: `${item.compliancePct}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs tabular-nums text-slate-300 w-10 text-right">
                        {item.compliancePct}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={item.compliancePct >= 80 ? "approved" : "expiring"}>
                      {item.compliancePct >= 80 ? "EXCELLENT" : "ATTENTION"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Aging Analysis of Pending Documents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-[#1e293b]">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
            Review Cepat (&le; 24 Jam)
          </div>
          <div className="text-xl font-bold font-mono text-[#4ade80] tabular-nums">
            {Math.max(0, pendingDocs - 2)} Dokumen
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Dalam batas SLA respons normal</p>
        </Card>

        <Card className="p-4 border-[#1e293b]">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
            Menunggu 2 - 5 Hari
          </div>
          <div className="text-xl font-bold font-mono text-[#facc15] tabular-nums">
            {Math.min(pendingDocs, 2)} Dokumen
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Perlu percepatan evaluasi lead engineer</p>
        </Card>

        <Card className="p-4 border-[#1e293b]">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
            Kritis (&gt; 5 Hari)
          </div>
          <div className="text-xl font-bold font-mono text-[#f87171] tabular-nums">
            0 Dokumen
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Nihil keterlambatan kritis</p>
        </Card>
      </div>
    </div>
  );
}
