export type CalibrationStatus = "VALID" | "EXPIRING_SOON" | "EXPIRED" | "CALIBRATED" | "UNKNOWN";

export interface CalibrationTool {
  id: string; // Tool ID (e.g. TL-CV-001)
  name: string; // e.g. Total Station Leica TS06
  discipline: "CIVIL" | "MECHANICAL" | "ELECTRICAL" | "INSTRUMENT" | "SAFETY" | string;
  serialNumber?: string;
  brand?: string;
  model?: string;
  lastCalDate: string; // YYYY-MM-DD
  nextCalDate: string; // YYYY-MM-DD
  status: CalibrationStatus;
  certificateNo?: string;
  vendor?: string;
  pic?: string;
  certificateUrl?: string;
}

export interface CalibrationSummary {
  totalTools: number;
  validCount: number;
  expiringCount: number;
  expiredCount: number;
}

export interface CalibrationFormData {
  toolId: string;
  toolName: string;
  discipline: string;
  serialNumber?: string;
  calDate: string;
  nextCalDate: string;
  vendor?: string;
  certNo?: string;
  pic?: string;
}

