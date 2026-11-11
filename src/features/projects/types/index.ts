export interface ProjectItem {
  rowIndex?: number;
  code: string;
  name: string;
  location: string;
  status: "Active" | "Completed" | "Archived" | string;
  clientName?: string;
  totalDocuments?: number;
}

export interface DisciplineItem {
  code: string;
  name: string;
  description?: string;
}

