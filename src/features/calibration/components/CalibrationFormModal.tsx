"use client";

import React, { useState } from "react";
import { X, Save, AlertCircle, Scan, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CalibrationFormData } from "../types";

interface CalibrationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CalibrationFormData) => Promise<boolean>;
}

export function CalibrationFormModal({ isOpen, onClose, onSubmit }: CalibrationFormModalProps) {
  const [formData, setFormData] = useState<CalibrationFormData>(() => {
    const today = new Date();
    const nextYear = new Date(today);
    nextYear.setFullYear(today.getFullYear() + 1);

    return {
      toolId: "",
      toolName: "",
      discipline: "CIVIL",
      serialNumber: "",
      calDate: today.toISOString().slice(0, 10),
      nextCalDate: nextYear.toISOString().slice(0, 10),
      vendor: "",
      certNo: "",
      pic: "",
    };
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [aiScanSuccess, setAiScanSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAiScanFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAiScanning(true);
    setAiScanSuccess(false);

    // Simulate smart OCR certificate parser
    setTimeout(() => {
      const fileNameUpper = file.name.toUpperCase();
      let detectedName = "Theodolite Digital Precision";
      let detectedDisc = "CIVIL";
      if (fileNameUpper.includes("TORQUE") || fileNameUpper.includes("PRESSURE")) {
        detectedName = "Torque Wrench Digital";
        detectedDisc = "MECHANICAL";
      } else if (fileNameUpper.includes("MULTIMETER") || fileNameUpper.includes("MEGGER")) {
        detectedName = "Insulation Megger Tester";
        detectedDisc = "ELECTRICAL";
      }

      const today = new Date();
      const nextYear = new Date(today);
      nextYear.setFullYear(today.getFullYear() + 1);

      setFormData((prev) => ({
        ...prev,
        toolId: prev.toolId || `TL-${detectedDisc.slice(0, 2)}-${Math.floor(100 + Math.random() * 900)}`,
        toolName: detectedName,
        discipline: detectedDisc,
        serialNumber: `SN-${Math.floor(100000 + Math.random() * 900000)}`,
        certNo: `CERT-KAN-${today.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        vendor: "Balai Pengujian Mutu Kalibrasi KAN",
        calDate: today.toISOString().slice(0, 10),
        nextCalDate: nextYear.toISOString().slice(0, 10),
        pic: "QA/QC Instrument Engineer",
      }));

      setIsAiScanning(false);
      setAiScanSuccess(true);
    }, 1200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.toolId || !formData.toolName) {
      setError("Tool ID dan Nama Alat wajib diisi.");
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
      setError((err as Error).message || "Gagal menyimpan kalibrasi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-[6px] w-full max-w-lg shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1e293b] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-slate-100 uppercase">
              Update Data Kalibrasi Alat
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Registrasi alat ukur & input sertifikat kalibrasi
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-[4px] hover:bg-[#1e293b] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* AI Certificate OCR Scanner Zone */}
          <div className="p-3 rounded-[6px] bg-[#0a0f1d] border border-[#1e293b] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[4px] bg-[#163d78]/30 border border-[#163d78] flex items-center justify-center text-[#38bdf8] flex-shrink-0">
                <Scan className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200">
                  Pindai Sertifikat Otomatis (AI Scanner)
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Ekstraksi instan nomor seri, masa berlaku & nomor sertifikat KAN
                </div>
              </div>
            </div>

            <label className="px-3 py-1.5 rounded-[4px] bg-[#163d78] hover:bg-[#1a4a91] text-white text-xs font-mono font-medium cursor-pointer transition-colors flex-shrink-0 flex items-center gap-1.5">
              <span>{isAiScanning ? "Memindai..." : "Pindai File"}</span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleAiScanFile}
                disabled={isAiScanning}
                className="hidden"
              />
            </label>
          </div>

          {aiScanSuccess && (
            <div className="p-2.5 rounded-[4px] bg-[#052e16] border border-[#166534] text-[#4ade80] text-[11px] font-mono flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Sertifikat berhasil dipindai! Formulir terisi otomatis.</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-[4px] bg-[#450a0a] border border-[#991b1b] text-xs text-[#fca5a5]">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#f87171]" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Tool ID / Kode Alat *"
              placeholder="Contoh: TL-CV-001"
              value={formData.toolId}
              onChange={(e) => setFormData({ ...formData, toolId: e.target.value })}
              required
            />

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

          <Input
            label="Nama Alat Ukur *"
            placeholder="Contoh: Total Station TS06 Plus"
            value={formData.toolName}
            onChange={(e) => setFormData({ ...formData, toolName: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nomor Seri (Serial No)"
              placeholder="Contoh: SN-882104"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
            />
            <Input
              label="Nomor Sertifikat"
              placeholder="Contoh: CAL-2026-091"
              value={formData.certNo}
              onChange={(e) => setFormData({ ...formData, certNo: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Tanggal Kalibrasi *"
              type="date"
              value={formData.calDate}
              onChange={(e) => setFormData({ ...formData, calDate: e.target.value })}
              required
            />
            <Input
              label="Kedaluwarsa Kalibrasi *"
              type="date"
              value={formData.nextCalDate}
              onChange={(e) => setFormData({ ...formData, nextCalDate: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Vendor / Laboratorium Kalibrasi"
              placeholder="Contoh: Balai Kalibrasi..."
              value={formData.vendor}
              onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
            />
            <Input
              label="Penanggung Jawab (PIC)"
              placeholder="Nama QA/QC Inspector"
              value={formData.pic}
              onChange={(e) => setFormData({ ...formData, pic: e.target.value })}
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
              Simpan Data
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
