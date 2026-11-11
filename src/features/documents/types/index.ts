export type DocumentStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUBMITTED" | "ARCHIVED" | "DELETED" | string;

export interface DocumentFilePayload {
  fileName: string;
  mimeType: string;
  base64Data: string;
  sizeBytes?: number;
}

export interface DocumentUploadPayload {
  projectCode: string;
  projectName?: string;
  discipline: string;
  documentType: string;
  title: string;
  documentNumber?: string;
  revision: string;
  standardRef?: string;
  confidentiality?: "Internal" | "Restricted" | "Public";
  keywords?: string;
  description?: string;
  files: DocumentFilePayload[];
}

export interface DocumentItem {
  docId: string;
  documentNumber: string;
  documentCode?: string;
  title: string;
  projectCode: string;
  projectName: string;
  discipline: string;
  documentType: string;
  revision: string;
  standardRef?: string;
  fileName?: string;
  fileUrl?: string;
  additionalFileUrls?: string[];
  uploaderName: string;
  uploaderEmail?: string;
  status: DocumentStatus;
  lifecycleStage?: string;
  confidentiality?: string;
  keywords?: string;
  description?: string;
  referenceNumber?: string;
  timestamp: string;
}

export interface DocumentFilter {
  projectCode?: string;
  documentType?: string;
  discipline?: string;
  status?: string;
  search?: string;
  onlyLatest?: boolean;
}

export interface RevisionHistoryItem {
  revision: string;
  docId: string;
  documentCode: string;
  title: string;
  timestamp: string;
  status: string;
  uploaderName: string;
  fileUrl?: string;
}
