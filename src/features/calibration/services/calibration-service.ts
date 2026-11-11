import { callGasApi } from "@/lib/gas-client";
import { CalibrationTool, CalibrationSummary, CalibrationFormData, CalibrationStatus } from "../types";

export const calibrationService = {
  /**
   * Fetch all calibration tools and parse sheet data
   */
  async getTools(): Promise<CalibrationTool[]> {
    try {
      const res = await callGasApi<unknown[][] | CalibrationTool[]>("getCalibrationTools");
      if (!res.success || !res.data) {
        return getMockCalibrationData();
      }

      // If sheet returns 2D array of rows
      if (Array.isArray(res.data)) {
        const rows = res.data;
        if (rows.length <= 1) return [];

        const headers = (rows[0] as unknown[]).map((h) => String(h).trim().toLowerCase());
        const idIdx = headers.findIndex((h) => h.includes("id") || h.includes("kode"));
        const nameIdx = headers.findIndex((h) => h.includes("nama") || h.includes("tool"));
        const discIdx = headers.findIndex((h) => h.includes("disiplin") || h.includes("disc"));
        const calIdx = headers.findIndex((h) => h.includes("tgl kalibrasi") || h.includes("last"));
        const nextIdx = headers.findIndex((h) => h.includes("tgl berikut") || h.includes("next"));
        const statusIdx = headers.findIndex((h) => h.includes("status"));
        const certIdx = headers.findIndex((h) => h.includes("sertifikat") || h.includes("cert"));
        const vendorIdx = headers.findIndex((h) => h.includes("vendor") || h.includes("lab"));
        const picIdx = headers.findIndex((h) => h.includes("pic"));

        return rows.slice(1).map((rawRow, index: number) => {
          const row = rawRow as unknown[];
          const toolId = idIdx >= 0 ? String(row[idIdx] || "") : `TL-${index + 1}`;
          const name = nameIdx >= 0 ? String(row[nameIdx] || "") : "Unknown Tool";
          const disc = discIdx >= 0 ? String(row[discIdx] || "CIVIL") : "CIVIL";
          const cal = calIdx >= 0 ? String(row[calIdx] || "") : "";
          const next = nextIdx >= 0 ? String(row[nextIdx] || "") : "";
          const rawStatus = statusIdx >= 0 ? String(row[statusIdx] || "").toUpperCase() : "";

          let status: CalibrationStatus = "VALID";
          if (rawStatus.includes("EXPIRED") || rawStatus.includes("KADALUARSA")) {
            status = "EXPIRED";
          } else if (rawStatus.includes("EXPIRING") || rawStatus.includes("SEGERA")) {
            status = "EXPIRING_SOON";
          } else if (rawStatus.includes("VALID") || rawStatus.includes("OK")) {
            status = "VALID";
          }

          return {
            id: toolId,
            name: name,
            discipline: disc,
            lastCalDate: cal,
            nextCalDate: next,
            status: status,
            certificateNo: certIdx >= 0 ? String(row[certIdx] || "") : undefined,
            vendor: vendorIdx >= 0 ? String(row[vendorIdx] || "") : undefined,
            pic: picIdx >= 0 ? String(row[picIdx] || "") : undefined,
          };
        });
      }

      return [];
    } catch {
      return getMockCalibrationData();
    }
  },

  /**
   * Calculate summary KPI
   */
  calculateSummary(tools: CalibrationTool[]): CalibrationSummary {
    let validCount = 0;
    let expiringCount = 0;
    let expiredCount = 0;

    for (const tool of tools) {
      if (tool.status === "VALID" || tool.status === "CALIBRATED") validCount++;
      else if (tool.status === "EXPIRING_SOON") expiringCount++;
      else if (tool.status === "EXPIRED") expiredCount++;
    }

    return {
      totalTools: tools.length,
      validCount,
      expiringCount,
      expiredCount,
    };
  },

  /**
   * Submit new or updated calibration record
   */
  async submitCalibration(data: CalibrationFormData): Promise<{ success: boolean; message: string }> {
    const res = await callGasApi("submitCalibration", [data]);
    return {
      success: res.success,
      message: res.message || (res.success ? "Data kalibrasi berhasil disimpan." : "Gagal menyimpan data."),
    };
  },
};

function getMockCalibrationData(): CalibrationTool[] {
  return [
    {
      id: "TL-CV-001",
      name: "Total Station TS06 Plus",
      discipline: "CIVIL",
      serialNumber: "SN-982104-TS",
      brand: "Leica",
      lastCalDate: "2026-03-15",
      nextCalDate: "2027-03-15",
      status: "VALID",
      certificateNo: "CAL-2026-LEICA-091",
      vendor: "PT Kalibrasi Presisi Utama",
      pic: "Ahmad Nur Fatony",
    },
    {
      id: "TL-CV-002",
      name: "Automatic Level NA730",
      discipline: "CIVIL",
      serialNumber: "SN-33921-LV",
      brand: "Leica",
      lastCalDate: "2026-01-10",
      nextCalDate: "2026-11-20",
      status: "EXPIRING_SOON",
      certificateNo: "CAL-2026-LV-112",
      vendor: "PT Asuka Lab Gresik",
      pic: "Bambang Sugeng",
    },
    {
      id: "TL-EL-005",
      name: "Insulation Tester 1000V",
      discipline: "ELECTRICAL",
      serialNumber: "KY-50119-X",
      brand: "Kyoritsu",
      lastCalDate: "2025-10-01",
      nextCalDate: "2026-10-01",
      status: "EXPIRED",
      certificateNo: "CAL-2025-KY-882",
      vendor: "PT Multi Kalibrasi",
      pic: "Dimas R.",
    },
    {
      id: "TL-ME-012",
      name: "Torque Wrench 200Nm",
      discipline: "MECHANICAL",
      serialNumber: "TO-44012",
      brand: "Tohnichi",
      lastCalDate: "2026-05-18",
      nextCalDate: "2027-05-18",
      status: "VALID",
      certificateNo: "CAL-2026-TW-004",
      vendor: "PT Kalibrasi Sentosa",
      pic: "Hendra K.",
    },
  ];
}
