"use client";

import React, { useState } from "react";
import {
  Bot,
  X,
  Send,
  FileCheck2,
  AlertOctagon,
  FileText,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProjectCode?: string;
}

interface Message {
  sender: "user" | "ai";
  text: string;
  time: string;
}

export function AIAssistantModal({
  isOpen,
  onClose,
  activeProjectCode,
}: AIAssistantModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: `Halo, saya Asisten AI QA/QC PT Asuka Engineering Indonesia. Saya siap membantu pengecekan kepatuhan ITP, standar ISO 9001:2015, Method Statement, prosedur kalibrasi alat, dan Project Quality Plan (PQP)${
        activeProjectCode ? ` untuk proyek ${activeProjectCode}` : ""
      }. Ada yang bisa saya bantu?`,
      time: "Sekarang",
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    {
      label: "Audit ITP Pengecoran",
      prompt:
        "Apa saja checklist inspeksi hold point pada ITP Pekerjaan Beton Struktural (Structural Concrete Works) sesuai standar AEI?",
      icon: <FileCheck2 className="w-3.5 h-3.5 text-[#38bdf8]" />,
    },
    {
      label: "Format Penomoran Dokumen",
      prompt:
        "Jelaskan aturan penomoran resmi dokumen PT Asuka Engineering Indonesia (Kode Proyek, Disiplin, Tipe, Nomor Urut, dan Revisi).",
      icon: <FileText className="w-3.5 h-3.5 text-[#4ade80]" />,
    },
    {
      label: "Tindak Lanjut NCR Mutu",
      prompt:
        "Bagaimana alur penyelesaian Non-Conformance Report (NCR) temuan honeycomb beton di lapangan hingga verifikasi close-out?",
      icon: <AlertOctagon className="w-3.5 h-3.5 text-[#f87171]" />,
    },
    {
      label: "Klausul ISO 9001:2015",
      prompt:
        "Sebutkan klausul ISO 9001:2015 yang mengatur tentang kalibrasi alat ukur dan pengendalian dokumen mutu.",
      icon: <ShieldCheck className="w-3.5 h-3.5 text-[#facc15]" />,
    },
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputPrompt.trim();
    if (!text || isThinking) return;

    const userMsg: Message = {
      sender: "user",
      text,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt("");
    setIsThinking(true);

    setTimeout(() => {
      let aiResponseText = "";
      const lower = text.toLowerCase();

      if (lower.includes("itp") || lower.includes("beton") || lower.includes("concrete")) {
        aiResponseText = `### Checklist Hold Point ITP Concrete Works (PT Asuka Engineering Indonesia):

1. **Pre-Pour Inspection (Hold Point):**
   - Verifikasi elevasi & dimensi bekisting (toleransi ±5 mm sesuai ACI 117).
   - Kebersihan area cor (bebas serpihan kayu, kawat bendrat, genangan air).
   - Penulangan: diameter, jarak sengkang, penyambungan (*lap length*), dan selimut beton (*concrete cover* min. 50 mm).
   - Verifikasi sertifikat kalibrasi batching plant & truck mixer.

2. **During Pour (Witness Point):**
   - Uji slump test di lokasi (rentang standar: 100 ± 20 mm atau 120 ± 20 mm sesuai mix design).
   - Pengambilan sampel silinder beton (minimal 1 set per 50 m³: uji 7 hari, 14 hari, dan 28 hari).
   - Suhu beton segar maksimal 32°C.
   - Pemadatan menggunakan vibrator internal secara vertikal (durasi 5-15 detik per titik).

3. **Post-Pour Inspection:**
   - Curing minimal 7 hari berturut-turut (water ponding atau curing compound).
   - Pemeriksaan visual cacat permukaan (*honeycomb*, retak plastis, keropos).
   - Penerbitan Inspection and Test Record (ITR) bertingkat (QC AEI, Konsultan/Client).`;
      } else if (lower.includes("format") || lower.includes("penomoran") || lower.includes("kode")) {
        aiResponseText = `### Standar Penomoran Dokumen Resmi QCA EDMS:

Format baku: **[KODE_PROYEK]-[DISIPLIN]-[TIPE]-[NOMOR_URUT] Rev [REV]**

- **Kode Proyek**: Singkatan unik proyek klien (contoh: \`AEI-CHI\` untuk Chiyoda, \`AEI-PTFI\` untuk Freeport, \`AEI-SML\` untuk Smelting).
- **Disiplin Teknis**:
  - \`CV\` : Civil
  - \`ST\` : Structural
  - \`ME\` : Mechanical
  - \`PI\` : Piping
  - \`EL\` : Electrical
  - \`IN\` : Instrument
  - \`AR\` : Architectural
- **Tipe Dokumen**: \`ITP\` (Inspection Test Plan), \`MS\` (Method Statement), \`MTR\` (Material Approval), \`NCR\` (Non-Conformance Report), \`CAL\` (Calibration Report).
- **Nomor Urut**: 3 digit numerik (\`001\`, \`002\`, dst).
- **Revisi**: Dimulai dari \`Rev 0\` (original submission), \`Rev 1\` (pertama direvisi), dst.

*Contoh valid*: \`AEI-CHI-ITP-CV-001 Rev 0\``;
      } else if (lower.includes("ncr") || lower.includes("temuan") || lower.includes("honeycomb")) {
        aiResponseText = `### Alur Prosedur Penutupan NCR (Non-Conformance Report):

1. **Penerbitan NCR (Day 0):** QC Inspector mencatat ketidaksesuaian di lapangan, mengambil foto bukti, dan memasukkan ke register QCA EDMS.
2. **Root Cause Analysis (Maks. 2x24 Jam):** Site Engineer & QA/QC menganalisis penyebab utama (misal: vibrator tidak mencapai dasar bekisting, aggregate ratio terlalu kasar).
3. **Corrective & Preventive Action (CAPA):**
   - Perbaikan fisik: chipping area keropos, pembersihan, aplikasi bonding agent epoksi, grouting semen non-shrink (SikaGrout / sejenis).
   - Tindakan pencegahan: toolbox meeting QC dengan tim cor, penyesuaian durasi vibrasi.
4. **Inspeksi Ulang & Pengujian (Re-Inspection):** Uji palu beton (*rebound hammer*) atau visual check setelah umur perbaikan cukup.
5. **Verifikasi & Close-Out:** Penandatanganan form NCR oleh QA/QC Lead AEI dan QA Manager Klien. Status diubah dari \`OPEN\` menjadi \`CLOSED\` pada QCA EDMS.`;
      } else if (lower.includes("iso") || lower.includes("9001") || lower.includes("klausul")) {
        aiResponseText = `### Klausul ISO 9001:2015 Terkait Pengendalian Mutu & Kalibrasi:

- **Klausul 7.1.5 (Monitoring and Measuring Resources):**
  - Subklausul 7.1.5.2 mewajibkan semua peralatan ukur dikalibrasi atau diverifikasi pada selang waktu tertentu terhadap standar pengukuran internasional/nasional (KAN/BSN).
  - Wajib memiliki identifikasi status kalibrasi (stiker kalibrasi valid).
  - Tindakan korektif jika alat ukur ditemukan *out-of-calibration*.
- **Klausul 7.5 (Documented Information):**
  - 7.5.2 Pembuatan & pembaruan dokumen (identifikasi, format, persetujuan).
  - 7.5.3 Pengendalian informasi terdokumentasi (distribusi, akses, retensi, proteksi arsip).
- **Klausul 8.6 (Release of Products and Services):**
  - Verifikasi bahwa seluruh kriteria penerimaan telah terpenuhi sebelum dokumen ITR/serah terima disahkan.
- **Klausul 10.2 (Nonconformity and Corrective Action):**
  - Penanganan NCR dan evaluasi tindakan perbaikan.`;
      } else {
        aiResponseText = `Terima kasih atas pertanyaannya. Berdasarkan Prosedur Mutu PT Asuka Engineering Indonesia:

Permintaan Anda terkait **"${text}"** telah dianalisis. Seluruh dokumen dan aktivitas mutu di lapangan wajib mengacu pada:
1. **Project Quality Plan (PQP)** proyek aktif.
2. **Inspection & Test Plan (ITP)** yang telah disetujui Owner/Client.
3. Standar teknis yang relevan (ASTM, ACI, AWS D1.1, ASME B31.3).

Jika Anda membutuhkan draf naratif atau checklist khusus, silakan klik salah satu tombol pintasan audit di atas atau tanyakan parameter spesifik yang ingin dihitung.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: aiResponseText,
          time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsThinking(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#0f172a] border border-[#1e293b] rounded-[8px] shadow-2xl flex flex-col h-[85vh] max-h-[720px] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-[#070b14] border-b border-[#1e293b] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-[4px] bg-[#163d78]/40 border border-[#163d78] flex items-center justify-center text-[#38bdf8]">
              <Bot className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold font-mono tracking-wider text-slate-100 uppercase">
                  Tanya AI QC — Asisten Diagnostik Mutu
                </h3>
                <span className="text-[9px] font-mono font-bold bg-[#163d78] text-[#38bdf8] px-1.5 py-0.5 rounded-[2px] border border-[#163d78]">
                  AEI ENGINE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Konsultasi ITP, ISO 9001:2015, Spesifikasi Teknis & Kepatuhan PQP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[4px] text-slate-400 hover:text-white hover:bg-[#1e293b] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Audit Prompt Chips */}
        <div className="p-2.5 bg-[#0a0f1d] border-b border-[#1e293b] flex items-center gap-1.5 overflow-x-auto shrink-0">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider shrink-0 pl-1">
            Topik Cepat:
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp.prompt)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#0f172a] hover:bg-[#1e293b] border border-[#1e293b] text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-colors"
            >
              {qp.icon}
              <span>{qp.label}</span>
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0a0f1d]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[88%] rounded-[6px] p-3 text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-[#163d78] text-white border border-[#163d78]"
                    : "bg-[#0f172a] text-slate-200 border border-[#1e293b]"
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                <div
                  className={`mt-1.5 text-[9px] font-mono ${
                    msg.sender === "user" ? "text-slate-300" : "text-slate-400"
                  }`}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 p-3 bg-[#0f172a] border border-[#1e293b] rounded-[6px] text-xs text-slate-400 max-w-xs font-mono">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#38bdf8]" />
              <span>Menganalisis standar mutu & klausul teknis...</span>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-3 bg-[#070b14] border-t border-[#1e293b] flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ketik pertanyaan teknis atau verifikasi klausul mutu..."
            className="flex-1 bg-[#0f172a] border border-[#1e293b] rounded-[6px] px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-[#163d78]"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleSend()}
            disabled={!inputPrompt.trim() || isThinking}
            className="h-8 px-3 font-mono text-xs gap-1.5 bg-[#163d78] hover:bg-[#1a4a91]"
          >
            <span>Kirim</span>
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

