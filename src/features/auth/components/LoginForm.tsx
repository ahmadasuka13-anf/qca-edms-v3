"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuth } from "../hooks/useAuth";

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginDemo, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const ok = await login({ email, password });
    if (ok && onSuccess) {
      onSuccess();
    }
  };

  const handleDemoClick = () => {
    loginDemo();
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-[#1e293b] bg-[#0f172a]">
      <CardHeader className="flex flex-col items-center justify-center space-y-2 border-b border-[#1e293b] py-6">
        <Image
          src="/icons/logo.png"
          alt="PT Asuka Engineering Indonesia"
          width={160}
          height={40}
          className="h-10 w-auto object-contain mx-auto mb-1"
          priority
        />
        <div className="text-center">
          <CardTitle className="text-base text-slate-100 font-semibold tracking-wider">
            PT ASUKA ENGINEERING INDONESIA
          </CardTitle>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-mono">
            QCA EDMS Authentication
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-[4px] bg-[#450a0a]/80 border border-[#991b1b] text-xs text-[#fca5a5]">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#f87171] mt-0.5" strokeWidth={1.8} />
              <div className="space-y-0.5">
                <div className="font-semibold">{error}</div>
                <div className="text-[11px] text-slate-400">
                  Pastikan terminal telah menjalankan <code className="text-[#38bdf8]">npm run dev</code> atau gunakan tombol Masuk Cepat di bawah.
                </div>
              </div>
            </div>
          )}

          <Input
            label="Email Korporat / Akun"
            type="text"
            placeholder="nama@asuka.id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={<Mail className="w-4 h-4" strokeWidth={1.8} />}
          />

          <Input
            label="Kata Sandi"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={<Lock className="w-4 h-4" strokeWidth={1.8} />}
          />

          <div className="pt-2 space-y-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Masuk dengan Akun GAS
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="w-full border-[#334155] text-slate-200 hover:text-white"
              onClick={handleDemoClick}
              icon={<ArrowRight className="w-4 h-4 text-[#38bdf8]" />}
            >
              Masuk Cepat (Ahmad Nur Fatony - QA/QC)
            </Button>
          </div>

          <div className="text-center pt-2">
            <p className="text-[11px] text-slate-400 font-mono">
              Akun resmi terhubung ke Google Sheets Database Tab Users
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
