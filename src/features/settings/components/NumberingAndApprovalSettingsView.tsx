"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Binary,
  Layers,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  settingsService,
  NumberingRule,
  ApprovalRule,
} from "../services/settings-service";

interface NumberingAndApprovalSettingsViewProps {
  projects?: { code: string; name: string }[];
  showToast: (text: string, type?: "success" | "error" | "info") => void;
}

export function NumberingAndApprovalSettingsView({
  projects = [],
  showToast,
}: NumberingAndApprovalSettingsViewProps) {
  const [subTab, setSubTab] = useState<"numbering" | "approval">("numbering");

  // Numbering State
  const [numRules, setNumRules] = useState<NumberingRule[]>([]);
  const [numProject, setNumProject] = useState("ALL");
  const [numFormat, setNumFormat] = useState("{PROJECT}-{TYPE}-{DISC}-{SEQ}");
  const [numPadding, setNumPadding] = useState(3);
  const [isNumLoading, setIsNumLoading] = useState(false);

  // Approval State
  const [appRules, setAppRules] = useState<ApprovalRule[]>([]);
  const [appProject, setAppProject] = useState("ALL");
  const [appDocType, setAppDocType] = useState("ITP");
  const [appEmail, setAppEmail] = useState("");
  const [appName, setAppName] = useState("");
  const [appRequired, setAppRequired] = useState(true);
  const [isAppLoading, setIsAppLoading] = useState(false);

  // Load Rules
  const loadRules = useCallback(async () => {
    setIsNumLoading(true);
    setIsAppLoading(true);
    try {
      const [nRules, aRules] = await Promise.all([
        settingsService.getNumberingRules(),
        settingsService.getApprovalRules(),
      ]);
      setNumRules(nRules);
      setAppRules(aRules);
    } catch {
      showToast("Gagal memuat aturan pengaturan", "error");
    } finally {
      setIsNumLoading(false);
      setIsAppLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (active) {
        loadRules();
      }
    }, 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [loadRules]);

  // Live Numbering Preview
  const previewNumber = useMemo(() => {
    const pCode = numProject === "ALL" ? "CHI" : numProject.replace("AEI-", "");
    const seq = "1".padStart(numPadding, "0");
    const now = new Date();
    const yyyy = now.getFullYear().toString();
    const mm = String(now.getMonth() + 1).padStart(2, "0");

    let res = numFormat;
    res = res.replace(/\{PROJECT\}/g, pCode);
    res = res.replace(/\{TYPE\}/g, "ITP");
    res = res.replace(/\{DISC\}/g, "CV");
    res = res.replace(/\{SEQ\}/g, seq);
    res = res.replace(/\{YYYY\}/g, yyyy);
    res = res.replace(/\{MM\}/g, mm);
    return res;
  }, [numFormat, numProject, numPadding]);

  // Handle Save Numbering Rule
  const handleSaveNumbering = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numFormat.trim()) {
      showToast("Format penomoran tidak boleh kosong", "error");
      return;
    }

    const prj = projects.find((p) => p.code === numProject);
    const res = await settingsService.saveNumberingRule({
      projectCode: numProject,
      projectName: numProject === "ALL" ? "Semua Proyek" : prj?.name || numProject,
      format: numFormat.trim(),
      seqPadding: numPadding,
    });

    if (res.success) {
      showToast(res.message, "success");
      loadRules();
    } else {
      showToast(res.message, "error");
    }
  };

  // Handle Delete Numbering Rule
  const handleDeleteNumbering = async (projectCode: string) => {
    if (!confirm(`Hapus aturan penomoran untuk ${projectCode}?`)) return;
    const res = await settingsService.deleteNumberingRule(projectCode);
    showToast(res.message, res.success ? "success" : "error");
    loadRules();
  };

  // Handle Save Approval Rule
  const handleSaveApproval = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appEmail || !appName) {
      showToast("Nama dan email approver wajib diisi", "error");
      return;
    }

    const prj = projects.find((p) => p.code === appProject);
    const res = await settingsService.saveApprovalRule({
      projectCode: appProject,
      projectName: appProject === "ALL" ? "Semua Proyek" : prj?.name || appProject,
      documentType: appDocType,
      approverEmail: appEmail.trim(),
      approverName: appName.trim(),
      requireApproval: appRequired,
    });

    if (res.success) {
      showToast(res.message, "success");
      setAppEmail("");
      setAppName("");
      loadRules();
    } else {
      showToast(res.message, "error");
    }
  };

  // Handle Delete Approval Rule
  const handleDeleteApproval = async (projectCode: string, docType: string) => {
    if (!confirm(`Hapus aturan approval ${docType} untuk ${projectCode}?`)) return;
    const res = await settingsService.deleteApprovalRule(projectCode, docType);
    showToast(res.message, res.success ? "success" : "error");
    loadRules();
  };

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1e293b] pb-3">
        <button
          onClick={() => setSubTab("numbering")}
          className={`px-3 py-1.5 rounded-[4px] text-xs font-mono font-medium flex items-center gap-2 transition-colors ${
            subTab === "numbering"
              ? "bg-[#163d78] text-white"
              : "bg-[#0f172a] text-slate-400 hover:text-slate-200 border border-[#1e293b]"
          }`}
        >
          <Binary className="w-3.5 h-3.5" />
          <span>Aturan Penomoran Dokumen</span>
        </button>

        <button
          onClick={() => setSubTab("approval")}
          className={`px-3 py-1.5 rounded-[4px] text-xs font-mono font-medium flex items-center gap-2 transition-colors ${
            subTab === "approval"
              ? "bg-[#163d78] text-white"
              : "bg-[#0f172a] text-slate-400 hover:text-slate-200 border border-[#1e293b]"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Matriks Alur Approval Mutu</span>
        </button>
      </div>

      {/* SUBTAB 1: NUMBERING RULES */}
      {subTab === "numbering" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add / Edit Form */}
          <Card className="p-5 border-[#1e293b]">
            <CardHeader className="px-0 pt-0 pb-3">
              <CardTitle className="text-xs uppercase font-mono tracking-wider text-slate-200">
                Atur Format Penomoran
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleSaveNumbering} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Proyek Target
                </label>
                <select
                  value={numProject}
                  onChange={(e) => setNumProject(e.target.value)}
                  className="w-full bg-[#0a0f1d] border border-[#1e293b] rounded-[6px] px-3 py-2 text-xs font-mono text-slate-200 outline-none focus:border-[#163d78]"
                >
                  <option value="ALL">ALL — Semua Proyek (Default Sistem)</option>
                  {projects.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.code} — {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Pola Format Kode Dokumen
                </label>
                <input
                  type="text"
                  value={numFormat}
                  onChange={(e) => setNumFormat(e.target.value)}
                  placeholder="{PROJECT}-{TYPE}-{DISC}-{SEQ}"
                  className="w-full bg-[#0a0f1d] border border-[#1e293b] rounded-[6px] px-3 py-2 text-xs font-mono text-slate-200 outline-none focus:border-[#163d78]"
                />
                <div className="mt-1.5 p-2 rounded-[4px] bg-[#0a0f1d] border border-[#1e293b] text-[10px] font-mono text-slate-400 space-y-1">
                  <div className="flex items-center gap-1 text-[#38bdf8]">
                    <HelpCircle className="w-3 h-3" />
                    <span>Tag Placeholder yang Tersedia:</span>
                  </div>
                  <div>
                    <code className="text-[#4ade80]">{`{PROJECT}`}</code>: Kode proyek • <code className="text-[#4ade80]">{`{TYPE}`}</code>: Tipe dokumen (ITP, MS, MTR)
                  </div>
                  <div>
                    <code className="text-[#4ade80]">{`{DISC}`}</code>: Disiplin (CV, ME, EL) • <code className="text-[#4ade80]">{`{SEQ}`}</code>: Nomor urut
                  </div>
                  <div>
                    <code className="text-[#4ade80]">{`{YYYY}`}</code>: Tahun 4 digit • <code className="text-[#4ade80]">{`{MM}`}</code>: Bulan 2 digit
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Digit Padding Nomor Urut (Sequence)
                </label>
                <select
                  value={numPadding}
                  onChange={(e) => setNumPadding(parseInt(e.target.value, 10))}
                  className="w-full bg-[#0a0f1d] border border-[#1e293b] rounded-[6px] px-3 py-2 text-xs font-mono text-slate-200 outline-none focus:border-[#163d78]"
                >
                  <option value={2}>2 Digit (Contoh: 01, 02...)</option>
                  <option value={3}>3 Digit (Contoh: 001, 002... - Standar)</option>
                  <option value={4}>4 Digit (Contoh: 0001, 0002...)</option>
                </select>
              </div>

              {/* Dynamic Live Preview */}
              <div className="p-3 rounded-[6px] bg-[#163d78]/20 border border-[#163d78]/50 space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#38bdf8] font-bold">
                  Pratinjau Hasil Penomoran:
                </span>
                <div className="font-mono text-sm font-bold text-white tracking-wider break-all">
                  {previewNumber}
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="w-full text-xs font-mono gap-1.5 bg-[#163d78] hover:bg-[#1a4a91]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Simpan Aturan Format</span>
              </Button>
            </form>
          </Card>

          {/* List of Registered Numbering Rules */}
          <div className="lg:col-span-2">
            <Card className="border-[#1e293b]">
              <CardHeader>
                <CardTitle>Daftar Aturan Penomoran Aktif</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#0a0f1d] border-b border-[#1e293b] font-mono text-slate-400 uppercase text-[10.5px]">
                        <th className="py-2.5 px-3">Proyek</th>
                        <th className="py-2.5 px-3">Format Pola</th>
                        <th className="py-2.5 px-3 text-center">Padding</th>
                        <th className="py-2.5 px-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e293b] font-mono">
                      {isNumLoading ? (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-slate-400">
                            Memuat aturan penomoran...
                          </td>
                        </tr>
                      ) : numRules.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-slate-400">
                            Belum ada format kustom terdaftar. Menggunakan default sistem.
                          </td>
                        </tr>
                      ) : (
                        numRules.map((rule) => (
                          <tr key={rule.projectCode} className="hover:bg-[#1e293b]/40">
                            <td className="py-3 px-3">
                              <div className="font-semibold text-slate-100">
                                {rule.projectCode}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {rule.projectName}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-[#38bdf8] font-semibold">
                              {rule.format}
                            </td>
                            <td className="py-3 px-3 text-center text-slate-300">
                              {rule.seqPadding} digit
                            </td>
                            <td className="py-3 px-3 text-right">
                              {rule.projectCode !== "ALL" && (
                                <button
                                  onClick={() => handleDeleteNumbering(rule.projectCode)}
                                  className="p-1.5 rounded-[4px] hover:bg-[#450a0a] text-slate-400 hover:text-[#f87171] transition-colors"
                                  title="Hapus Format"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* SUBTAB 2: APPROVAL MATRIX */}
      {subTab === "approval" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add / Edit Form */}
          <Card className="p-5 border-[#1e293b]">
            <CardHeader className="px-0 pt-0 pb-3">
              <CardTitle className="text-xs uppercase font-mono tracking-wider text-slate-200">
                Tambah Jalur Verifikator
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleSaveApproval} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Proyek
                </label>
                <select
                  value={appProject}
                  onChange={(e) => setAppProject(e.target.value)}
                  className="w-full bg-[#0a0f1d] border border-[#1e293b] rounded-[6px] px-3 py-2 text-xs font-mono text-slate-200 outline-none focus:border-[#163d78]"
                >
                  <option value="ALL">ALL — Semua Proyek</option>
                  {projects.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.code} — {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Tipe Dokumen Mutu
                </label>
                <select
                  value={appDocType}
                  onChange={(e) => setAppDocType(e.target.value)}
                  className="w-full bg-[#0a0f1d] border border-[#1e293b] rounded-[6px] px-3 py-2 text-xs font-mono text-slate-200 outline-none focus:border-[#163d78]"
                >
                  <option value="ITP">ITP — Inspection & Test Plan</option>
                  <option value="MS">MS — Method Statement</option>
                  <option value="MTR">MTR — Material Approval / Test</option>
                  <option value="NCR">NCR — Non-Conformance Report</option>
                  <option value="CAL">CAL — Sertifikat Kalibrasi</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Nama Personel Approver
                </label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="Bambang Soedjarwo"
                  className="w-full bg-[#0a0f1d] border border-[#1e293b] rounded-[6px] px-3 py-2 text-xs font-mono text-slate-200 outline-none focus:border-[#163d78]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Email Akun Approver
                </label>
                <input
                  type="email"
                  value={appEmail}
                  onChange={(e) => setAppEmail(e.target.value)}
                  placeholder="bambang.qc@asuka.co.id"
                  className="w-full bg-[#0a0f1d] border border-[#1e293b] rounded-[6px] px-3 py-2 text-xs font-mono text-slate-200 outline-none focus:border-[#163d78]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="reqApp"
                  checked={appRequired}
                  onChange={(e) => setAppRequired(e.target.checked)}
                  className="rounded border-[#1e293b] bg-[#0a0f1d] text-[#163d78]"
                />
                <label htmlFor="reqApp" className="text-xs font-mono text-slate-300">
                  Wajib Persetujuan Manual (Review Gate)
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="w-full text-xs font-mono gap-1.5 bg-[#163d78] hover:bg-[#1a4a91]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Simpan Matriks Approval</span>
              </Button>
            </form>
          </Card>

          {/* List of Registered Approval Rules */}
          <div className="lg:col-span-2">
            <Card className="border-[#1e293b]">
              <CardHeader>
                <CardTitle>Matriks Approval Aktif per Dokumen</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#0a0f1d] border-b border-[#1e293b] font-mono text-slate-400 uppercase text-[10.5px]">
                        <th className="py-2.5 px-3">Proyek & Dokumen</th>
                        <th className="py-2.5 px-3">Approver Utama</th>
                        <th className="py-2.5 px-3 text-center">Status Alur</th>
                        <th className="py-2.5 px-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e293b] font-mono">
                      {isAppLoading ? (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-slate-400">
                            Memuat matriks alur approval...
                          </td>
                        </tr>
                      ) : appRules.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-slate-400">
                            Belum ada jalur approval terdaftar.
                          </td>
                        </tr>
                      ) : (
                        appRules.map((rule, idx) => (
                          <tr key={idx} className="hover:bg-[#1e293b]/40">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-100">
                                  {rule.projectCode}
                                </span>
                                <Badge variant="neutral">{rule.documentType}</Badge>
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                {rule.projectName}
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-semibold text-slate-200">
                                {rule.approverName}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {rule.approverEmail}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-center">
                              {rule.requireApproval ? (
                                <span className="inline-flex items-center gap-1 text-[10.5px] text-[#4ade80] bg-[#052e16] border border-[#166534] px-2 py-0.5 rounded-[3px]">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Approval Wajib</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10.5px] text-slate-400 bg-[#1e293b] px-2 py-0.5 rounded-[3px]">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>Auto-Pass</span>
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => handleDeleteApproval(rule.projectCode, rule.documentType)}
                                className="p-1.5 rounded-[4px] hover:bg-[#450a0a] text-slate-400 hover:text-[#f87171] transition-colors"
                                title="Hapus Aturan"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

