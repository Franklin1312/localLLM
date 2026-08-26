import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "SovereignAI Workbench — On-Premise Multimodal Agentic AI (MRPL)",
  description: "Self-hosted, air-gapped agentic AI workbench using open-weight multimodal LLMs for confidential industrial work.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#070D18",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#F4F4F2] text-[#111111] flex flex-col antialiased selection:bg-[#FF4500] selection:text-white">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 md:p-8">{children}</main>
        <footer className="border-t-2 border-[#111111] bg-[#F4F4F2] py-4 text-center text-xs text-[#475569]">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#111111]">SovereignAI Workbench v1.0.0 — MRPL Confidential Industrial Operating System</span>
            <span className="text-[#FF4500] font-mono text-[10px] sm:text-xs font-bold tracking-tight">100% ON-PREMISE GPU EXECUTION • 0 EXTERNAL CALLS</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
