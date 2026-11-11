import { callGasApi, getStoredSessionToken } from "@/lib/gas-client";
import { NFIEntry, NFIFormData, NFISummary } from "../types";

export const nfiService = {
  /**
   * Fetch NFI Log entries from backend
   */
  async getList(filters: Record<string, unknown> = {}): Promise<NFIEntry[]> {
    const token = getStoredSessionToken();
    try {
      const res = await callGasApi<NFIEntry[]>("getNFILogList", [token, filters]);
      if (res && Array.isArray(res)) {
        return res;
      }
      if (res && res.data && Array.isArray(res.data)) {
        return res.data;
      }
      return getMockNfiData();
    } catch {
      return getMockNfiData();
    }
  },

  /**
   * Save or update NFI Log entry
   */
  async saveEntry(data: NFIFormData): Promise<{ success: boolean; message: string }> {
    const token = getStoredSessionToken();
    const res = await callGasApi("saveNFILogEntry", [token, data]);
    return {
      success: res.success !== false,
      message: res.message || (res.success !== false ? "Data NFI berhasil disimpan." : "Gagal menyimpan NFI."),
    };
  },

  /**
   * Calculate summary KPI
   */
  calculateSummary(items: NFIEntry[]): NFISummary {
    let openCount = 0;
    let closedCount = 0;
    let failCount = 0;

    for (const item of items) {
      const statusUpper = String(item.status || "").toUpperCase();
      const resultUpper = String(item.result || "").toUpperCase();

      if (statusUpper === "OPEN" || statusUpper === "PENDING") openCount++;
      if (statusUpper === "CLOSED" || statusUpper === "RESOLVED") closedCount++;
      if (resultUpper === "FAIL" || resultUpper === "RE-INSPECT") failCount++;
    }

    return {
      total: items.length,
      openCount,
      closedCount,
      failCount,
    };
  },
};

function getMockNfiData(): NFIEntry[] {
  return [
    {
      nfiId: "NFI-2026-001",
      no: 1,
      noNfi: "NFI-CHI-CV-2026-01",
      subjectDescription: "Retak susut pada permukaan curing slab lantai 2 unit A-3",
      area: "Area Process Plant 1",
      typeOfInspection: "Visual & Surface Inspection",
      issuedDate: "2026-11-05",
      discipline: "CIVIL",
      location: "Grid D-7 s/d E-8",
      inspectionDate: "2026-11-05",
      result: "FAIL",
      itrNo: "ITR-CV-041",
      itpNo: "ITP-CHI-CV-001",
      status: "OPEN",
      picAei: "Ahmad Nur Fatony",
      remark: "Wajib dilakukan grouting epoxy dan inspeksi ulang",
      projectCode: "PRJ-CHI-01",
      projectName: "Chiyoda Manyar Smelter Project",
    },
    {
      nfiId: "NFI-2026-002",
      no: 2,
      noNfi: "NFI-CHI-ME-2026-04",
      subjectDescription: "Torque pengencangan baut flange pipa cooling water belum mencapai 180 Nm",
      area: "Utility Area B",
      typeOfInspection: "Torque Verification",
      issuedDate: "2026-11-02",
      discipline: "MECHANICAL",
      location: "Pipe Rack Header B",
      inspectionDate: "2026-11-02",
      result: "RE-INSPECT",
      itrNo: "ITR-ME-019",
      itpNo: "ITP-CHI-ME-002",
      status: "OPEN",
      picAei: "Hendra Kurniawan",
      remark: "Re-torque disaksikan inspector Client",
      projectCode: "PRJ-CHI-01",
      projectName: "Chiyoda Manyar Smelter Project",
    },
    {
      nfiId: "NFI-2026-003",
      no: 3,
      noNfi: "NFI-SML-EL-2026-02",
      subjectDescription: "Kerapian grounding cable tray substation dan pengujian resistansi",
      area: "Substation 02",
      typeOfInspection: "Grounding Earth Resistance Test",
      issuedDate: "2026-10-25",
      discipline: "ELECTRICAL",
      location: "Substation Building",
      inspectionDate: "2026-10-26",
      result: "PASS",
      itrNo: "ITR-EL-008",
      itpNo: "ITP-SML-EL-003",
      status: "CLOSED",
      picAei: "Dimas Ramadhan",
      remark: "Nilai resistansi 1.2 Ohm (Lolos syarat < 2 Ohm)",
      projectCode: "PRJ-SML-02",
      projectName: "PT Smelting Expansion Gresik",
    },
  ];
}
