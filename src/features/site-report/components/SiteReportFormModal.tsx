"use client";

import React, { useState } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SiteReportFormData } from "../types";

interface SiteReportFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SiteReportFormData) => Promise<boolean>;
}

export function SiteReportFormModal({ isOpen, onClose, onSubmit }: SiteReportFormModalProps) {
  const [formData, setFormData] = useState<SiteReportFormData>({
    reportDate: new Date().toISOString().slice(0, 10),
    projectCode: "PRJ-CHI-01",
    discipline: "CIVIL",
    weather: "Cerah",
    inspectorName: "Ahmad Nur Fatony",
    activitySummary: "",
    areaLocation: "",
    manpowerCount: 15,
    equipmentCount: 2,
    safetyIssue: "Aman, nihil insiden",
    qualityIssue: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.activitySummary || !formData.areaLocation) {
      setError("Uraian kegiatan inspeksi dan area lokasi wajib diisi.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const ok = await onSubmit(formData);
      if (ok) {
        onClose();
      }
    } catch (err) {
      setError((err as Error).message || "Gagal menyimpan laporan inspeksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-[6px] w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-5 py-4 border-b border-[#1e293b] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-slate-100 uppercase">
              Buat Laporan Inspeksi Harian QA/QC
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Pencatatan kegiatan pengawasan mutu lapangan
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-[4px] hover:bg-[#1e293b] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-[4px] bg-[#450a0a] border border-[#991b1b] text-xs text-[#fca5a5]">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#f87171]" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Input
                label="Tanggal Inspeksi *"
                type="date"
                value={formData.reportDate}
                onChange={(e) => setFormData({ ...formData, reportDate: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                Proyek *
              </label>
              <select
                value={formData.projectCode}
                onChange={(e) => setFormData({ ...formData, projectCode: e.target.value })}
                className="w-full h-9 bg-[#1e293b] text-slate-100 border border-[#334155] rounded-[6px] px-3 text-xs focus:outline-none focus:border-[#163d78]"
              >
                <option value="PRJ-CHI-01">Chiyoda Smelter</option>
                <option value="PRJ-SML-02">PT Smelting</option>
                <option value="PRJ-PTFI-03">PTFI Concentrator</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                Disiplin *
              </label>
              <select
                value={formData.discipline}
                onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                className="w-full h-9 bg-[#1e293b] text-slate-100 border border-[#334155] rounded-[6px] px-3 text-xs focus:outline-none focus:border-[#163d78]"
              >
                <option value="CIVIL">CIVIL</option>
                <option value="MECHANICAL">MECHANICAL</option>
                <option value="ELECTRICAL">ELECTRICAL</option>
                <option value="INSTRUMENT">INSTRUMENT</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Area / Lokasi Inspeksi *"
              placeholder="Contoh: Area Unit Process Plant Grid D-4"
              value={formData.areaLocation}
              onChange={(e) => setFormData({ ...formData, areaLocation: e.target.value })}
              required
            />
            <Input
              label="Kondisi Cuaca"
              placeholder="Cerah / Hujan / Berawan"
              value={formData.weather}
              onChange={(e) => setFormData({ ...formData, weather: e.target.value })}
            />
          </div>

          <Input
            label="Uraian Kegiatan Inspeksi *"
            placeholder="Contoh: Menyaksikan slump test dan pengambilan sampel silinder beton..."
            value={formData.activitySummary}
            onChange={(e) => setFormData({ ...formData, activitySummary: e.target.value })}
            required
          />

          <Input
            label="Catatan Mutu / Hasil Uji"
            placeholder="Contoh: Slump test 11.5 cm memenuhi spesifikasi (12 ± 2 cm)..."
            value={formData.qualityIssue}
            onChange={(e) => setFormData({ ...formData, qualityIssue: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Jumlah Tenaga Kerja Lapangan"
              type="number"
              value={formData.manpowerCount || 0}
              onChange={(e) => setFormData({ ...formData, manpowerCount: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Inspektor Pengawas (PIC)"
              value={formData.inspectorName}
              onChange={(e) => setFormData({ ...formData, inspectorName: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#1e293b]">
            <Button type="button" variant="secondary" size="md" onClick={onClose} disabled={isSubmitting}>
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              icon={<Save className="w-4 h-4" strokeWidth={1.8} />}
            >
              Simpan Laporan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

