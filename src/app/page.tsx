"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar, NavTab } from "@/components/layout/Sidebar";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { useAuth } from "@/features/auth/hooks/useAuth";

// Documents
import { DocumentListTable } from "@/features/documents/components/DocumentListTable";
import { DocumentUploadForm } from "@/features/documents/components/DocumentUploadForm";
import { DocumentDetailModal } from "@/features/documents/components/DocumentDetailModal";
import { documentService } from "@/features/documents/services/document-service";
import { DocumentItem } from "@/features/documents/types";

// Calibration
import { CalibrationTable } from "@/features/calibration/components/CalibrationTable";
import { CalibrationFormModal } from "@/features/calibration/components/CalibrationFormModal";
import { calibrationService } from "@/features/calibration/services/calibration-service";
import { CalibrationTool, CalibrationSummary, CalibrationFormData } from "@/features/calibration/types";

// NFI Log
import { NFILogTable } from "@/features/nfi/components/NFILogTable";
import { NFIFormModal } from "@/features/nfi/components/NFIFormModal";
import { nfiService } from "@/features/nfi/services/nfi-service";
import { NFIEntry, NFISummary, NFIFormData } from "@/features/nfi/types";

// Site Report
import { SiteReportTable } from "@/features/site-report/components/SiteReportTable";
import { SiteReportFormModal } from "@/features/site-report/components/SiteReportFormModal";
import { siteReportService } from "@/features/site-report/services/site-report-service";
import { SiteReportEntry, SiteReportFormData } from "@/features/site-report/types";

// Transmittals
import { TransmittalTable } from "@/features/transmittals/components/TransmittalTable";
import { transmittalService } from "@/features/transmittals/services/transmittal-service";
import { TransmittalItem } from "@/features/transmittals/types";

// Projects & Analytics
import { ProjectManagement } from "@/features/projects/components/ProjectManagement";
import { projectService } from "@/features/projects/services/project-service";
import { ProjectItem } from "@/features/projects/types";
import { ExecutiveAnalytics } from "@/features/analytics/components/ExecutiveAnalytics";
import { DashboardOverview } from "@/features/dashboard/components/DashboardOverview";
import { CommandCenterView } from "@/features/command-center";

// UI Components
import { Card, CardTitle } from "@/components/ui/Card";
import { Database, Server } from "lucide-react";

export default function HomePage() {
  const { user, isAuthenticated, isLoading: authLoading, logout, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const showToast = useCallback((text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  // Documents State
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isDocLoading, setIsDocLoading] = useState(false);
  const [selectedDocForDetail, setSelectedDocForDetail] = useState<DocumentItem | null>(null);

  // Calibration State
  const [calTools, setCalTools] = useState<CalibrationTool[]>([]);
  const [calSummary, setCalSummary] = useState<CalibrationSummary>({
    totalTools: 0,
    validCount: 0,
    expiringCount: 0,
    expiredCount: 0,
  });
  const [isCalLoading, setIsCalLoading] = useState(false);
  const [isCalModalOpen, setIsCalModalOpen] = useState(false);

  // NFI State
  const [nfiEntries, setNfiEntries] = useState<NFIEntry[]>([]);
  const [nfiSummary, setNfiSummary] = useState<NFISummary>({
    total: 0,
    openCount: 0,
    closedCount: 0,
    failCount: 0,
  });
  const [isNfiLoading, setIsNfiLoading] = useState(false);
  const [isNfiModalOpen, setIsNfiModalOpen] = useState(false);

  // Site Report State
  const [siteReports, setSiteReports] = useState<SiteReportEntry[]>([]);
  const [isSiteReportLoading, setIsSiteReportLoading] = useState(false);
  const [isSiteReportModalOpen, setIsSiteReportModalOpen] = useState(false);

  // Transmittals State
  const [transmittals, setTransmittals] = useState<TransmittalItem[]>([]);
  const [isTransmittalLoading, setIsTransmittalLoading] = useState(false);

  // Projects State
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isProjectLoading, setIsProjectLoading] = useState(false);

  // Loaders
  const loadDocuments = useCallback(async () => {
    setIsDocLoading(true);
    try {
      const docs = await documentService.getDocuments();
      setDocuments(docs);
    } catch {
      showToast("Gagal memuat dokumen", "error");
    } finally {
      setIsDocLoading(false);
    }
  }, [showToast]);

  const loadCalibration = useCallback(async () => {
    setIsCalLoading(true);
    try {
      const tools = await calibrationService.getTools();
      setCalTools(tools);
      setCalSummary(calibrationService.calculateSummary(tools));
    } catch {
      showToast("Gagal memuat data kalibrasi", "error");
    } finally {
      setIsCalLoading(false);
    }
  }, [showToast]);

  const loadNfi = useCallback(async () => {
    setIsNfiLoading(true);
    try {
      const entries = await nfiService.getList();
      setNfiEntries(entries);
      setNfiSummary(nfiService.calculateSummary(entries));
    } catch {
      showToast("Gagal memuat NFI Log", "error");
    } finally {
      setIsNfiLoading(false);
    }
  }, [showToast]);

  const loadSiteReports = useCallback(async () => {
    setIsSiteReportLoading(true);
    try {
      const reps = await siteReportService.getReports();
      setSiteReports(reps);
    } catch {
      showToast("Gagal memuat site report", "error");
    } finally {
      setIsSiteReportLoading(false);
    }
  }, [showToast]);

  const loadTransmittals = useCallback(async () => {
    setIsTransmittalLoading(true);
    try {
      const trs = await transmittalService.getTransmittals();
      setTransmittals(trs);
    } catch {
      showToast("Gagal memuat transmittal", "error");
    } finally {
      setIsTransmittalLoading(false);
    }
  }, [showToast]);

  const loadProjects = useCallback(async () => {
    setIsProjectLoading(true);
    try {
      const prjs = await projectService.getProjects();
      setProjects(prjs);
    } catch {
      showToast("Gagal memuat master proyek", "error");
    } finally {
      setIsProjectLoading(false);
    }
  }, [showToast]);

  // Initial Load on Auth using microtask to avoid cascading renders
  useEffect(() => {
    let active = true;
    if (!isAuthenticated) return;

    const timer = setTimeout(async () => {
      if (!active) return;

      setIsDocLoading(true);
      setIsCalLoading(true);
      setIsNfiLoading(true);
      setIsSiteReportLoading(true);
      setIsTransmittalLoading(true);
      setIsProjectLoading(true);

      const [docs, tools, nfi, reps, trs, prjs] = await Promise.allSettled([
        documentService.getDocuments(),
        calibrationService.getTools(),
        nfiService.getList(),
        siteReportService.getReports(),
        transmittalService.getTransmittals(),
        projectService.getProjects(),
      ]);

      if (!active) return;

      if (docs.status === "fulfilled") setDocuments(docs.value);
      setIsDocLoading(false);

      if (tools.status === "fulfilled") {
        setCalTools(tools.value);
        setCalSummary(calibrationService.calculateSummary(tools.value));
      }
      setIsCalLoading(false);

      if (nfi.status === "fulfilled") {
        setNfiEntries(nfi.value);
        setNfiSummary(nfiService.calculateSummary(nfi.value));
      }
      setIsNfiLoading(false);

      if (reps.status === "fulfilled") setSiteReports(reps.value);
      setIsSiteReportLoading(false);

      if (trs.status === "fulfilled") setTransmittals(trs.value);
      setIsTransmittalLoading(false);

      if (prjs.status === "fulfilled") setProjects(prjs.value);
      setIsProjectLoading(false);
    }, 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [isAuthenticated]);

  // Handlers
  const handleApproveDoc = async (docId: string) => {
    try {
      const res = await documentService.approveDocument(docId);
      showToast(res.message, res.success ? "success" : "error");
      await loadDocuments();
    } catch (e) {
      showToast((e as Error).message, "error");
    }
  };

  const handleRejectDoc = async (docId: string) => {
    const reason = prompt("Masukkan alasan penolakan dokumen:");
    if (!reason) return;
    try {
      const res = await documentService.rejectDocument(docId, reason);
      showToast(res.message, res.success ? "success" : "error");
      await loadDocuments();
    } catch (e) {
      showToast((e as Error).message, "error");
    }
  };

  const handleSaveCalibration = async (data: CalibrationFormData) => {
    const res = await calibrationService.submitCalibration(data);
    if (res.success) {
      showToast(res.message, "success");
      await loadCalibration();
      return true;
    } else {
      showToast(res.message, "error");
      return false;
    }
  };

  const handleSaveNfi = async (data: NFIFormData) => {
    const res = await nfiService.saveEntry(data);
    if (res.success) {
      showToast(res.message, "success");
      await loadNfi();
      return true;
    } else {
      showToast(res.message, "error");
      return false;
    }
  };

  const handleSaveSiteReport = async (data: SiteReportFormData) => {
    const res = await siteReportService.submitReport(data);
    if (res.success) {
      showToast(res.message, "success");
      await loadSiteReports();
      return true;
    } else {
      showToast(res.message, "error");
      return false;
    }
  };

  const handleAddProject = async (p: { code: string; name: string; location: string }) => {
    const res = await projectService.addProject(p);
    if (res.success) {
      showToast(res.message, "success");
      await loadProjects();
      return true;
    } else {
      showToast(res.message, "error");
      return false;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] flex flex-col items-center justify-center text-slate-300 font-mono text-xs">
        <div className="w-8 h-8 border-2 border-[#163d78] border-t-[#38bdf8] rounded-full animate-spin mb-4" />
        <span>MEMUAT SUBSISTEM QCA EDMS...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center p-4">
        <LoginForm onSuccess={refreshUser} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1d] flex flex-col text-slate-100">
      <Navbar user={user} onLogout={logout} />

      {/* Floating Toast */}
      {toastMessage && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-[4px] border text-xs font-mono shadow-2xl transition-all ${
            toastMessage.type === "success"
              ? "bg-[#052e16] text-[#4ade80] border-[#166534]"
              : toastMessage.type === "info"
              ? "bg-[#0b1f3a] text-[#60a5fa] border-[#1e40af]"
              : "bg-[#450a0a] text-[#f87171] border-[#991b1b]"
          }`}
        >
          {toastMessage.text}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="border-b border-[#1e293b] pb-4">
                <h1 className="text-lg font-bold tracking-wide text-slate-100 uppercase">
                  Overview Dashboard Mutu QA/QC
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Monitoring eksekutif dokumen kontrol, kepatuhan kalibrasi & temuan lapangan
                </p>
              </div>
              <DashboardOverview
                documents={documents}
                calibrationSummary={calSummary}
                onNavigateToTab={setActiveTab}
              />
            </div>
          )}

          {/* TAB 1B: QA/QC COMMAND CENTER */}
          {activeTab === "command" && (
            <CommandCenterView
              onSelectProject={(projectCode) => {
                setActiveTab("documents");
                showToast(`Menampilkan dokumen untuk proyek ${projectCode}`, "info");
              }}
              showToast={showToast}
            />
          )}

          {/* TAB 2: DAFTAR DOKUMEN */}
          {activeTab === "documents" && (
            <div className="space-y-6">
              <div className="border-b border-[#1e293b] pb-4">
                <h1 className="text-lg font-bold tracking-wide text-slate-100 uppercase">
                  Daftar Dokumen Kontrol EDMS
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Master register ITP, Method Statement, Material Approval & NCR
                </p>
              </div>
              <DocumentListTable
                documents={documents}
                isLoading={isDocLoading}
                onRefresh={loadDocuments}
                onAddNew={() => setActiveTab("upload")}
                onViewDetail={(doc) => setSelectedDocForDetail(doc)}
                onApprove={handleApproveDoc}
                onReject={handleRejectDoc}
              />
            </div>
          )}

          {/* TAB 3: UNGGAH DOKUMEN */}
          {activeTab === "upload" && (
            <div className="space-y-6">
              <DocumentUploadForm
                onSuccess={() => {
                  showToast("Dokumen berhasil diunggah ke master register.");
                  loadDocuments();
                  setActiveTab("documents");
                }}
                onCancel={() => setActiveTab("documents")}
              />
            </div>
          )}

          {/* TAB 4: TRANSMITTALS */}
          {activeTab === "transmittals" && (
            <div className="space-y-6">
              <div className="border-b border-[#1e293b] pb-4">
                <h1 className="text-lg font-bold tracking-wide text-slate-100 uppercase">
                  Transmittal Dokumen Mutu
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Surat pengantar resmi pengiriman dokumen ke Client & Vendor
                </p>
              </div>
              <TransmittalTable
                transmittals={transmittals}
                isLoading={isTransmittalLoading}
                onRefresh={loadTransmittals}
              />
            </div>
          )}

          {/* TAB 5: KALIBRASI ALAT */}
          {activeTab === "calibration" && (
            <div className="space-y-6">
              <div className="border-b border-[#1e293b] pb-4">
                <h1 className="text-lg font-bold tracking-wide text-slate-100 uppercase">
                  Monitoring Kalibrasi Alat Ukur
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Registrasi alat ukur, masa berlaku sertifikat & status kalibrasi
                </p>
              </div>
              <CalibrationTable
                tools={calTools}
                summary={calSummary}
                isLoading={isCalLoading}
                onRefresh={loadCalibration}
                onAddNew={() => setIsCalModalOpen(true)}
              />
            </div>
          )}

          {/* TAB 6: NFI LOG */}
          {activeTab === "nfilog" && (
            <div className="space-y-6">
              <div className="border-b border-[#1e293b] pb-4">
                <h1 className="text-lg font-bold tracking-wide text-slate-100 uppercase">
                  NFI Log — Notice of Finding & Temuan Mutu
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Pencatatan temuan inspeksi lapangan, non-conformance & tindak lanjut
                </p>
              </div>
              <NFILogTable
                entries={nfiEntries}
                summary={nfiSummary}
                isLoading={isNfiLoading}
                onRefresh={loadNfi}
                onAddNew={() => setIsNfiModalOpen(true)}
              />
            </div>
          )}

          {/* TAB 7: SITE REPORT */}
          {activeTab === "sitereport" && (
            <div className="space-y-6">
              <div className="border-b border-[#1e293b] pb-4">
                <h1 className="text-lg font-bold tracking-wide text-slate-100 uppercase">
                  Laporan Inspeksi Lapangan (Daily Site Report)
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Laporan harian aktivitas pengawasan mutu inspektor QA/QC
                </p>
              </div>
              <SiteReportTable
                reports={siteReports}
                isLoading={isSiteReportLoading}
                onRefresh={loadSiteReports}
                onAddNew={() => setIsSiteReportModalOpen(true)}
              />
            </div>
          )}

          {/* TAB 8: EXECUTIVE ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="border-b border-[#1e293b] pb-4">
                <h1 className="text-lg font-bold tracking-wide text-slate-100 uppercase">
                  Executive Analytics & Quality Compliance
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Analisis aging persetujuan, tingkat kepatuhan ISO 9001 & matriks disiplin
                </p>
              </div>
              <ExecutiveAnalytics
                documents={documents}
                calibrationSummary={calSummary}
                nfiSummary={nfiSummary}
              />
            </div>
          )}

          {/* TAB 9: KELOLA PROYEK */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="border-b border-[#1e293b] pb-4">
                <h1 className="text-lg font-bold tracking-wide text-slate-100 uppercase">
                  Kelola Proyek & Integrasi Folder
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Master proyek PT Asuka Engineering Indonesia terhubung Google Apps Script
                </p>
              </div>
              <ProjectManagement
                projects={projects}
                isLoading={isProjectLoading}
                onRefresh={loadProjects}
                onAddProject={handleAddProject}
              />
            </div>
          )}

          {/* TAB 10: PENGATURAN SISTEM */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="border-b border-[#1e293b] pb-4">
                <h1 className="text-lg font-bold tracking-wide text-slate-100 uppercase">
                  Konfigurasi Sistem & Arsitektur
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Status konektivitas Next.js 16 + TypeScript + Google Apps Script Backend
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-5 border-[#1e293b]">
                  <div className="flex items-center gap-3 mb-3">
                    <Server className="w-5 h-5 text-[#38bdf8]" />
                    <CardTitle>Arsitektur Frontend Baru</CardTitle>
                  </div>
                  <div className="space-y-2 text-xs font-mono text-slate-300">
                    <div>Framework: <span className="text-[#4ade80]">Next.js 16.4.6 (App Router)</span></div>
                    <div>Language: <span className="text-[#4ade80]">TypeScript 5 (Strict Mode)</span></div>
                    <div>Styling: <span className="text-[#4ade80]">Tailwind CSS v4 (Anti-AI Industrial Theme)</span></div>
                    <div>Pattern: <span className="text-[#4ade80]">Feature-Based Architecture (Screaming)</span></div>
                    <div>Ukuran Rata-rata File: <span className="text-[#38bdf8]">100 - 350 LOC per modul</span></div>
                  </div>
                </Card>

                <Card className="p-5 border-[#1e293b]">
                  <div className="flex items-center gap-3 mb-3">
                    <Database className="w-5 h-5 text-[#4ade80]" />
                    <CardTitle>Integrasi Google Apps Script</CardTitle>
                  </div>
                  <div className="space-y-2 text-xs font-mono text-slate-300">
                    <div>Backend Engine: <span className="text-[#4ade80]">kode.gs (Vercel Serverless BFF Proxy)</span></div>
                    <div>Database: <span className="text-[#4ade80]">Google Sheets Multi-Sheet Master</span></div>
                    <div>Storage Berkas: <span className="text-[#4ade80]">Google Drive (Root Folder ID)</span></div>
                    <div>Konektivitas Proxy: <span className="text-[#4ade80]">/api/gas (Bypass CORS 100%)</span></div>
                    <div>Status Keamanan: <span className="text-[#4ade80]">CSRF Protection + Session Token</span></div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <DocumentDetailModal
        document={selectedDocForDetail}
        isOpen={!!selectedDocForDetail}
        onClose={() => setSelectedDocForDetail(null)}
        onApprove={handleApproveDoc}
        onReject={handleRejectDoc}
      />

      <CalibrationFormModal
        isOpen={isCalModalOpen}
        onClose={() => setIsCalModalOpen(false)}
        onSubmit={handleSaveCalibration}
      />

      <NFIFormModal
        isOpen={isNfiModalOpen}
        onClose={() => setIsNfiModalOpen(false)}
        onSubmit={handleSaveNfi}
      />

      <SiteReportFormModal
        isOpen={isSiteReportModalOpen}
        onClose={() => setIsSiteReportModalOpen(false)}
        onSubmit={handleSaveSiteReport}
      />
    </div>
  );
}
