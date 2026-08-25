"use client";

import React, { useState, useEffect } from "react";
import {
  Terminal,
  Upload,
  FileText,
  Play,
  CheckCircle2,
  Clock,
  Cpu,
  ShieldCheck,
  Download,
  Sparkles,
  Database,
  Code2,
  FileSpreadsheet,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Zap,
  Activity,
  Presentation,
} from "lucide-react";
import { api } from "@/lib/api";
import { Task } from "@/types";
import PidOverlayViewer from "@/components/PidOverlayViewer";

export default function AIWorkbenchPage() {
  const [prompt, setPrompt] = useState<string>("");
  const [taskType, setTaskType] = useState<string>("AUTO");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [activeDemo, setActiveDemo] = useState<number | null>(null);
  const [routingPreview, setRoutingPreview] = useState<any>(null);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const list = await api.listTasks();
      setRecentTasks(list);
    } catch (e) {}
  };

  useEffect(() => {
    if (!prompt.trim()) {
      setRoutingPreview(null);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const preview = await api.dryRunRoute(prompt, !!selectedFile);
        setRoutingPreview(preview);
      } catch (e) {}
    }, 200);
    return () => clearTimeout(timer);
  }, [prompt, selectedFile, taskType]);

  const runTask = async (taskPrompt: string, taskTypeVal: string, fileToAttach: File | null) => {
    setIsExecuting(true);
    const formData = new FormData();
    formData.append("prompt", taskPrompt);
    if (taskTypeVal !== "AUTO") {
      formData.append("task_type", taskTypeVal);
    }
    if (fileToAttach) {
      formData.append("file", fileToAttach);
    }

    try {
      const task = await api.createTask(formData);
      setCurrentTask(task);

      const pollInterval = setInterval(async () => {
        try {
          const updated = await api.getTask(task.id);
          setCurrentTask(updated);
          if (updated.status === "COMPLETED" || updated.status === "FAILED") {
            clearInterval(pollInterval);
            setIsExecuting(false);
            setActiveDemo(null);
            loadTasks();
          }
        } catch (e) {
          clearInterval(pollInterval);
          setIsExecuting(false);
          setActiveDemo(null);
        }
      }, 1000);
    } catch (err: any) {
      setIsExecuting(false);
      setActiveDemo(null);
    }
  };

  const handleLaunchDemo1 = () => {
    const p =
      "Analyze this scanned inspection report for Heat Exchanger 11-HX-401, cross-reference findings with MRPL Refinery Safety SOP-08 (Minimum Shell & Tube Thickness), identify critical structural hazards, and synthesize an executive Approval Note (.docx) and board presentation (.pptx) for turnaround retubing.";
    const sampleFile = new File(
      ["MRPL REFINERY HEAT EXCHANGER HX-401 INSPECTION REPORT (SCANNED)"],
      "MRPL_HX401_Inspection_Report.pdf",
      { type: "application/pdf" }
    );
    setActiveDemo(1);
    setTaskType("MULTIMODAL_DOC");
    setPrompt(p);
    setSelectedFile(sampleFile);
    runTask(p, "MULTIMODAL_DOC", sampleFile);
  };

  const handleLaunchDemo2 = () => {
    const p =
      "Process the refinery pump vibration and bearing temperature log 'pump_p102_telemetry.csv', apply ISO 10816-3 vibration severity thresholds in Python sandbox, identify operational anomaly hours, and generate an Excel analysis workbook (.xlsx).";
    const sampleCsv = new File(
      ["Timestamp,Pump_Tag,Vibration_RMS_mm_s,Bearing_Temp_C\n2026-08-25 08:00,P-102A,4.8,78.5"],
      "pump_p102_telemetry.csv",
      { type: "text/csv" }
    );
    setActiveDemo(2);
    setTaskType("CODE_EXEC");
    setPrompt(p);
    setSelectedFile(sampleCsv);
    runTask(p, "CODE_EXEC", sampleCsv);
  };

  const handleLaunchDemo3 = () => {
    const p =
      "Synthesize a Python script to compute refinery heat transfer coefficients (U-value) for crude preheat train exchangers and verify calculations in the sandbox.";
    setActiveDemo(3);
    setTaskType("AUTO");
    setPrompt(p);
    setSelectedFile(null);
    runTask(p, "AUTO", null);
  };

  const handleManualExecute = () => {
    if (!prompt.trim()) return;
    runTask(prompt, taskType, selectedFile);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top Banner — Fully Responsive for Mobile, Tablet, & Desktop */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-gradient-to-r from-[#0C1A2E] to-[#0A1626] p-4 sm:p-5 shadow-lg">
        <div className="w-full xl:w-auto">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-teal-400 animate-pulse shrink-0" />
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              MRPL Sovereign AI Agentic Studio
            </h1>
            <span className="rounded bg-blue-900/40 border border-blue-600/40 px-2 py-0.5 text-[9px] sm:text-[10px] font-mono text-blue-300 font-semibold">
              PS 26117
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400 leading-relaxed">
            Air-gapped on-premise multimodal intelligence. Scanned document parsing, sandboxed code execution, real deliverable synthesis.
          </p>
        </div>

        {/* 3 Killer Demo Quick Launchers — Interactive with Shimmer Effects */}
        <div className="grid grid-cols-1 sm:grid-cols-3 xl:flex xl:flex-wrap items-center gap-2 w-full xl:w-auto">
          <button
            type="button"
            onClick={handleLaunchDemo1}
            disabled={isExecuting}
            className={`interactive-card btn-shimmer flex items-center justify-center sm:justify-start gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-bold transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${
              activeDemo === 1
                ? "border-teal-400 bg-teal-800 text-white animate-pulse"
                : "border-teal-500/50 bg-teal-950/60 text-teal-300 hover:bg-teal-900 hover:text-white"
            }`}
          >
            {activeDemo === 1 ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin shrink-0" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 text-teal-400 shrink-0" />
            )}
            <span className="truncate">⭐ Demo 1: Approval Note (.docx)</span>
          </button>

          <button
            type="button"
            onClick={handleLaunchDemo2}
            disabled={isExecuting}
            className={`interactive-card btn-shimmer flex items-center justify-center sm:justify-start gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-bold transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${
              activeDemo === 2
                ? "border-blue-400 bg-blue-800 text-white animate-pulse"
                : "border-blue-500/50 bg-blue-950/60 text-blue-300 hover:bg-blue-900 hover:text-white"
            }`}
          >
            {activeDemo === 2 ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin shrink-0" />
            ) : (
              <Code2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
            )}
            <span className="truncate">⭐ Demo 2: Telemetry (.xlsx)</span>
          </button>

          <button
            type="button"
            onClick={handleLaunchDemo3}
            disabled={isExecuting}
            className={`interactive-card btn-shimmer flex items-center justify-center sm:justify-start gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-bold transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${
              activeDemo === 3
                ? "border-purple-400 bg-purple-800 text-white animate-pulse"
                : "border-purple-500/50 bg-purple-950/60 text-purple-300 hover:bg-purple-900 hover:text-white"
            }`}
          >
            {activeDemo === 3 ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin shrink-0" />
            ) : (
              <Zap className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            )}
            <span className="truncate">⭐ Demo 3: Auto-Routing</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Input + DAG Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left Column: Task Formulation */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-[#0B1324] p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-teal-400" />
                Task Formulation
              </h2>
              {routingPreview && (
                <span className="rounded bg-teal-500/10 px-2 py-0.5 text-[9px] sm:text-[10px] font-mono text-teal-400 border border-teal-500/30 truncate max-w-[160px] sm:max-w-none">
                  {routingPreview.selected_model}
                </span>
              )}
            </div>

            {/* Task Type */}
            <div>
              <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5 mb-1">
                <Sliders className="h-3.5 w-3.5 text-teal-400" />
                Task Type Category
              </label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-[#060B14] p-2.5 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
              >
                <option value="AUTO">✨ Auto-Detect Intent (Dynamic Router)</option>
                <option value="MULTIMODAL_DOC">📄 Document / Scanned P&ID Analysis</option>
                <option value="REPORT_GEN">📋 Engineering Approval Note & Report</option>
                <option value="CODE_EXEC">💻 Coding & Sandboxed Python Execution</option>
                <option value="DATA_ANALYSIS">📊 Data & Telemetry Spreadsheet Analysis</option>
                <option value="RAG_SEARCH">🔍 SOP & Knowledge Base Search</option>
              </select>
            </div>

            {/* Prompt Textarea */}
            <div>
              <label className="text-[11px] font-medium text-slate-400 mb-1 block">
                Industrial Instruction
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter industrial instruction (e.g. analyze scanned inspection report for HX-401, check SOP-08 compliance, draft approval note)..."
                rows={4}
                className="w-full rounded-lg border border-slate-800 bg-[#060B14] p-3 text-xs text-slate-200 placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition font-sans"
              />
            </div>

            {/* File Dropzone */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-400">
                Attach Technical Artifact (PDF, P&ID, CSV, Photo)
              </label>
              <div className="relative flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-700 bg-[#070D18] p-4 text-center hover:border-slate-500 transition cursor-pointer">
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="h-5 w-5 text-slate-400 mb-1" />
                <span className="text-xs font-medium text-slate-300 truncate max-w-full px-2">
                  {selectedFile ? selectedFile.name : "Drop inspection PDF, P&ID drawing, or telemetry CSV"}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  {selectedFile
                    ? `${(selectedFile.size / 1024).toFixed(1)} KB`
                    : "Processed 100% on-premise — zero external leak"}
                </span>
              </div>
            </div>

            {/* Router Preview */}
            {routingPreview && (
              <div className="rounded-lg border border-slate-800 bg-[#080E1C] p-3 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-teal-400 font-semibold text-[11px]">
                  <Cpu className="h-3.5 w-3.5 shrink-0" />
                  Model Router Rationale
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{routingPreview.reasoning}</p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] text-slate-500 font-mono">
                  <span>Capability: {routingPreview.model_capability}</span>
                  <span>Est. VRAM: {routingPreview.estimated_vram_gb} GB</span>
                </div>
              </div>
            )}

            {/* Execute Button */}
            <button
              type="button"
              onClick={handleManualExecute}
              disabled={isExecuting || !prompt.trim()}
              className={`w-full flex items-center justify-center gap-2 rounded-lg py-3 text-xs font-bold transition-all shadow-md active:scale-[0.98] ${
                isExecuting || !prompt.trim()
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "btn-shimmer bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:from-teal-400 hover:to-blue-500 hover:shadow-teal-500/20 shadow-lg"
              }`}
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin shrink-0" />
                  Executing Multi-Agent DAG...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current shrink-0" />
                  Launch Sovereign Workflow
                </>
              )}
            </button>
          </div>

          {/* Recent Tasks */}
          <div className="rounded-xl border border-slate-800 bg-[#0B1324] p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Recent Executions
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {recentTasks.length === 0 ? (
                <p className="text-xs text-slate-500">No previous workflows executed.</p>
              ) : (
                recentTasks.slice(0, 5).map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setCurrentTask(t)}
                    className="interactive-card p-2.5 rounded-lg border border-slate-800/80 bg-[#080E1C] hover:bg-slate-800/60 transition cursor-pointer flex items-center justify-between"
                  >
                    <div className="truncate pr-2">
                      <div className="text-xs font-semibold text-slate-200 truncate">{t.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {t.assigned_model || "Auto"} • {t.execution_time_seconds}s
                      </div>
                    </div>
                    <span className="rounded bg-teal-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-teal-400 border border-teal-500/30 shrink-0">
                      {t.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: DAG + Deliverables */}
        <div className="lg:col-span-7 space-y-4">
          {/* Live Execution DAG */}
          <div className="rounded-xl border border-slate-800 bg-[#0B1324] p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-teal-500/10 text-teal-400 shrink-0">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Live Agent Execution Timeline
                  </h2>
                  <span className="text-[10px] text-slate-400 block truncate max-w-[180px] sm:max-w-none">
                    {currentTask
                      ? `Task: ${currentTask.id.slice(0, 8)}… | ${currentTask.status}`
                      : "Awaiting Task Launch"}
                  </span>
                </div>
              </div>
              {currentTask && (
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 shrink-0">
                  <Clock className="h-3.5 w-3.5 text-teal-400" />
                  {currentTask.execution_time_seconds || 0}s
                </div>
              )}
            </div>

            {!currentTask ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <Terminal className="h-8 w-8 mx-auto text-slate-600" />
                <p className="text-xs px-4">
                  Click a Demo button above or formulate a custom task and press Launch.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentTask.steps && currentTask.steps.length > 0 ? (
                  currentTask.steps.map((step, idx) => (
                    <div
                      key={step.id || idx}
                      className="animate-fade-in-up interactive-card rounded-lg border border-slate-800 bg-[#080E1C] p-3 space-y-1.5 hover:border-slate-700 transition"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-950 border border-teal-500/40 text-[10px] font-bold text-teal-400 shrink-0">
                            {step.step_order}
                          </span>
                          <span className="text-xs font-bold text-slate-200">{step.agent_name}</span>
                          {step.tool_called && (
                            <span className="rounded bg-blue-900/30 border border-blue-600/30 px-1.5 py-0.5 text-[9px] font-mono text-blue-300 truncate max-w-[150px] sm:max-w-none">
                              tool: {step.tool_called}
                            </span>
                          )}
                        </div>
                        {step.status === "RETRY" ? (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                            <RefreshCw className="h-3 w-3 shrink-0 animate-spin" />
                            RETRY LOOP
                          </span>
                        ) : step.status === "FAILED" ? (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/30">
                            <AlertTriangle className="h-3 w-3 shrink-0" />
                            FAILED
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-teal-400">
                            <CheckCircle2 className="h-3 w-3 shrink-0" />
                            {step.status}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pl-0 sm:pl-7 break-words">
                        {step.thought_trace}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-teal-400 animate-pulse">
                    Decomposing task and initializing sovereign agentic pipeline…
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Multimodal P&ID Bounding Box Vision Overlay (Requirement 2.2) */}
          {(activeDemo === 1 || currentTask?.task_type === "MULTIMODAL_DOC" || (currentTask && currentTask.assigned_model?.includes("vl"))) && (
            <PidOverlayViewer />
          )}

          {/* Generated Deliverables */}
          {currentTask?.generated_files && currentTask.generated_files.length > 0 && (
            <div className="rounded-xl border border-teal-500/30 bg-gradient-to-br from-[#09182A] to-[#0B1526] p-4 sm:p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-teal-400 shrink-0" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white truncate">
                    Generated Deliverables ({currentTask.generated_files.length})
                  </h3>
                </div>
                <span className="text-[10px] text-teal-400 font-mono shrink-0">SHA-256 Verified</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentTask.generated_files.map((file) => {
                  const Icon =
                    file.file_type === "PPTX"
                      ? Presentation
                      : file.file_type === "XLSX"
                      ? FileSpreadsheet
                      : FileText;
                  const color =
                    file.file_type === "PPTX"
                      ? "text-amber-400"
                      : file.file_type === "XLSX"
                      ? "text-emerald-400"
                      : "text-blue-400";

                  return (
                    <div
                      key={file.id}
                      className="flex items-center justify-between rounded-lg border border-slate-800 bg-[#070D18] p-3 hover:border-teal-500/50 transition"
                    >
                      <div className="flex items-center gap-2.5 truncate mr-2">
                        <Icon className={`h-6 w-6 shrink-0 ${color}`} />
                        <div className="truncate">
                          <div className="text-xs font-bold text-white truncate">{file.filename}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {(file.file_size_bytes / 1024).toFixed(1)} KB • {file.file_type}
                          </div>
                        </div>
                      </div>
                      <a
                        href={api.getDownloadUrl(file.filename)}
                        download
                        className="flex items-center gap-1 rounded bg-teal-600 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-teal-500 transition shrink-0"
                      >
                        <Download className="h-3 w-3" />
                        <span className="hidden xs:inline">Download</span>
                      </a>
                    </div>
                  );
                })}
              </div>

              {currentTask.result_summary && (
                <div className="rounded-lg border border-slate-800 bg-[#060B14] p-3 text-xs text-slate-300 space-y-1 overflow-x-auto">
                  <div className="font-semibold text-slate-200">Execution Summary</div>
                  <p className="whitespace-pre-wrap leading-relaxed text-[11px] break-words">
                    {currentTask.result_summary}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
