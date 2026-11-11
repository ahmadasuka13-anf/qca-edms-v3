# QCA EDMS — Next.js 16 + TypeScript + Feature-Based Architecture
**PT Asuka Engineering Indonesia**

Sistem Electronic Document Management System (EDMS) dan Pengendalian Mutu QA/QC modern berskala enterprise (20.000 – 50.000 LOC).

---

## 🏗️ Prinsip Arsitektur (Feature-Based / Domain-Driven)

Codebase ini dirancang agar **mudah dibaca manusia dan AI**, modular, dan terisolasi per domain bisnis tanpa file monolitik:

```text
src/
├── app/                              # Next.js App Router (Halaman & Layout)
│   ├── layout.tsx                    # Root Layout + Metadata Asuka
│   ├── page.tsx                      # Main Page + Tab Navigation
│   ├── globals.css                   # Token Desain Industri Anti-AI
│   └── api/gas/route.ts              # Route Proxy ke Google Apps Script (BFF)
│
├── components/                       # Shared Components
│   ├── ui/                           # Design System (Button, Badge, Table, Card, Input)
│   │   ├── Button.tsx                # Solid Asuka colors, no emojis, radius 6px
│   │   ├── Badge.tsx                 # Rectangular technical stamps, radius 3px
│   │   ├── Table.tsx                 # Tabular numbers default, dense layout
│   │   ├── Card.tsx                  # Industrial slate panels
│   │   └── Input.tsx                 # Technical inputs
│   └── layout/                       # App Layouts
│       ├── Navbar.tsx                # Header + steady connection status + tabular clock
│       └── Sidebar.tsx               # Navigation per domain QA/QC
│
├── features/                         # DOMAIN FITUR (Feature-Based)
│   ├── auth/                         # Modul Autentikasi
│   │   ├── components/LoginForm.tsx
│   │   ├── hooks/useAuth.ts
│   │   ├── services/auth-service.ts
│   │   └── types/index.ts
│   │
│   ├── calibration/                  # Modul Kalibrasi Alat Ukur
│   │   ├── components/
│   │   │   ├── CalibrationTable.tsx
│   │   │   └── CalibrationFormModal.tsx
│   │   ├── services/calibration-service.ts
│   │   └── types/index.ts
│   │
│   ├── documents/                    # Modul EDMS Dokumen Kontrol
│   │   ├── components/DocumentListTable.tsx
│   │   ├── services/document-service.ts
│   │   └── types/index.ts
│   │
│   ├── itp/                          # Modul ITP & RFI Inspeksi
│   ├── nfi/                          # Modul Site Report & NFI Log
│   └── dashboard/                    # Modul Executive Overview
│       └── components/DashboardOverview.tsx
│
└── lib/                              # Shared Utilities & Clients
    ├── gas-client.ts                 # Type-Safe client wrapper ke GAS
    └── utils.ts                      # Formatter tanggal & angka tabular
```

---

## 🛡️ Kepatuhan Standar Anti-AI PT Asuka Engineering Indonesia
1. **Zero-Emoji**: Seluruh tombol, badge, notifikasi, dan header 100% menggunakan SVG single-stroke monokrom (`lucide-react`).
2. **Anti-Pill Geometry**: Tidak ada tombol bulat `999px`. Status badge berstempel teknis persegi `rounded-[3px]`, tombol `rounded-[6px]`.
3. **Warna Industri**: Asuka Steel Navy (`#163d78`), Asuka Red (`#ed2e35`), Charcoal Slate (`#0f172a` ke `#1e293b`). Dilarang gradien ungu AI.
4. **Tipografi Presisi**: Tabular numbers (`tabular-nums`) wajib pada tabel, nomor dokumen, dan metrik.

---

## 🚀 Menjalankan Secara Lokal

```bash
cd qca-edms-next
npm run dev
```

Buka `http://localhost:3000` di browser Anda.

---

## 🌐 Deploy ke Vercel

Cukup sambungkan folder `qca-edms-next` ke Vercel atau push repository ke GitHub. Vercel akan secara otomatis mendeteksi Next.js dan melakukan build optimal tanpa konfigurasi tambahan.
Atur Environment Variable di Vercel:
`GAS_EXEC_URL` = URL Web App Deployment Google Apps Script Anda.
