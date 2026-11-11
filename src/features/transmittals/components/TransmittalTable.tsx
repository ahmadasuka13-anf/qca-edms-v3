"use client";

import React, { useState, useMemo } from "react";
import { Search, RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { TransmittalItem } from "../types";
import { formatDate } from "@/lib/utils";

interface TransmittalTableProps {
  transmittals: TransmittalItem[];
  isLoading: boolean;
  onRefresh: () => void;
  onAddNew?: () => void;
}

export function TransmittalTable({
  transmittals,
  isLoading,
  onRefresh,
  onAddNew,
}: TransmittalTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransmittals = useMemo(() => {
    return transmittals.filter((item) => {
      return (
        item.transmittalNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.documentListSnippet && item.documentListSnippet.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
  }, [transmittals, searchTerm]);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "ACKNOWLEDGED":
        return <Badge variant="approved">ACKNOWLEDGED</Badge>;
      case "SENT":
        return <Badge variant="submitted">SENT</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#0f172a] p-3.5 border border-[#1e293b] rounded-[6px]">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Cari nomor transmittal / penerima..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" strokeWidth={1.8} />}
          />
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

          {onAddNew && (
            <Button
              variant="primary"
              size="sm"
              onClick={onAddNew}
              icon={<Plus className="w-4 h-4" strokeWidth={1.8} />}
            >
              Buat Transmittal
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">NO</TableHead>
            <TableHead className="w-44">NO TRANSMITTAL</TableHead>
            <TableHead className="w-24 text-center">TANGGAL</TableHead>
            <TableHead className="w-48">PENERIMA (RECIPIENT)</TableHead>
            <TableHead>RINGKASAN DOKUMEN YANG DIKIRIM</TableHead>
            <TableHead className="w-32">TUJUAN (PURPOSE)</TableHead>
            <TableHead className="w-24 text-center">STATUS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransmittals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-slate-400 font-mono text-xs">
                {isLoading ? "Mengambil daftar transmittal..." : "Belum ada catatan transmittal."}
              </TableCell>
            </TableRow>
          ) : (
            filteredTransmittals.map((item, idx) => (
              <TableRow key={item.transmittalId}>
                <TableCell className="text-center font-mono text-slate-400 text-xs">
                  {idx + 1}
                </TableCell>
                <TableCell className="font-mono font-semibold text-[#38bdf8] text-xs">
                  {item.transmittalNo}
                </TableCell>
                <TableCell className="text-center font-mono text-xs text-slate-300">
                  {formatDate(item.date)}
                </TableCell>
                <TableCell className="text-xs text-slate-200">
                  {item.recipient}
                </TableCell>
                <TableCell>
                  <div className="text-xs text-slate-300 truncate max-w-[280px]">
                    {item.documentListSnippet || `${item.totalDocuments} Dokumen Mutu`}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Total: {item.totalDocuments} berkas
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-slate-300">
                  {item.purpose.replace(/_/g, " ")}
                </TableCell>
                <TableCell className="text-center">
                  {renderStatusBadge(item.status)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
