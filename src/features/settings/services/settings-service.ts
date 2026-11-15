import { callGasApi, getStoredSessionToken } from "@/lib/gas-client";

export interface NumberingRule {
  projectCode: string;
  projectName?: string;
  format: string;
  seqPadding: number;
}

export interface ApprovalRule {
  projectCode: string;
  projectName?: string;
  documentType: string;
  approverEmail: string;
  approverName: string;
  requireApproval: boolean;
}

export const settingsService = {
  /**
   * Get numbering rules
   */
  async getNumberingRules(): Promise<NumberingRule[]> {
    const token = getStoredSessionToken();
    try {
      const res = await callGasApi<NumberingRule[]>("getNumberingRules", [token]);
      if (res && Array.isArray(res)) return res;
      if (res && res.data && Array.isArray(res.data)) return res.data;
      return getMockNumberingRules();
    } catch {
      return getMockNumberingRules();
    }
  },

  /**
   * Save numbering rule
   */
  async saveNumberingRule(rule: NumberingRule): Promise<{ success: boolean; message: string }> {
    const token = getStoredSessionToken();
    const res = await callGasApi("saveNumberingRule", [token, rule]);
    return {
      success: res.success !== false,
      message: res.message || (res.success !== false ? "Aturan penomoran berhasil disimpan." : "Gagal menyimpan."),
    };
  },

  /**
   * Delete numbering rule
   */
  async deleteNumberingRule(projectCode: string): Promise<{ success: boolean; message: string }> {
    const token = getStoredSessionToken();
    const res = await callGasApi("deleteNumberingRule", [token, projectCode]);
    return {
      success: res.success !== false,
      message: res.message || "Aturan penomoran berhasil dihapus.",
    };
  },

  /**
   * Get approval workflow rules
   */
  async getApprovalRules(): Promise<ApprovalRule[]> {
    const token = getStoredSessionToken();
    try {
      const res = await callGasApi<ApprovalRule[]>("getApprovalRules", [token]);
      if (res && Array.isArray(res)) return res;
      if (res && res.data && Array.isArray(res.data)) return res.data;
      return getMockApprovalRules();
    } catch {
      return getMockApprovalRules();
    }
  },

  /**
   * Save approval rule
   */
  async saveApprovalRule(rule: ApprovalRule): Promise<{ success: boolean; message: string }> {
    const token = getStoredSessionToken();
    const res = await callGasApi("saveApprovalRule", [token, rule]);
    return {
      success: res.success !== false,
      message: res.message || (res.success !== false ? "Matriks approval berhasil disimpan." : "Gagal menyimpan."),
    };
  },

  /**
   * Delete approval rule
   */
  async deleteApprovalRule(projectCode: string, documentType: string): Promise<{ success: boolean; message: string }> {
    const token = getStoredSessionToken();
    const res = await callGasApi("deleteApprovalRule", [token, projectCode, documentType]);
    return {
      success: res.success !== false,
      message: res.message || "Matriks approval berhasil dihapus.",
    };
  },
};

function getMockNumberingRules(): NumberingRule[] {
  return [
    {
      projectCode: "ALL",
      projectName: "Semua Proyek (Default Sistem)",
      format: "{PROJECT}-{TYPE}-{DISC}-{SEQ}",
      seqPadding: 3,
    },
    {
      projectCode: "AEI-CHI",
      projectName: "Chiyoda Manyar Smelter Project",
      format: "CHI-{TYPE}-{DISC}-{SEQ}-{YYYY}",
      seqPadding: 3,
    },
    {
      projectCode: "AEI-SML",
      projectName: "PT Smelting Expansion Gresik",
      format: "SML-{TYPE}-{SEQ}",
      seqPadding: 4,
    },
  ];
}

function getMockApprovalRules(): ApprovalRule[] {
  return [
    {
      projectCode: "ALL",
      projectName: "Semua Proyek (Default)",
      documentType: "ITP",
      approverEmail: "bambang.qc@asuka.co.id",
      approverName: "Bambang Soedjarwo",
      requireApproval: true,
    },
    {
      projectCode: "ALL",
      projectName: "Semua Proyek (Default)",
      documentType: "MS",
      approverEmail: "bambang.qc@asuka.co.id",
      approverName: "Bambang Soedjarwo",
      requireApproval: true,
    },
    {
      projectCode: "AEI-CHI",
      projectName: "Chiyoda Manyar Smelter Project",
      documentType: "MTR",
      approverEmail: "rahmat.site@asuka.co.id",
      approverName: "Rahmat Hidayat",
      requireApproval: true,
    },
  ];
}

