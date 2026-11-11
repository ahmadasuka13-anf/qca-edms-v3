export type NFIStatus = "OPEN" | "CLOSED" | "PENDING" | "CANCELLED" | string;
export type NFIResult = "PASS" | "FAIL" | "PENDING" | "RE-INSPECT" | string;

export interface NFIEntry {
  nfiId: string;
  no?: number;
  noNfi: string; // e.g. NFI-CHI-CV-001
  subjectDescription: string;
  area: string;
  typeOfInspection: string;
  issuedDate: string;
  discipline: string;
  location: string;
  inspectionDate: string;
  result: NFIResult;
  itrNo?: string;
  itpNo?: string;
  reportSubmissionDate?: string;
  completeDate?: string;
  status: NFIStatus;
  picAei: string;
  remark?: string;
  attachmentUrl?: string;
  projectCode: string;
  projectName: string;
}

export interface NFISummary {
  total: number;
  openCount: number;
  closedCount: number;
  failCount: number;
}

export interface NFIFormData {
  noNfi?: string;
  subjectDescription: string;
  area: string;
  typeOfInspection: string;
  issuedDate: string;
  discipline: string;
  location: string;
  inspectionDate: string;
  result: NFIResult;
  itrNo?: string;
  itpNo?: string;
  status: NFIStatus;
  picAei: string;
  remark?: string;
  projectCode: string;
  projectName?: string;
}

