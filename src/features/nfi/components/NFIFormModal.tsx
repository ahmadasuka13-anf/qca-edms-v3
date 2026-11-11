"use client";

import React, { useState } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { NFIFormData, NFIResult, NFIStatus } from "../types";

interface NFIFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NFIFormData) => Promise<boolean>;
}

export function NFIFormModal({ isOpen, onClose, onSubmit }: NFIFormModalProps) {
  const [formData, setFormData] = useState<NFIFormData>({
    noNfi: "",
    subjectDescription: "",
    area: "",
    typeOfInspection: "Visual & Dimensional Inspection",
    issuedDate: new Date().toISOString().slice(0, 10),
    discipline: "CIVIL",
    location: "",
    inspectionDate: new Date().toISOString().slice(0, 10),
    result: "FAIL",
    itrNo: "",
    itpNo: "",
    status: "OPEN",
    picAei: "",
    remark: "",
    projectCode: "PRJ-CHI-01",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subjectDescription || !formData.area || !formData.picAei) {
      setError("Uraian temuan, area, dan PIC AEI wajib diisi.");
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
      setError((err as Error).message || "Gagal mencatat temuan NFI.");
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
              Catat Temuan Lapangan (NFI Log)
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Notice of Finding / Non-Conformance Inspection
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

            <div>
              <Input
                label="Nomor NFI (Opsional)"
                placeholder="Otomatis jika kosong"
                value={formData.noNfi}
                onChange={(e) => setFormData({ ...formData, noNfi: e.target.value })}
              />
            </div>
          </div>

          <Input
            label="Uraian Temuan Mutu (Subject Description) *"
            placeholder="Contoh: Permukaan beton mengalami retak susut melebihi 0.3mm..."
            value={formData.subjectDescription}
            onChange={(e) => setFormData({ ...formData, subjectDescription: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Area Pekerjaan *"
              placeholder="Contoh: Unit Process Area 1"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              required
            />
            <Input
              label="Lokasi Detail / Grid *"
              placeholder="Contoh: Grid C-4 ke D-5 Elevasi +12.00"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Input
                label="Tanggal Inspeksi *"
                type="date"
                value={formData.inspectionDate}
                onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                Hasil Inspeksi *
              </label>
              <select
                value={formData.result}
                onChange={(e) => setFormData({ ...formData, result: e.target.value as NFIResult })}
                className="w-full h-9 bg-[#1e293b] text-slate-100 border border-[#334155] rounded-[6px] px-3 text-xs focus:outline-none focus:border-[#163d78]"
              >
                <option value="FAIL">FAIL (TIDAK MEMENUHI)</option>
                <option value="RE-INSPECT">RE-INSPECT (PERLU ULANG)</option>
                <option value="PASS">PASS (SESUAI)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                Status Temuan *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as NFIStatus })}
                className="w-full h-9 bg-[#1e293b] text-slate-100 border border-[#334155] rounded-[6px] px-3 text-xs focus:outline-none focus:border-[#163d78]"
              >
                <option value="OPEN">OPEN (BELUM SELESAI)</option>
                <option value="CLOSED">CLOSED (TUNTAS)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="No ITP Terkait"
              placeholder="Contoh: ITP-CHI-CV-001"
              value={formData.itpNo}
              onChange={(e) => setFormData({ ...formData, itpNo: e.target.value })}
            />
            <Input
              label="PIC AEI *"
              placeholder="Nama QA/QC Inspector"
              value={formData.picAei}
              onChange={(e) => setFormData({ ...formData, picAei: e.target.value })}
              required
            />
          </div>

          <Input
            label="Tindak Lanjut / Remark"
            placeholder="Instruksi perbaikan yang harus dilakukan kontraktor/lapangan..."
            value={formData.remark}
            onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
          />

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
              Simpan Temuan NFI
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

