"use client";

import React, { useState } from "react";
import { Plus, RefreshCw, MapPin, Save, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ProjectItem } from "../types";

interface ProjectManagementProps {
  projects: ProjectItem[];
  isLoading: boolean;
  onRefresh: () => void;
  onAddProject: (project: { code: string; name: string; location: string }) => Promise<boolean>;
}

export function ProjectManagement({
  projects,
  isLoading,
  onRefresh,
  onAddProject,
}: ProjectManagementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) return;
    setIsSubmitting(true);
    try {
      const ok = await onAddProject({ code, name, location });
      if (ok) {
        setCode("");
        setName("");
        setLocation("");
        setIsModalOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header toolbar */}
      <div className="flex items-center justify-between bg-[#0f172a] p-4 border border-[#1e293b] rounded-[6px]">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
            Master Proyek PT Asuka Engineering Indonesia
          </h3>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Daftar proyek aktif dan integrasi folder dokumen EDMS
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            isLoading={isLoading}
            icon={<RefreshCw className="w-4 h-4" strokeWidth={1.8} />}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            icon={<Plus className="w-4 h-4" strokeWidth={1.8} />}
          >
            Tambah Proyek
          </Button>
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((prj) => (
          <Card key={prj.code} className="p-5 border-[#1e293b]">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#38bdf8] px-2 py-0.5 rounded-[3px] bg-[#163d78]/30 border border-[#163d78]">
                    {prj.code}
                  </span>
                  <Badge variant={prj.status === "Active" ? "approved" : "neutral"}>
                    {prj.status}
                  </Badge>
                </div>
                <h4 className="text-sm font-semibold text-slate-100 mt-2">{prj.name}</h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono pt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{prj.location}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono text-slate-400 uppercase">Dokumen</div>
                <div className="text-xl font-bold font-mono text-slate-200 tabular-nums">
                  {prj.totalDocuments || 0}
                </div>
              </div>
            </div>

            {prj.clientName && (
              <div className="mt-4 pt-3 border-t border-[#1e293b] text-[11px] text-slate-400 font-mono flex items-center justify-between">
                <span>Client: {prj.clientName}</span>
                <span className="text-[#4ade80]">Folder Drive Connected</span>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Modal Tambah Proyek */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-[6px] w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1e293b] flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-wide text-slate-100 uppercase">
                Tambah Proyek Baru
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-[4px] hover:bg-[#1e293b]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <Input
                label="Kode Proyek (Project Code) *"
                placeholder="Contoh: PRJ-CHI-02"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />

              <Input
                label="Nama Proyek *"
                placeholder="Contoh: Smelter Manyar Expansion Stage 2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Lokasi Proyek"
                placeholder="Contoh: Gresik, Jawa Timur"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1e293b]">
                <Button type="button" variant="secondary" size="md" onClick={() => setIsModalOpen(false)}>
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  icon={<Save className="w-4 h-4" strokeWidth={1.8} />}
                >
                  Simpan Proyek
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
