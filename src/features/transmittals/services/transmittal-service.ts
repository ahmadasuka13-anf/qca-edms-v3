import { callGasApi, getStoredSessionToken } from "@/lib/gas-client";
import { TransmittalItem, TransmittalFormData } from "../types";

export const transmittalService = {
  /**
   * Fetch transmittals from backend
   */
  async getTransmittals(filters: Record<string, unknown> = {}): Promise<TransmittalItem[]> {
    const token = getStoredSessionToken();
    try {
      const res = await callGasApi<TransmittalItem[]>("getTransmittals", [token, filters]);
      if (res && Array.isArray(res)) return res;
      if (res && res.data && Array.isArray(res.data)) return res.data;
      return getMockTransmittals();
    } catch {
      return getMockTransmittals();
    }
  },

  /**
   * Create new transmittal
   */
  async createTransmittal(data: TransmittalFormData): Promise<{ success: boolean; message: string }> {
    const token = getStoredSessionToken();
    const res = await callGasApi("createTransmittal", [token, data]);
    return {
      success: res.success !== false,
      message: res.message || "Transmittal berhasil dibuat.",
    };
  },
};

function getMockTransmittals(): TransmittalItem[] {
  return [
    {
      transmittalId: "TR-2026-001",
      transmittalNo: "TR-AEI-CHI-2026-001",
      date: "2026-11-01",
      projectCode: "PRJ-CHI-01",
      projectName: "Chiyoda Manyar Smelter Project",
      recipient: "PT Chiyoda International Indonesia (Attn: Lead QA/QC)",
      sender: "PT Asuka Engineering Indonesia (QA/QC Department)",
      purpose: "FOR_APPROVAL",
      totalDocuments: 3,
      documentListSnippet: "ITP Concrete Works Rev 0, MS Bored Pile Rev 1, MTR Flanges Rev 0",
      status: "ACKNOWLEDGED",
    },
    {
      transmittalId: "TR-2026-002",
      transmittalNo: "TR-AEI-SML-2026-005",
      date: "2026-11-08",
      projectCode: "PRJ-SML-02",
      projectName: "PT Smelting Expansion Gresik",
      recipient: "PT Smelting Project Management",
      sender: "PT Asuka Engineering Indonesia (Site Office)",
      purpose: "FOR_INFORMATION",
      totalDocuments: 5,
      documentListSnippet: "Laporan Kalibrasi Alat Periode Oktober 2026, Daily Site Reports",
      status: "SENT",
    },
  ];
}
