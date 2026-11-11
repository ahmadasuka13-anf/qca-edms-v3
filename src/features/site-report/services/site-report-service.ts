import { callGasApi, getStoredSessionToken } from "@/lib/gas-client";
import { SiteReportEntry, SiteReportFormData } from "../types";

export const siteReportService = {
  /**
   * Fetch daily site reports from backend
   */
  async getReports(filters: Record<string, unknown> = {}): Promise<SiteReportEntry[]> {
    const token = getStoredSessionToken();
    try {
      const res = await callGasApi<SiteReportEntry[]>("getSiteReportEntries", [token, filters]);
      if (res && Array.isArray(res)) return res;
      if (res && res.data && Array.isArray(res.data)) return res.data;
      return getMockSiteReports();
    } catch {
      return getMockSiteReports();
    }
  },

  /**
   * Submit daily site report entry
   */
  async submitReport(data: SiteReportFormData): Promise<{ success: boolean; message: string }> {
    const token = getStoredSessionToken();
    const res = await callGasApi("submitSiteReportEntry", [token, data]);
    return {
      success: res.success !== false,
      message: res.message || (res.success !== false ? "Laporan inspeksi berhasil disimpan." : "Gagal menyimpan laporan."),
    };
  },
};

function getMockSiteReports(): SiteReportEntry[] {
  return [
    {
      reportId: "SR-2026-001",
      reportNumber: "SR-CHI-CV-20261108",
      reportDate: "2026-11-08",
      projectCode: "PRJ-CHI-01",
      projectName: "Chiyoda Manyar Smelter Project",
      discipline: "CIVIL",
      weather: "Cerah",
      inspectorName: "Ahmad Nur Fatony",
      activitySummary: "Inspeksi slump test dan pengambilan silinder beton fc 35 MPa pada pengecoran pile cap Area B-2.",
      areaLocation: "Area Process Plant 1 Grid B-2",
      manpowerCount: 24,
      equipmentCount: 3,
      qualityIssue: "Slump test sesuai standar 12 ± 2 cm (hasil rata-rata: 11.5 cm)",
      status: "VERIFIED",
    },
    {
      reportId: "SR-2026-002",
      reportNumber: "SR-CHI-ME-20261109",
      reportDate: "2026-11-09",
      projectCode: "PRJ-CHI-01",
      projectName: "Chiyoda Manyar Smelter Project",
      discipline: "MECHANICAL",
      weather: "Berawan",
      inspectorName: "Hendra Kurniawan",
      activitySummary: "Pengecekan alignment pompa slurry dan leveling baseplate menggunakan dial gauge.",
      areaLocation: "Pump House Unit 4",
      manpowerCount: 8,
      equipmentCount: 2,
      qualityIssue: "Alignment offset 0.03mm (Memenuhi toleransi < 0.05mm)",
      status: "SUBMITTED",
    },
  ];
}
