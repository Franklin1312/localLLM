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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('sovereign_theme');
                if (t === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#070D18] text-slate-100 flex flex-col antialiased selection:bg-teal-500 selection:text-white transition-colors">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 md:p-6">{children}</main>
        <footer className="border-t border-slate-800/80 bg-[#050A14] py-4 text-center text-xs text-slate-500 transition-colors">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs">SovereignAI Workbench v1.0.0 — MRPL Confidential Industrial Operating System</span>
            <span className="text-teal-400/80 font-mono text-[10px] sm:text-xs">100% On-Premise GPU Execution • 0 External Network Requests</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
