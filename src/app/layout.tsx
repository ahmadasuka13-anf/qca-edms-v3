import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QCA EDMS — PT Asuka Engineering Indonesia",
  description: "Electronic Document Management System & QA/QC Control Platform",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen bg-[#0a0f1d] text-slate-100 selection:bg-[#163d78] selection:text-white">
        {children}
      </body>
    </html>
  );
}
