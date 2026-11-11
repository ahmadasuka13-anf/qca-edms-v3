"use client";

import React, { useState } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { documentService } from "../services/document-service";
import { DocumentFilePayload } from "../types";

interface DocumentUploadFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function DocumentUploadForm({ onSuccess, onCancel }: DocumentUploadFormProps) {
  const [projectCode, setProjectCode] = useState("PRJ-CHI-01");
  const [discipline, setDiscipline] = useState("CIVIL");
  const [documentType, setDocumentType] = useState("ITP");
  const [title, setTitle] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [revision, setRevision] = useState("Rev 0");
  const [standardRef, setStandardRef] = useState("");
  const [confidentiality, setConfidentiality] = useState<"Internal" | "Restricted" | "Public">("Internal");
  const [description, setDescription] = useState("");

  const [files, setFiles] = useState<DocumentFilePayload[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const fileList = Array.from(e.target.files);

    const converted: DocumentFilePayload[] = [];
    for (const f of fileList) {
      if (f.size > 15 * 1024 * 1024) {
        setError(`File "${f.name}" melebihi batas 15MB.`);
        continue;
      }

      const base64 = await readFileAsBase64(f);
      converted.push({
        fileName: f.name,
        mimeType: f.type || "application/octet-stream",
        base64Data: base64,
        sizeBytes: f.size,
      });
    }

    setFiles((prev) => [...prev, ...converted]);
    e.target.value = "";
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const res = reader.result as string;
        resolve(res);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Judul dokumen wajib diisi.");
      return;
    }
    if (files.length === 0) {
      setError("Pilih minimal satu file dokumen untuk diunggah.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await documentService.submitDocument({
        projectCode,
        discipline,
        documentType,
        title,
        documentNumber: documentNumber || undefined,
        revision,
        standardRef: standardRef || undefined,
        confidentiality,
        description: description || undefined,
        files,
      });

      if (res.success) {
        onSuccess();
      } else {
        setError(res.message || "Gagal mengunggah dokumen.");
      }
    } catch (err) {
      setError((err as Error).message || "Terjadi kesalahan saat mengunggah dokumen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto border-[#1e293b] bg-[#0f172a]">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
          </Button>
          <div>
            <CardTitle>Unggah Dokumen Mutu Baru / Revisi</CardTitle>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Registrasi dokumen ke master register & Google Drive QCA EDMS
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2.5 p-3 rounded-[4px] bg-[#450a0a] border border-[#991b1b] text-xs text-[#fca5a5]">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#f87171]" />
              <span>{error}</span>
            </div>
          )}

          {/* Project & Discipline Select */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                Proyek *
              </label>
              <select
                value={projectCode}
                onChange={(e) => setProjectCode(e.target.value)}
                className="w-full h-9 bg-[#1e293b] text-slate-100 border border-[#334155] rounded-[6px] px-3 text-xs focus:outline-none focus:border-[#163d78]"
              >
                <option value="PRJ-CHI-01">CHI - Chiyoda Manyar Smelter</option>
                <option value="PRJ-SML-02">SML - PT Smelting Expansion</option>
                <option value="PRJ-PTFI-03">PTFI - Freeport Concentrator</option>
                <option value="PRJ-HO-00">HO - PT Asuka Head Office</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                Disiplin Teknis *
              </label>
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                className="w-full h-9 bg-[#1e293b] text-slate-100 border border-[#334155] rounded-[6px] px-3 text-xs focus:outline-none focus:border-[#163d78]"
              >
                <option value="CIVIL">CIVIL & ARCHITECTURAL</option>
                <option value="MECHANICAL">MECHANICAL & PIPING</option>
                <option value="ELECTRICAL">ELECTRICAL</option>
                <option value="INSTRUMENT">INSTRUMENTATION</option>
                <option value="HSE">HEALTH, SAFETY & ENV</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                Jenis Dokumen *
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full h-9 bg-[#1e293b] text-slate-100 border border-[#334155] rounded-[6px] px-3 text-xs focus:outline-none focus:border-[#163d78]"
              >
                <option value="ITP">ITP - Inspection and Test Plan</option>
                <option value="METHOD_STATEMENT">MS - Method Statement</option>
                <option value="MATERIAL_APPROVAL">MTR - Material Approval Request</option>
                <option value="NCR">NCR - Non-Conformance Report</option>
                <option value="RFI">RFI - Request for Inspection</option>
                <option value="CALIBRATION">CAL - Laporan Sertifikat Kalibrasi</option>
              </select>
            </div>
          </div>

          {/* Title & Document Number */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Judul Dokumen Mutu *"
                placeholder="Contoh: Inspection and Test Plan for Structural Concrete"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                label="Nomor Dokumen (Opsional)"
                placeholder="Otomatis jika kosong"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
              />
            </div>
          </div>

          {/* Revision, Standard Reference & Confidentiality */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Input
                label="Revisi *"
                placeholder="Contoh: Rev 0 / Rev 1"
                value={revision}
                onChange={(e) => setRevision(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                label="Referensi Standar / Spesifikasi"
                placeholder="Contoh: ASTM C39 / SNI 2847"
                value={standardRef}
                onChange={(e) => setStandardRef(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                Kerahasiaan Dokumen
              </label>
              <select
                value={confidentiality}
                onChange={(e) => setConfidentiality(e.target.value as "Internal" | "Restricted" | "Public")}
                className="w-full h-9 bg-[#1e293b] text-slate-100 border border-[#334155] rounded-[6px] px-3 text-xs focus:outline-none focus:border-[#163d78]"
              >
                <option value="Internal">Internal PT Asuka</option>
                <option value="Restricted">Restricted / Rahasia Proyek</option>
                <option value="Public">Public</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <Input
            label="Keterangan Tambahan / Ringkasan Dokumen"
            placeholder="Catatan tambahan untuk QA/QC Manager..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* File Upload Zone */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
              Lampiran File Dokumen (PDF, XLSX, DOCX, DWG maks 15MB) *
            </label>
            <div className="border-2 border-dashed border-[#334155] hover:border-[#163d78] rounded-[6px] p-6 text-center bg-[#1e293b]/30 transition-colors">
              <UploadCloud className="w-8 h-8 mx-auto text-slate-400 mb-2" strokeWidth={1.8} />
              <div className="text-xs text-slate-300 font-medium">
                Tarik file ke sini atau klik tombol di bawah
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-1">
                Maksimal 15MB per file dokumen
              </p>
              <input
                type="file"
                id="docFileInput"
                className="hidden"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.dwg,.png,.jpg,.jpeg"
                onChange={handleFileChange}
              />
              <div className="mt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("docFileInput")?.click()}
                >
                  Pilih File Dokumen
                </Button>
              </div>
            </div>

            {/* Uploaded File List */}
            {files.length > 0 && (
              <div className="space-y-1.5 mt-3">
                <div className="text-[11px] font-mono uppercase text-slate-400">
                  File Siap Diunggah ({files.length}):
                </div>
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-[4px] bg-[#1e293b] border border-[#334155] text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-[#38bdf8] shrink-0" strokeWidth={1.8} />
                      <span className="text-slate-200 font-mono truncate">{file.fileName}</span>
                      {file.sizeBytes && (
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          ({(file.sizeBytes / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="text-slate-400 hover:text-[#f87171] p-1 transition-colors"
                      title="Hapus File"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e293b]">
            <Button type="button" variant="secondary" size="md" onClick={onCancel} disabled={isSubmitting}>
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              icon={<CheckCircle2 className="w-4 h-4" strokeWidth={1.8} />}
            >
              Simpan & Unggah ke EDMS
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
