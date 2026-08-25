"use client";

import React, { useState, useEffect } from "react";
import { Wrench, Terminal, FileText, Code2, FileSpreadsheet, Presentation, ShieldCheck, CheckCircle } from "lucide-react";
import { api } from "@/lib/api";

export default function ToolsPage() {
  const [tools, setTools] = useState<any[]>([]);

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      const data = await api.listTools();
      setTools(data);
    } catch (e) {}
  };

  const getToolIcon = (cat: string) => {
    switch (cat) {
      case "DOCUMENT":
        return FileText;
      case "EXECUTION":
        return Code2;
      case "GENERATOR":
        return FileSpreadsheet;
      default:
        return Wrench;
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Wrench className="h-5 w-5 text-teal-400" />
          Air-Gapped Tool Registry & Sandboxes
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Deterministic local tools called autonomously by agents without host filesystem violation or external network access.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((t, idx) => {
          const Icon = getToolIcon(t.category);
          return (
            <div
              key={idx}
              className="rounded-xl border border-slate-800 bg-[#0B1324] p-5 shadow-sm space-y-3 hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{t.name}</h3>
                    <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[9px] font-mono text-slate-400">
                      CATEGORY: {t.category}
                    </span>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-teal-400">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Sandboxed
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{t.description}</p>

              <div className="rounded bg-[#070D18] p-3 text-[11px] font-mono space-y-1">
                <div className="text-slate-500">Parameters Schema:</div>
                <pre className="text-teal-300">{JSON.stringify(t.parameters, null, 2)}</pre>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
