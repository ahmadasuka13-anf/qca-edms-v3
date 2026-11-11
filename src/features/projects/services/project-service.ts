import { callGasApi, getStoredSessionToken } from "@/lib/gas-client";
import { ProjectItem } from "../types";

export const projectService = {
  /**
   * Fetch all registered projects
   */
  async getProjects(): Promise<ProjectItem[]> {
    const token = getStoredSessionToken();
    try {
      const res = await callGasApi<{ items?: ProjectItem[] }>("getProjectsSettings", [token]);
      if (res && res.data && typeof res.data === "object" && "items" in res.data) {
        const items = (res.data as { items?: ProjectItem[] }).items;
        if (Array.isArray(items)) return items;
      }
      if (res && "items" in res) {
        const items = (res as { items?: ProjectItem[] }).items;
        if (Array.isArray(items)) return items;
      }
      return getMockProjects();
    } catch {
      return getMockProjects();
    }
  },

  /**
   * Add new project
   */
  async addProject(project: { code: string; name: string; location: string }): Promise<{ success: boolean; message: string }> {
    const token = getStoredSessionToken();
    const res = await callGasApi("addNewProjectFromUI", [token, project.code, project.name, project.location]);
    return {
      success: res.success !== false,
      message: res.message || "Proyek berhasil ditambahkan.",
    };
  },
};

function getMockProjects(): ProjectItem[] {
  return [
    {
      code: "PRJ-CHI-01",
      name: "Chiyoda Manyar Smelter Project",
      location: "Gresik, Jawa Timur",
      status: "Active",
      clientName: "PT Chiyoda International Indonesia / PTFI",
      totalDocuments: 142,
    },
    {
      code: "PRJ-SML-02",
      name: "PT Smelting Expansion Gresik",
      location: "Gresik, Jawa Timur",
      status: "Active",
      clientName: "PT Smelting",
      totalDocuments: 89,
    },
    {
      code: "PRJ-PTFI-03",
      name: "PTFI Concentrator Upgrade & Civil Works",
      location: "Timika, Papua",
      status: "Active",
      clientName: "PT Freeport Indonesia",
      totalDocuments: 65,
    },
    {
      code: "PRJ-HO-00",
      name: "PT Asuka Head Office & General Quality System",
      location: "Gresik, Jawa Timur",
      status: "Active",
      clientName: "PT Asuka Engineering Indonesia",
      totalDocuments: 34,
    },
  ];
}
