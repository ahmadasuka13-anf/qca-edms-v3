export interface TransmittalItem {
  transmittalId: string;
  transmittalNo: string;
  date: string;
  projectCode: string;
  projectName: string;
  recipient: string;
  sender: string;
  purpose: "FOR_APPROVAL" | "FOR_INFORMATION" | "FOR_CONSTRUCTION" | string;
  totalDocuments: number;
  documentListSnippet?: string;
  status: "SENT" | "ACKNOWLEDGED" | "REVISED" | string;
}

export interface TransmittalFormData {
  transmittalNo?: string;
  date: string;
  projectCode: string;
  recipient: string;
  sender: string;
  purpose: string;
  documentIds: string[];
}

