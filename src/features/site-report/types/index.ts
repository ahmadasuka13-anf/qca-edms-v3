export interface SiteReportEntry {
  reportId: string;
  reportNumber: string;
  reportDate: string;
  projectCode: string;
  projectName: string;
  discipline: string;
  weather: "Cerah" | "Berawan" | "Hujan Ringan" | "Hujan Lebat" | string;
  inspectorName: string;
  activitySummary: string;
  areaLocation: string;
  manpowerCount?: number;
  equipmentCount?: number;
  safetyIssue?: string;
  qualityIssue?: string;
  photoUrls?: string[];
  status: "DRAFT" | "SUBMITTED" | "VERIFIED" | string;
}

export interface SiteReportFormData {
  reportNumber?: string;
  reportDate: string;
  projectCode: string;
  discipline: string;
  weather: string;
  inspectorName: string;
  activitySummary: string;
  areaLocation: string;
  manpowerCount?: number;
  equipmentCount?: number;
  safetyIssue?: string;
  qualityIssue?: string;
}

