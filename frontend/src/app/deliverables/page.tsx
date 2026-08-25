"use client";

import React, { useState, useEffect } from "react";
import { FileText, Download, Presentation, FileSpreadsheet, Code2, Sparkles, Search } from "lucide-react";
import { api } from "@/lib/api";
import { Task, GeneratedFile } from "@/types";

export default function DeliverablesPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const data = await api.listTasks();
      setTasks(data);
    } catch (e) {}
  };

  const allFiles: { file: GeneratedFile; taskTitle: string; taskDate: string }[] = [];
  tasks.forEach((t) => {
    (t.generated_files || []).forEach((f) => {
      allFiles.push({
        file: f,
        taskTitle: t.title,
        taskDate: t.created_at
      });
    });
  });

  const filtered = allFiles.filter(item => 
    item.file.filename.toLowerCase().includes(filter.toLowerCase()) ||
    item.taskTitle.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal-400" />
            Generated Sovereign Deliverables Gallery
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Official enterprise artifacts (.docx Approval Notes, .pptx Slide Decks, .xlsx Workbooks) synthesized by sovereign agents.
          </p>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Total Artifacts: {allFiles.length}
        </span>
      </div>

      <div className="rounded-xl border border-slate-800 bg-[#0B1324] p-5 shadow-sm space-y-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search generated deliverables..."
            className="w-full rounded-lg border border-slate-800 bg-[#060B14] pl-9 p-2 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-2">
            <FileText className="h-8 w-8 mx-auto text-slate-600" />
            <p className="text-xs">No generated files yet. Launch Demo 1 or Demo 2 on the AI Workbench to produce real deliverables.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item, idx) => {
              const { file, taskTitle, taskDate } = item;
              let Icon = FileText;
              let colorClass = "text-blue-400";
              if (file.file_type === "DOCX") {
                Icon = FileText;
                colorClass = "text-blue-400";
              } else if (file.file_type === "PPTX") {
                Icon = Presentation;
                colorClass = "text-amber-400";
              } else if (file.file_type === "XLSX") {
                Icon = FileSpreadsheet;
                colorClass = "text-emerald-400";
              }

              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-[#070D18] p-4 space-y-3 hover:border-teal-500/50 transition flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-6 w-6 ${colorClass}`} />
                        <span className="font-bold text-white text-xs">{file.file_type} Deliverable</span>
                      </div>
                      <span className="rounded bg-teal-500/10 px-2 py-0.5 text-[9px] font-mono text-teal-400 border border-teal-500/30">
                        VERIFIED
                      </span>
                    </div>

                    <div className="text-xs font-bold text-white truncate">{file.filename}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-2">Task: {taskTitle}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {(file.file_size_bytes / 1024).toFixed(1)} KB • {new Date(taskDate).toLocaleDateString()}
                    </div>
                  </div>

                  <a
                    href={api.getDownloadUrl(file.filename)}
                    download
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-teal-600 py-2 text-xs font-bold text-white hover:bg-teal-500 transition shadow"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download File
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
