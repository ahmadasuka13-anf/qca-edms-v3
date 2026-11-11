export interface ExecutiveTotals {
  total: number;
  open: number;
  closed: number;
  canceled: number;
  other: number;
  totalNFI: number;
  totalITR: number;
  totalMRIR: number;
  itrEmpty: number;
  itrByDiscipline: Record<string, number>;
  projects: number;
  projectsActive: number;
  projectsInactive: number;
  projectsAll: number;
  projectsCritical: number;
}

export interface ExecutiveProject {
  code: string;
  name: string;
  id?: string;
  tabName?: string;
  pic?: string;
  status: string;
  total: number;
  open: number;
  closed: number;
  canceled?: number;
  other?: number;
  totalNFI?: number;
  totalITR?: number;
  totalMRIR?: number;
  itrByDiscipline?: Record<string, number>;
  itrEmpty?: number;
  byType?: Record<string, number>;
  byDiscipline?: Record<string, number>;
  disciplines?: string[];
  types?: string[];
  oldestOpenDays?: number;
  health: "red" | "yellow" | "green";
  lastSync?: string;
}

export interface ExecutiveDashboardResponse {
  success: boolean;
  message?: string;
  totals?: ExecutiveTotals;
  projects?: ExecutiveProject[];
  disciplines?: string[];
  lastUpdate?: string;
}

export type CCSortOrder =
  | "critical_first"
  | "progress_asc"
  | "total_desc"
  | "code_asc";

