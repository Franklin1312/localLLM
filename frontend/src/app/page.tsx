"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Paperclip,
  Cpu,
  FileText,
  Presentation,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Bot,
  User,
  Zap,
  Activity,
  Image as ImageIcon
} from "lucide-react";
import { api } from "@/lib/api";
import { Task, AgentStep, GeneratedFile } from "@/types";
import PidOverlayViewer from "@/components/PidOverlayViewer";

export default function AIWorkbenchPage() {
  const [prompt, setPrompt] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [routingPreview, setRoutingPreview] = useState<any>(null);
  
  // Local session state so we don't load historical tasks (clean slate for demos)
  const [sessionTasks, setSessionTasks] = useState<Task[]>([]);
  const [showPidViewer, setShowPidViewer] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever tasks change
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessionTasks, currentTask]);

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
    }, 400);
    return () => clearTimeout(timer);
  }, [prompt, selectedFile]);

  const handleAutoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleExecute = async () => {
    if (!prompt.trim() && !selectedFile) return;
    if (isExecuting) return; // prevent double-submit
    
    const taskPrompt = prompt;
    const fileToAttach = selectedFile;
    
    setPrompt("");
    setSelectedFile(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    setIsExecuting(true);
    const formData = new FormData();
    formData.append("prompt", taskPrompt || (fileToAttach ? `Analyze attached file: ${fileToAttach.name}` : ""));
    formData.append("task_type", "AUTO"); 
    
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
            setSessionTasks(prev => [...prev, updated]);
            setCurrentTask(null);
          }
        } catch (e) {
          clearInterval(pollInterval);
          setIsExecuting(false);
          setCurrentTask(null);
        }
      }, 1000);
    } catch (err: any) {
      setIsExecuting(false);
      setCurrentTask(null);
      alert("Failed to connect to backend server.");
    }
  };

  const loadDemo = (demoId: number) => {
    let p = "";
    let f: File | null = null;
    
    if (demoId === 1) {
      p = "Analyze this scanned inspection report for Heat Exchanger 11-HX-401, cross-reference findings with MRPL Refinery Safety SOP-08, identify critical structural hazards, and synthesize an executive Approval Note and board presentation for turnaround retubing.";
      f = new File(["dummy content"], "MRPL_HX401_Inspection_Report.pdf", { type: "application/pdf" });
    } else if (demoId === 2) {
      p = "Process the refinery pump vibration and bearing temperature log 'pump_p102_telemetry.csv', apply ISO 10816-3 vibration severity thresholds in Python sandbox, identify operational anomaly hours, and generate an Excel analysis workbook.";
      f = new File(["dummy content"], "pump_p102_telemetry.csv", { type: "text/csv" });
    } else if (demoId === 3) {
      p = "Perform a first-principles thermodynamic root cause analysis for why the crude preheat train heat exchanger efficiency dropped 18% over the last quarter. Identify failure mechanisms, apply HAZOP methodology, and recommend corrective actions with risk matrix assessment.";
      f = new File(["dummy content"], "Shift_Handover_Inspection_Notes.txt", { type: "text/plain" });
    } else if (demoId === 4) {
      p = "Search the SOP database for emergency shutdown procedures regarding the crude distillation unit during a power failure, and summarize the key safety steps.";
      f = new File(["dummy content"], "MRPL_SOP_08_Pressure_Vessel_Safety.txt", { type: "text/plain" });
    }
    
    setPrompt(p);
    setSelectedFile(f);
    setTimeout(() => handleAutoResize(), 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleExecute();
    }
  };

  const ThoughtProcess = ({ steps, isLive }: { steps: AgentStep[], isLive: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);
    if (!steps || steps.length === 0) return null;
    return (
      <div className="mt-3 mb-4 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden text-sm max-w-2xl">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 font-medium"
        >
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-gray-500" />
            <span>Agent Thought Process</span>
            {isLive && <RefreshCw className="h-3 w-3 animate-spin text-blue-500 ml-2" />}
          </div>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {isOpen && (
          <div className="p-4 space-y-4 border-t border-gray-100 bg-white">
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex flex-col items-center mt-1">
                  <div className={`h-2 w-2 rounded-full ${
                    step.status === 'COMPLETED' ? 'bg-green-500' :
                    step.status === 'RUNNING' ? 'bg-blue-500 animate-pulse' :
                    step.status === 'FAILED' ? 'bg-red-500' : 'bg-gray-300'
                  }`} />
                  {idx < steps.length - 1 && <div className="w-px h-full bg-gray-200 my-1" />}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800 text-xs uppercase tracking-wider">{step.agent_name}</span>
                    {step.tool_called && (
                      <span className="text-[10px] font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 border border-gray-200">
                        {step.tool_called}
                      </span>
                    )}
                  </div>
                  {step.thought_trace && (
                    <div className="text-gray-600 text-xs font-mono bg-gray-50 p-2 rounded whitespace-pre-wrap border border-gray-100">
                      {step.thought_trace}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)] relative bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden font-sans">
      
      {/* Left Chat Area */}
      <div className="flex-1 flex flex-col border-r border-gray-200 min-h-0">
        
        {/* Chat Header */}
        <header className="flex items-center justify-between px-4 py-3 bg-gray-50/80 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-black rounded-md flex items-center justify-center">
              <SparklesIcon className="h-3 w-3 text-white" />
            </div>
            <span className="font-bold text-gray-800 text-sm tracking-wide">Sovereign AI Chat</span>
          </div>
          
          <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-full border border-gray-200 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
            <span className="text-[10px] font-semibold text-gray-700 tracking-wide">AIR-GAPPED MODE</span>
            <div className="flex items-center gap-1.5 ml-1.5 pl-1.5 border-l border-gray-200">
              <span className="relative flex h-1.5 w-1.5">
                {isExecuting && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
              </span>
              <span className="text-[9px] font-mono text-gray-500">
                {isExecuting ? "INTERCEPTING" : "SECURE"}
              </span>
            </div>
          </div>
        </header>

        {/* Chat Log */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {sessionTasks.length === 0 && !currentTask && (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-70">
                <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-200">
                  <Bot className="h-8 w-8 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Clean Workspace</h2>
                <p className="text-gray-500 max-w-sm">No historical data loaded. Select a demo from the right panel to begin.</p>
              </div>
            )}

            {/* Render Session Tasks */}
            {sessionTasks.map((task) => (
              <div key={task.id} className="space-y-6">
                <div className="flex justify-end">
                  <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-tr-sm px-5 py-3 max-w-[80%] shadow-sm">
                    {task.attached_filename && (
                       <a
                         href={api.getDownloadUrl(task.attached_filename)}
                         download={task.attached_filename}
                         className="flex items-center gap-2 mb-2 p-2 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                       >
                          <Paperclip className="h-4 w-4 text-gray-500 group-hover:text-blue-500" />
                          <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600 flex-1">{task.attached_filename}</span>
                          <Download className="h-3 w-3 text-gray-400 group-hover:text-blue-500" />
                       </a>
                    )}
                    <p className="text-[15px] whitespace-pre-wrap">{task.prompt}</p>
                  </div>
                </div>

                <div className="flex gap-4 max-w-[95%]">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-black flex items-center justify-center mt-1 shadow-sm">
                    <SparklesIcon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <ThoughtProcess steps={task.steps} isLive={false} />
                    
                    {task.result_summary && (
                      <div className="prose prose-sm max-w-none text-gray-800">
                        <p className="whitespace-pre-wrap leading-relaxed">{task.result_summary}</p>
                      </div>
                    )}

                    {/* Generated file download cards */}
                    {task.generated_files && task.generated_files.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {task.generated_files.map((gf: any) => (
                          <a
                            key={gf.id}
                            href={api.getDownloadUrl(gf.filename)}
                            download={gf.filename}
                            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-colors group shadow-sm"
                          >
                            {gf.filename.endsWith('.docx') && <FileText className="h-4 w-4 text-blue-500" />}
                            {gf.filename.endsWith('.pptx') && <Presentation className="h-4 w-4 text-orange-500" />}
                            {gf.filename.endsWith('.xlsx') && <FileSpreadsheet className="h-4 w-4 text-green-500" />}
                            {!gf.filename.match(/\.(docx|pptx|xlsx)$/) && <Download className="h-4 w-4 text-gray-500" />}
                            <span className="text-xs font-medium text-gray-700 group-hover:text-green-700 max-w-[180px] truncate">{gf.filename}</span>
                            <Download className="h-3 w-3 text-gray-400 group-hover:text-green-600" />
                          </a>
                        ))}
                      </div>
                    )}

                    {task.assigned_model && (
                      <div className="mt-3 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-mono text-gray-500">
                          ✨ Executed by {task.assigned_model}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-mono text-gray-500">
                          ⏱️ {task.execution_time_seconds}s
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Current Live Task */}
            {currentTask && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-tr-sm px-5 py-3 max-w-[80%] shadow-sm">
                    {currentTask.attached_filename && (
                       <a
                         href={api.getDownloadUrl(currentTask.attached_filename)}
                         download={currentTask.attached_filename}
                         className="flex items-center gap-2 mb-2 p-2 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                       >
                          <Paperclip className="h-4 w-4 text-gray-500 group-hover:text-blue-500" />
                          <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600 flex-1">{currentTask.attached_filename}</span>
                          <Download className="h-3 w-3 text-gray-400 group-hover:text-blue-500" />
                       </a>
                    )}
                    <p className="text-[15px] whitespace-pre-wrap">{currentTask.prompt}</p>
                  </div>
                </div>

                <div className="flex gap-4 max-w-[95%]">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-black flex items-center justify-center mt-1 shadow-sm">
                    {isExecuting ? <RefreshCw className="h-4 w-4 text-white animate-spin" /> : <SparklesIcon className="h-4 w-4 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0 w-full">
                    <ThoughtProcess steps={currentTask.steps} isLive={isExecuting} />
                    
                    {!currentTask.result_summary && isExecuting && (
                      <div className="flex items-center gap-2 text-gray-400 mt-2">
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    )}

                    {currentTask.result_summary && (
                      <div className="prose prose-sm max-w-none text-gray-800">
                        <p className="whitespace-pre-wrap leading-relaxed">{currentTask.result_summary}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </main>

        {showPidViewer && (
          <div className="mx-6 mb-28">
            <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-md bg-white">
              <PidOverlayViewer />
            </div>
          </div>
        )}

        {/* Input Bar */}
        <footer className="flex-shrink-0 border-t border-gray-100 bg-white px-4 pb-4 pt-3">
          <div className="max-w-3xl mx-auto relative">
            {routingPreview && (
              <div className="absolute -top-10 left-0 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm flex items-center gap-2">
                <Zap className="h-3 w-3 text-orange-500" />
                <span className="text-[10px] font-mono font-medium text-gray-600">
                  Auto-routing to <span className="text-gray-900 font-bold">{routingPreview.selected_model}</span>
                </span>
              </div>
            )}
            {selectedFile && (
              <div className="absolute -top-10 right-0 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm flex items-center gap-2">
                <Paperclip className="h-3 w-3 text-blue-500" />
                <span className="text-xs font-medium text-gray-700 truncate max-w-[200px]">{selectedFile.name}</span>
                <button onClick={() => setSelectedFile(null)} className="ml-1 text-gray-400 hover:text-red-500">✕</button>
              </div>
            )}
            <div className="relative flex items-end gap-2 bg-white border border-gray-300 rounded-2xl shadow-sm p-2 focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all">
              <label className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-xl hover:bg-gray-100 cursor-pointer text-gray-500 transition-colors">
                <Paperclip className="h-5 w-5" />
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </label>
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  handleAutoResize();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask Sovereign AI to analyze documents, write code, or draft reports..."
                className="flex-1 max-h-48 min-h-[40px] bg-transparent border-0 focus:ring-0 resize-none py-2.5 px-2 text-[15px] text-gray-900 placeholder-gray-400"
                rows={1}
              />
              <button
                onClick={handleExecute}
                disabled={isExecuting || (!prompt.trim() && !selectedFile)}
                className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-xl transition-colors ${
                  prompt.trim() || selectedFile
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="text-center mt-2">
              <span className="text-[11px] text-gray-400">Sovereign AI can make mistakes. Verify important structural engineering data.</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Right Side Demo Panel */}
      <div className="w-80 bg-gray-50/50 hidden lg:flex flex-col border-l border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-800 text-sm">Demo Scenarios</h3>
          <p className="text-[11px] text-gray-500 mt-1">Click to populate the chat input</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <button onClick={() => loadDemo(1)} className="w-full text-left p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-sm transition-all group">
            <div className="flex items-center gap-2 mb-1.5">
              <ImageIcon className="h-4 w-4 text-orange-500 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-gray-800 text-[13px]">Demo 1: Vision OCR</div>
            </div>
            <div className="text-[11px] text-gray-500 leading-tight">Analyze HX-401 inspection report and draft an approval note.</div>
          </button>
          
          <button onClick={() => loadDemo(2)} className="w-full text-left p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-sm transition-all group">
            <div className="flex items-center gap-2 mb-1.5">
              <Activity className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-gray-800 text-[13px]">Demo 2: Code Sandbox</div>
            </div>
            <div className="text-[11px] text-gray-500 leading-tight">Process pump_p102_telemetry.csv and apply ISO 10816 thresholds.</div>
          </button>
          
          <button onClick={() => loadDemo(3)} className="w-full text-left p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-sm transition-all group">
            <div className="flex items-center gap-2 mb-1.5">
              <Cpu className="h-4 w-4 text-purple-500 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-gray-800 text-[13px]">Demo 3: Reasoning</div>
            </div>
            <div className="text-[11px] text-gray-500 leading-tight">Root cause analysis + HAZOP for heat exchanger efficiency drop.</div>
          </button>
          
          <button onClick={() => loadDemo(4)} className="w-full text-left p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-sm transition-all group">
            <div className="flex items-center gap-2 mb-1.5">
              <FileText className="h-4 w-4 text-green-500 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-gray-800 text-[13px]">Demo 4: Retrieval</div>
            </div>
            <div className="text-[11px] text-gray-500 leading-tight">Search for emergency shutdown procedures during power failure.</div>
          </button>
        </div>
      </div>
      
    </div>
  );
}

// Simple internal icon
function SparklesIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}
