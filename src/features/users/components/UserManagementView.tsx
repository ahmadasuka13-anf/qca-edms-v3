"use client";

import React, { useState } from "react";
import { UserPlus, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "QA/QC Manager" | "QA/QC Engineer" | "QC Inspector" | "Viewer";
  status: "Active" | "Inactive";
  lastLogin: string;
}

const INITIAL_USERS: SystemUser[] = [
  {
    id: "USR-001",
    name: "Ahmad Nur Fatony",
    email: "ahmadasuka13@gmail.com",
    role: "Admin",
    status: "Active",
    lastLogin: "Hari ini, 22:15 WIB",
  },
  {
    id: "USR-002",
    name: "Bambang Soedjarwo",
    email: "bambang.qc@asuka.co.id",
    role: "QA/QC Manager",
    status: "Active",
    lastLogin: "Kemarin, 16:40 WIB",
  },
  {
    id: "USR-003",
    name: "Rahmat Hidayat",
    email: "rahmat.site@asuka.co.id",
    role: "QA/QC Engineer",
    status: "Active",
    lastLogin: "12/11/2026, 09:12 WIB",
  },
  {
    id: "USR-004",
    name: "Dwi Cahyono",
    email: "dwi.c@asuka.co.id",
    role: "QC Inspector",
    status: "Active",
    lastLogin: "10/11/2026, 14:05 WIB",
  },
  {
    id: "USR-005",
    name: "Eko Wahyudi",
    email: "eko.w@asuka.co.id",
    role: "QC Inspector",
    status: "Active",
    lastLogin: "08/11/2026, 11:30 WIB",
  },
];

export function UserManagementView() {
  const [users, setUsers] = useState<SystemUser[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "QA/QC Engineer" as SystemUser["role"],
  });

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
          : u
      )
    );
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const newUser: SystemUser = {
      id: `USR-${String(users.length + 1).padStart(3, "0")}`,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: "Active",
      lastLogin: "Belum pernah masuk",
    };

    setUsers((prev) => [newUser, ...prev]);
    setIsModalOpen(false);
    setFormData({ name: "", email: "", role: "QA/QC Engineer" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#1e293b] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold tracking-wide text-slate-100 uppercase">
            Manajemen Pengguna & Hak Akses
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Otoritas akses sistem EDMS, approval dokumen & manajemen inspektor QA/QC PT Asuka Engineering Indonesia
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="text-xs font-mono gap-1.5 bg-[#163d78] hover:bg-[#1a4a91]"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Tambah Pengguna</span>
        </Button>
      </div>

      {/* Role Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-[#0f172a] border border-[#1e293b]">
          <div className="text-[11px] font-mono uppercase text-slate-400">Total Pengguna</div>
          <div className="text-2xl font-bold font-mono text-slate-100 mt-1 tabular-nums">
            {users.length}
          </div>
        </Card>
        <Card className="p-4 bg-[#0f172a] border border-[#1e293b]">
          <div className="text-[11px] font-mono uppercase text-[#38bdf8]">Administrator</div>
          <div className="text-2xl font-bold font-mono text-[#38bdf8] mt-1 tabular-nums">
            {users.filter((u) => u.role === "Admin").length}
          </div>
        </Card>
        <Card className="p-4 bg-[#0f172a] border border-[#1e293b]">
          <div className="text-[11px] font-mono uppercase text-[#4ade80]">QA/QC Approver</div>
          <div className="text-2xl font-bold font-mono text-[#4ade80] mt-1 tabular-nums">
            {users.filter((u) => u.role === "QA/QC Manager" || u.role === "QA/QC Engineer").length}
          </div>
        </Card>
        <Card className="p-4 bg-[#0f172a] border border-[#1e293b]">
          <div className="text-[11px] font-mono uppercase text-[#facc15]">Site Inspector</div>
          <div className="text-2xl font-bold font-mono text-[#facc15] mt-1 tabular-nums">
            {users.filter((u) => u.role === "QC Inspector").length}
          </div>
        </Card>
      </div>

      {/* Search Toolbar */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-[6px] p-3 flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, email, atau peran..."
            className="w-full bg-[#0a0f1d] border border-[#1e293b] rounded-[6px] pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-[#163d78]"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-[6px] overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#0a0f1d] border-b border-[#1e293b] text-slate-400 font-mono uppercase text-[10.5px]">
              <th className="py-2.5 px-3">ID Pengguna</th>
              <th className="py-2.5 px-3">Nama Lengkap</th>
              <th className="py-2.5 px-3">Email Korporat</th>
              <th className="py-2.5 px-3">Peran (Role)</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3">Terakhir Masuk</th>
              <th className="py-2.5 px-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-[#1e293b]/40 transition-colors">
                <td className="py-3 px-3 font-mono text-[#38bdf8] font-semibold">{u.id}</td>
                <td className="py-3 px-3 font-semibold text-slate-100">{u.name}</td>
                <td className="py-3 px-3 font-mono text-slate-300">{u.email}</td>
                <td className="py-3 px-3">
                  <span className="font-mono text-xs px-2 py-0.5 rounded-[3px] bg-[#163d78]/30 border border-[#163d78] text-[#38bdf8]">
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-3 text-center">
                  <Badge variant={u.status === "Active" ? "approved" : "rejected"}>
                    {u.status}
                  </Badge>
                </td>
                <td className="py-3 px-3 font-mono text-slate-400 tabular-nums">{u.lastLogin}</td>
                <td className="py-3 px-3 text-center">
                  <button
                    onClick={() => handleToggleStatus(u.id)}
                    className="text-[11px] font-mono text-slate-400 hover:text-white px-2 py-1 rounded-[3px] bg-[#1e293b] hover:bg-[#334155] border border-[#334155] transition-colors"
                  >
                    {u.status === "Active" ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#0f172a] border border-[#1e293b] rounded-[8px] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#38bdf8]" />
                <h3 className="text-sm font-bold font-mono text-slate-100 uppercase">
                  Tambah Pengguna Baru
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-mono mb-1">Nama Lengkap:</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Ahmad Nur Fatony"
                  className="w-full bg-[#0a0f1d] border border-[#1e293b] rounded-[6px] p-2 text-slate-100 outline-none focus:border-[#163d78]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-mono mb-1">Email Korporat:</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nama@asuka.co.id"
                  className="w-full bg-[#0a0f1d] border border-[#1e293b] rounded-[6px] p-2 text-slate-100 outline-none focus:border-[#163d78]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-mono mb-1">Peran Akses:</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as SystemUser["role"] })
                  }
                  className="w-full bg-[#0a0f1d] border border-[#1e293b] rounded-[6px] p-2 text-slate-100 outline-none focus:border-[#163d78]"
                >
                  <option value="Admin">Admin (Akses Penuh)</option>
                  <option value="QA/QC Manager">QA/QC Manager (Approval & PQP)</option>
                  <option value="QA/QC Engineer">QA/QC Engineer (Verifikator ITP)</option>
                  <option value="QC Inspector">QC Inspector (Site Report & Kalibrasi)</option>
                  <option value="Viewer">Viewer (Hanya Baca)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1e293b]">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
                  Batal
                </Button>
                <Button variant="primary" size="sm" type="submit" className="bg-[#163d78] hover:bg-[#1a4a91]">
                  Simpan Pengguna
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

