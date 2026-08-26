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
    <div className="space-y-8 font-sans">
      <div className="industrial-panel bg-[#F4F4F2] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#111111] uppercase tracking-widest flex items-center gap-3">
            <Sparkles className="h-6 w-6" />
            Generated Sovereign Deliverables
          </h1>
          <p className="text-sm font-bold text-[#475569] mt-2 tracking-wide max-w-xl border-l-4 border-[#FF4500] pl-3 uppercase">
            Official enterprise artifacts (.docx, .pptx, .xlsx) synthesized by sovereign agents.
          </p>
        </div>
        <div className="bg-[#111111] text-[#F4F4F2] px-3 py-1.5 font-mono text-xs font-bold border-2 border-[#111111] shadow-[2px_2px_0px_0px_rgba(255,69,0,1)] uppercase">
          Total Artifacts: {allFiles.length}
        </div>
      </div>

      <div className="industrial-panel p-6 space-y-6 bg-[#F4F4F2]">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[#111111]" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="SEARCH GENERATED DELIVERABLES..."
            className="industrial-input w-full pl-10 font-mono uppercase bg-white border-[#111111] focus:ring-[#FF4500] focus:border-[#111111]"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-[#475569] space-y-4 border-2 border-dashed border-[#111111] bg-white">
            <FileText className="h-10 w-10 mx-auto text-[#111111]" />
            <p className="text-xs font-bold uppercase tracking-widest max-w-sm mx-auto">No generated files yet. Execute a workflow on the terminal to produce deliverables.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, idx) => {
              const { file, taskTitle, taskDate } = item;
              let Icon = FileText;
              if (file.file_type === "DOCX") {
                Icon = FileText;
              } else if (file.file_type === "PPTX") {
                Icon = Presentation;
              } else if (file.file_type === "XLSX") {
                Icon = FileSpreadsheet;
              }

              return (
                <div
                  key={idx}
                  className="industrial-panel bg-white p-5 space-y-4 hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-0.5 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b-2 border-[#111111] pb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#111111] text-white p-1.5 border-2 border-[#111111] shadow-[1px_1px_0px_0px_rgba(255,69,0,1)]">
                           <Icon className="h-4 w-4" />
                        </div>
                        <span className="font-extrabold text-[#111111] text-[10px] uppercase tracking-wider">{file.file_type} File</span>
                      </div>
                      <span className="bg-[#E6F4EA] px-2 py-0.5 text-[9px] font-mono font-bold text-[#137333] border-2 border-[#137333] uppercase">
                        VERIFIED
                      </span>
                    </div>

                    <div className="text-xs font-bold text-[#111111] truncate uppercase group-hover:text-[#FF4500] transition-colors">{file.filename}</div>
                    <div className="text-[10px] text-[#475569] line-clamp-2 uppercase font-bold tracking-wide">TASK: {taskTitle}</div>
                    <div className="text-[10px] text-[#111111] font-mono font-bold uppercase">
                      SIZE: {(file.file_size_bytes / 1024).toFixed(1)} KB | {new Date(taskDate).toLocaleDateString()}
                    </div>
                  </div>

                  <a
                    href={api.getDownloadUrl(file.filename)}
                    download
                    className="w-full industrial-button bg-[#FF4500] text-white hover:bg-[#E63E00] py-3 text-xs"
                  >
                    <Download className="h-4 w-4" />
                    EXTRACT FILE
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
