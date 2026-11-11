import { callGasApi, getStoredSessionToken } from "@/lib/gas-client";
import { DocumentItem, DocumentFilter, DocumentUploadPayload } from "../types";

export const documentService = {
  /**
   * Fetch documents with optional filtering
   */
  async getDocuments(filters?: DocumentFilter): Promise<DocumentItem[]> {
    const token = getStoredSessionToken();
    try {
      const res = await callGasApi<DocumentItem[]>("getDocumentList", [token, filters || {}]);
      if (res && Array.isArray(res)) {
        return res;
      }
      if (res && res.data && Array.isArray(res.data)) {
        return res.data;
      }
      return getMockDocuments();
    } catch {
      return getMockDocuments();
    }
  },

  /**
   * Submit new document or revision to Google Drive & Master Sheet
   */
  async submitDocument(payload: DocumentUploadPayload): Promise<{ success: boolean; message: string; docId?: string }> {
    const token = getStoredSessionToken();
    const res = await callGasApi<{ docId?: string }>("submitDocument", [token, payload]);
    return {
      success: res.success !== false,
      message: res.message || (res.success !== false ? "Dokumen berhasil diunggah." : "Gagal mengunggah dokumen."),
      docId: (res as { docId?: string }).docId || (res.data as { docId?: string })?.docId,
    };
  },

  /**
   * Get single document full details
   */
  async getDocumentDetail(docId: string): Promise<DocumentItem | null> {
    const token = getStoredSessionToken();
    try {
      const res = await callGasApi<DocumentItem>("getDocumentDetail", [token, docId]);
      if (res && res.success && res.data) {
        return res.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Approve a pending document
   */
  async approveDocument(docId: string, comment?: string): Promise<{ success: boolean; message: string }> {
    const token = getStoredSessionToken();
    const res = await callGasApi("approveDocumentInApp", [token, docId, comment || "Approved by QA/QC Manager"]);
    return {
      success: res.success !== false,
      message: res.message || "Dokumen berhasil disetujui.",
    };
  },

  /**
   * Reject a document with required reason
   */
  async rejectDocument(docId: string, reason: string): Promise<{ success: boolean; message: string }> {
    const token = getStoredSessionToken();
    const res = await callGasApi("rejectDocumentInApp", [token, docId, reason]);
    return {
      success: res.success !== false,
      message: res.message || "Dokumen ditolak.",
    };
  },
};

function getMockDocuments(): DocumentItem[] {
  return [
    {
      docId: "DOC-2026-001",
      documentNumber: "AEI-CHI-ITP-CV-001",
      documentCode: "CHI/ITP/CV/001",
      title: "Inspection and Test Plan for Structural Concrete Works",
      projectCode: "PRJ-CHI-01",
      projectName: "Chiyoda Manyar Smelter Project",
      discipline: "CIVIL",
      documentType: "ITP",
      revision: "Rev 0",
      standardRef: "ASTM C39 / SNI 2847",
      uploaderName: "Ahmad Nur Fatony",
      status: "APPROVED",
      timestamp: "2026-11-01T08:30:00Z",
      fileUrl: "https://drive.google.com",
    },
    {
      docId: "DOC-2026-002",
      documentNumber: "AEI-CHI-MS-CV-004",
      documentCode: "CHI/MS/CV/004",
      title: "Method Statement for Deep Foundation Bored Pile",
      projectCode: "PRJ-CHI-01",
      projectName: "Chiyoda Manyar Smelter Project",
      discipline: "CIVIL",
      documentType: "METHOD_STATEMENT",
      revision: "Rev 1",
      standardRef: "Project Specification Sec. 03300",
      uploaderName: "Bambang Sugeng",
      status: "PENDING",
      timestamp: "2026-11-09T14:15:00Z",
      fileUrl: "https://drive.google.com",
    },
    {
      docId: "DOC-2026-003",
      documentNumber: "AEI-SML-MTR-ME-012",
      documentCode: "SML/MTR/ME/012",
      title: "Material Approval Request for Carbon Steel Flanges ASTM A105",
      projectCode: "PRJ-SML-02",
      projectName: "PT Smelting Expansion Gresik",
      discipline: "MECHANICAL",
      documentType: "MATERIAL_APPROVAL",
      revision: "Rev 0",
      standardRef: "ASME B16.5 / ASTM A105",
      uploaderName: "Dimas Ramadhan",
      status: "SUBMITTED",
      timestamp: "2026-11-10T10:00:00Z",
      fileUrl: "https://drive.google.com",
    },
    {
      docId: "DOC-2026-004",
      documentNumber: "AEI-CHI-NCR-CV-003",
      documentCode: "CHI/NCR/CV/003",
      title: "Non-Conformance Report Honeycomb Concrete at Pier B-12",
      projectCode: "PRJ-CHI-01",
      projectName: "Chiyoda Manyar Smelter Project",
      discipline: "CIVIL",
      documentType: "NCR",
      revision: "Rev 0",
      uploaderName: "Ahmad Nur Fatony",
      status: "REJECTED",
      timestamp: "2026-10-28T09:00:00Z",
      fileUrl: "https://drive.google.com",
    },
  ];
}
