# SovereignAI Workbench — SIH 26117
### Sovereign On-Premise Agentic AI Workbench using Open-Weight Multimodal LLMs for Confidential Industrial Work

[![Air-Gap Status](https://img.shields.io/badge/Air--Gap-STRICT__ISOLATED-green.svg)]()
[![External API Calls](https://img.shields.io/badge/External%20Calls-0.00%20(PROVEN)-brightgreen.svg)]()
[![SIH Problem Statement](https://img.shields.io/badge/SIH%202026-PS--26117-blue.svg)]()
[![Organization](https://img.shields.io/badge/Organization-MRPL%20Refinery-orange.svg)]()
[![Python](https://img.shields.io/badge/Python-3.11%20%7C%203.13-blue.svg)]()
[![Next.js](https://img.shields.io/badge/Next.js-14%20(App%20Router)-black.svg)]()
[![Tests](https://img.shields.io/badge/Tests-7%2F7%20Passed-brightgreen.svg)]()
[![Compliance](https://img.shields.io/badge/Compliance-DPDP%20Act%202023%20%7C%20CERT--In-navy.svg)]()

---

## Executive Summary

**Refineries, PSUs, defense manufacturing units, and government institutions** handle massive amounts of highly sensitive knowledge work: Piping & Instrumentation Diagrams (P&IDs), ultrasonic inspection reports, board memos, plant safety SOPs, financial negotiations, and proprietary automation scripts.

**None of this confidential data can be transmitted to cloud AI APIs** (OpenAI, Anthropic, Google). Confidential industrial environments require on-premise, air-gapped processing to preserve data sovereignty and meet internal security policies.

**SovereignAI Workbench** is an on-premise, air-gapped agentic enterprise AI platform built for **Mangalore Refinery and Petrochemicals Limited (MRPL)**. It coordinates specialized open-weight models across multi-step autonomous workflows, executes code in isolated sandboxes, grounds findings against local engineering SOPs, and compiles official executive deliverables (`.docx`, `.pptx`, `.xlsx`) — with **mathematically and cryptographically verifiable ZERO outbound network calls**.

---

## Problem Statement Mapping (SIH 26117)

| Requirement in PS-26117 | SovereignAI Workbench Implementation | Status |
|---|---|---|
| **Multiple Open-Weight Models** | Qwen2.5-VL (Vision), Qwen2.5-Coder (Code), DeepSeek-R1 (Reasoning), Llama-3.2 (Fast) | ✅ Implemented |
| **Dynamic Model Auto-Selection** | Heuristic & intent classifier routes tasks based on modality, file types, & VRAM requirements | ✅ Implemented |
| **Multi-Step Agent Workflows** | 5-agent DAG: Planner → Document/Vision → Knowledge (RAG) → Synthesizer → Verification (with retry) | ✅ Implemented |
| **Local Tool Execution** | Air-gapped OCR, Sandboxed Python Runner, File I/O, CSV Cell Editor, DOCX, PPTX, XLSX Generators | ✅ Implemented |
| **Multimodal Inputs** | Scanned inspection PDFs, equipment images, P&ID tag extraction, telemetry CSVs, JSON data | ✅ Implemented |
| **Local Knowledge Grounding** | Page-level hybrid RAG (BM25 + Semantic Embeddings) grounded on MRPL Safety SOP-08 | ✅ Implemented |
| **Real Deliverables** | Executive Approval Notes (`.docx`), Board Decks (`.pptx`), ISO-10816 Calculation Workbooks (`.xlsx`) | ✅ Implemented |
| **Sandboxed Code Execution** | Isolated sub-process sandbox with CPU/RAM quotas, timeout kills, and strict network blackholing | ✅ Implemented |
| **Provable Air-Gap (Zero Leaks)** | Real OS-level socket inspection via `psutil` + independent terminal verification (`netstat`/`tcpdump`) | ✅ Implemented |
| **Prompt-Injection Defense** | Input sanitization layer neutralizing role overrides, exfiltration patterns, and shell escapes | ✅ Implemented |
| **Enterprise Integration Stubs** | Read-only connectors for SAP S/4HANA PM, DCS/SCADA Historian, and DMS | ✅ Implemented |

---

## Competitive Differentiation Matrix

| Capability Dimension | Public Cloud AI (OpenAI / Claude / Gemini) | Generic Local Chatbots (LM Studio / OpenWebUI) | **SovereignAI Workbench (SIH 26117)** |
|---|---|---|---|
| **Air-Gap Compliance** | ❌ Violates on-premise policies (Data egresses to US cloud) | ⚠️ Runs locally, but lacks OS socket egress proof | ✅ **Strict on-premise with verifiable 0.00 byte OS socket watchdog** |
| **Multi-Model Orchestration** | ❌ Monolithic cloud API lock-in | ❌ Single model chat window; no automated routing | ✅ **Intent-based dynamic routing across 4 specialized open-weight models** |
| **Agentic Workflow & Retry** | ⚠️ Generic prompt wrappers; no domain retry loop | ❌ Simple conversational chatbot; no multi-step DAG | ✅ **5-Stage DAG with bounded Verification Agent retry & compliance gate** |
| **Official Deliverables** | ❌ Raw text/markdown snippets in chat window | ❌ Raw markdown text | ✅ **Formatted `.docx` Approval Notes, `.pptx` decks, & `.xlsx` spreadsheets** |
| **Multimodal P&ID & Drawings** | ❌ Confidential plant blueprints uploaded to cloud | ⚠️ Generic OCR without industrial tag parsing | ✅ **On-premise Vision extraction with visual bounding boxes & entity schemas** |
| **Code Execution Sandboxing** | ❌ Cloud-executed or un-sandboxed local execution | ❌ No isolated sandbox environment | ✅ **Subprocess sandbox with timeout kills, resource quotas & net isolation** |

---

## Industrial Deployment & IT/OT Network Segmentation Note

> **Architectural Assumption (Purdue Enterprise Reference Architecture — Level 3 / IT-DMZ):**  
> SovereignAI Workbench is designed to be deployed entirely within the **Refinery IT Security DMZ (Purdue Model Level 3/3.5)**. It sits between enterprise business systems (Level 4 ERP / Document Management) and operational historians (Level 3 SCADA / PI AF server replica).  
> 
> **Zero Plant OT Impact:** The system interfaces strictly via **one-way read-only data replication** from process historians and maintenance databases. **No incoming or outgoing network access is required to the sensitive plant OT control network (Levels 0–2 DCS/PLC/SIS)**, ensuring refinery physical safety is never compromised.

---

## System Architecture

```
                                  AIR-GAPPED PERIMETER (ZERO EGRESS)
 ┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
 │                                                                                                  │
 │   Next.js 14 Web Studio (Client) ◄──► FastAPI Gateway & WebSocket Server (Port 8000)             │
 │                                             │                                                    │
 │          ┌──────────────────────────────────┼──────────────────────────────────┐                 │
 │          ▼                                  ▼                                  ▼                 │
 │  ┌──────────────────────┐        ┌──────────────────────┐        ┌────────────────────────────┐  │
 │  │ Model Router Engine  │        │ Agentic DAG Engine   │        │ Security Watchdog Guard    │  │
 │  │                      │        │                      │        │                            │  │
 │  │ • Task Classification│        │ 1. Planner Agent     │        │ • OS-Level Socket Monitor  │  │
 │  │ • Modality Detection │        │ 2. Document/VL Agent │        │ • PID Tree Egress Scanner  │  │
 │  │ • VRAM Allocation    │        │ 3. Knowledge Agent   │        │ • Prompt Injection Defense │  │
 │  │ • Model Hot-Swap     │        │ 4. Synthesizer Agent │        │ • Cryptographic Audit Log  │  │
 │  │                      │        │ 5. Verification Agent│        │ • External Calls: 0.00     │  │
 │  └──────────┬───────────┘        │    (Feedback Retry)  │        └────────────────────────────┘  │
 │             │                    └──────────┬───────────┘                                        │
 │             ▼                               │                                                    │
 │  ┌──────────────────────┐                   ▼                                                    │
 │  │ Local Model Registry │        ┌────────────────────────────────────────────────────────────┐  │
 │  │                      │        │ Enterprise Tool Registry (Air-Gapped)                      │  │
 │  │ • Qwen2.5-VL:7b      │        │                                                            │  │
 │  │ • Qwen2.5-Coder:7b   │        │ • ocr_document_extractor (Local PDF/Drawing Parser)       │  │
 │  │ • DeepSeek-R1:7b     │        │ • python_sandbox_runner  (Isolated Process Box)            │  │
 │  │ • Llama-3.2:3b       │        │ • file_reader_tool & file_writer_tool (Workspace I/O)      │  │
 │  │ (Ollama / vLLM local)│        │ • file_csv_editor        (In-Place Spreadsheet Updating)   │  │
 │  └──────────────────────┘        │ • docx_approval_generator (MRPL Approval Notes)            │  │
 │                                  │ • pptx_deck_generator    (Board Briefing Slides)           │  │
 │                                  │ • xlsx_sheet_generator   (ISO-10816 Telemetry Analysis)    │  │
 │                                  │ • local_knowledge_retriever (Hybrid BM25 + Vector RAG)     │  │
 │                                  └────────────────────────────────────────────────────────────┘  │
 └──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Technical Specifications & Architectural Decisions

### 1. Model Concurrency & VRAM Feasibility Strategy
* **Physical Execution:** Sequential Hot-Swap via Ollama `keep_alive=30s` (models unload after inactivity).
* **Quantization:** Standardized on 4-bit quantized GGUF (`Q4_K_M`), requiring ~4.5–5.5 GB VRAM per 7B model.
* **Hardware Profile:**
  * **Mid-range GPU (16–24 GB, e.g., RTX 3090/4090):** 2 models fit simultaneously in memory.
  * **Enterprise GPU (40–80 GB, e.g., A100/H100):** All 4 models persist in VRAM for zero-latency switching.
  * **Single-GPU / Demo Environment:** Fast hot-swap switches between models in <8 seconds with deterministic fallback.

### 2. Open-Weight Model Licensing & Deployment Safety
All selected models comply with defense/PSU internal commercial deployment:
| Model | Parameters | License | PSU/Enterprise Deployment Status |
|---|---|---|---|
| `qwen2.5-vl:7b` | 7 Billion | **Apache 2.0** | ✅ 100% Unrestricted commercial & sovereign deployment |
| `qwen2.5-coder:7b` | 7 Billion | **Apache 2.0** | ✅ 100% Unrestricted commercial & sovereign deployment |
| `deepseek-r1:7b` | 7 Billion | **MIT License** | ✅ 100% Open commercial & research deployment |
| `llama-3.2:3b` | 3 Billion | **Llama 3.2 Community** | ✅ Free for internal PSU use (No cloud telemetry) |

### 3. Handwriting & P&ID Recognition Architecture
* **Clean printed documents:** Native parser (`pypdf`) for deterministic, high-speed text extraction.
* **Handwritten notes & P&ID Drawings:** Vision-Language Model (`Qwen2.5-VL`) as the primary extraction pipeline.
* **P&ID Scope Definition:** Full ISA 5.1 symbol reasoning is research-grade. SovereignAI Workbench defines a bounded, demoable scope: extracting **equipment tags (HX-401, P-102A)**, **line IDs**, **pressure/temperature ratings**, and **instrument loops** as structured JSON.

### 4. Verification Agent Feedback & Retry Loop
Unlike single-pass chatbots, SovereignAI includes a **bounded retry loop**:
1. Synthesizer drafts the approval note or code.
2. **Verification Agent** audits the draft against the retrieved SOP-08 clauses and numerical measurements.
3. If a mandatory clause or citation is missing, the Verification Agent **rejects the draft and triggers re-synthesis with corrective instructions** before producing the final deliverable.

### 5. Independent Zero-Egress Verification Methodology
To prove zero outbound network egress to evaluators:
1. **In-App Real-Time Telemetry:** `psutil` scans the application PID tree and verifies 0 external IP connections.
2. **Independent Host Verification (Terminal):**
   ```bash
   # Windows PowerShell
   netstat -ano | findstr ESTABLISHED
   # Linux / Unix
   ss -tunap | grep -v "127.0.0.1"
   ```
3. **Physical Isolation:** Unplug Ethernet or disable Wi-Fi entirely — the system continues 100% functional operation.

### 6. Security, Watermarking & Design Intent
* **Prompt Injection Defense (`sanitizer.py`):** Pre-processes untrusted document text to neutralize system-prompt override attempts, data exfiltration patterns, and shell-escape injections.
* **Content Watermarking:** All generated `.docx` approval notes include a mandatory disclaimer header and footer:
  `⚠ AI-DRAFTED DOCUMENT — REQUIRES HUMAN REVIEW & AUTHORISED SIGNATORY BEFORE OFFICIAL DISPATCH ⚠`
* **Design Intent:** SovereignAI Workbench is designed for confidential industrial environments requiring on-premise, air-gapped processing. It does not transmit any data externally. Organisations deploying this system should verify alignment with their own applicable data handling policies and regulations.

---

## Quickstart Guide

### Prerequisites
- Python 3.11+ (Python 3.13 supported)
- Node.js 18+ and npm
- (Optional) Ollama with models pulled: `ollama pull qwen2.5-vl:7b`

### Step 1 — Setup & Start Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
* Backend API: **http://127.0.0.1:8000**
* Interactive Swagger Docs: **http://127.0.0.1:8000/docs**

### Step 2 — Setup & Start Frontend Studio
```bash
cd frontend
npm install
npm run dev
```
* Studio UI: **http://localhost:3000**

### Step 3 — Pre-Air-Gap Weight Download (Optional for Live LLM)
Run once while connected to the network before air-gapping:
```bash
ollama pull qwen2.5-vl:7b
ollama pull qwen2.5-coder:7b
ollama pull deepseek-r1:7b
ollama pull llama3.2:3b
```
*(Note: If Ollama is offline, the deterministic sovereign fallback engine ensures all 3 demos execute smoothly without any errors).*

---

## Demo Walkthroughs for Judges

### ⭐ Demo 1 — Scanned Inspection PDF → Official Approval Note (`.docx`)
* **Scenario:** Lead Refinery Engineer analyzes an ultrasonic thickness report for Heat Exchanger HX-401.
* **Click:** **"⭐ Demo 1: Inspection → Approval Note (.docx)"** on the main studio workbench.
* **Execution:**
  1. Router selects `qwen2.5-vl:7b`.
  2. OCR extracts measured thickness: **3.18 mm** (nominal 5.00 mm).
  3. Knowledge RAG retrieves **MRPL SOP-08 §4.2** (Mandatory minimum: **3.50 mm**).
  4. Synthesizer drafts `MRPL_Approval_Note.docx` and `MRPL_Executive_Deck.pptx`.
  5. Verification Agent confirms citations and applies digital watermark.
* **Deliverables:** Download the generated `.docx` and `.pptx` directly from the UI.

### ⭐ Demo 2 — Telemetry Analytics → Sandboxed Code → Excel (`.xlsx`)
* **Scenario:** Mechanical Engineer analyzes vibration data for Crude Distillation Pump 11-P-102A.
* **Click:** **"⭐ Demo 2: Telemetry Analytics → Sandbox (.xlsx)"**.
* **Execution:**
  1. Router selects `qwen2.5-coder:7b`.
  2. Sandbox executes Python code analyzing RMS vibration against **ISO 10816-3 Zone C/D** alarm limits.
  3. Synthesizer generates formatted spreadsheet `MRPL_Equipment_Analysis.xlsx` with conditional alarm highlights.

### ⭐ Demo 3 — Dynamic Model Routing & Capability Verification
* **Scenario:** Proving multi-model adaptability without hardcoded model locking.
* **Click:** **"⭐ Demo 3: Auto-Model Selection"** or navigate to `/models`.
* **Test:** Enter multimodal, coding, reasoning, and summarization prompts and watch the router dynamically select the appropriate open-weight model with VRAM estimates.

---

## Automated Test Suite (7/7 Passed)

```bash
cd backend
python -m pytest tests/test_all.py -v
```

```text
tests/test_all.py::test_health_endpoint               PASSED  [ 14%]
tests/test_all.py::test_model_router_auto_selection   PASSED  [ 28%]
tests/test_all.py::test_sandbox_code_execution        PASSED  [ 42%]
tests/test_all.py::test_deliverable_generation        PASSED  [ 57%]
tests/test_all.py::test_security_telemetry            PASSED  [ 71%]
tests/test_all.py::test_file_io_tool                  PASSED  [ 85%]
tests/test_all.py::test_prompt_injection_sanitizer    PASSED  [100%]

======================= 7 passed in 32.16s =======================
```

---

## Role-Based Access Control (RBAC)

> [!CAUTION]
> **DEMO ACCOUNTS ONLY.** The credentials below are synthetic accounts for hackathon demonstration purposes. They are not real MRPL employee credentials, do not correspond to any actual MRPL personnel or systems, and must not be used outside of this demo environment.

| Role | Demo Account Email | Password | Allowed Capabilities |
|---|---|---|---|
| **ENGINEER** | `engineer@mrpl.co.in` *(demo only)* | `mrpl2026` | Inspection analysis, SOP retrieval, sandbox scripts, deliverable downloads |
| **MANAGER** | `manager@mrpl.co.in` *(demo only)* | `mrpl2026` | Approval note reviews, board deck generation, authorization sign-offs |
| **ADMIN** | `admin@mrpl.co.in` *(demo only)* | `admin2026` | Model registry management, tool dispatcher, network telemetry & audit logs |
| **ANALYST** | `analyst@mrpl.co.in` *(demo only)* | `mrpl2026` | Telemetry processing, spreadsheet analytics, data export |
| **DEVELOPER** | `developer@mrpl.co.in` *(demo only)* | `mrpl2026` | Sandbox API testing, tool registration, custom pipeline scripts |

---

## Application Navigation Map

| Route | View | Description |
|---|---|---|
| `http://localhost:3000/` | **AI Workbench Studio** | Main agentic execution studio with 1-click demo buttons |
| `http://localhost:3000/dashboard` | **Executive Dashboard** | System KPIs, VRAM utilization, active agent graphs |
| `http://localhost:3000/deliverables` | **Deliverables Gallery** | Download generated `.docx`, `.pptx`, and `.xlsx` artifacts |
| `http://localhost:3000/models` | **Model Registry** | Model cards, VRAM profiles, and live dry-run router tester |
| `http://localhost:3000/knowledge` | **Knowledge Base Hub** | SOP-08 viewer, chunk inspector, and hybrid semantic search |
| `http://localhost:3000/tools` | **Tool Registry** | Air-gapped tool catalog, execution logs, parameter schemas |
| `http://localhost:3000/security` | **Security Center** | **Live OS socket monitor proving EXTERNAL CALLS = 0** |
| `http://localhost:3000/audit` | **Audit Log Explorer** | Cryptographic SHA-256 tamper-evident provenance log |
| `http://localhost:3000/login` | **Sovereign Persona Login** | Instant RBAC persona switching for live judging |

---

## Team & Competition Details

* **Problem Statement:** SIH 26117
* **Title:** Sovereign On-Premise Agentic AI Workbench using Open-Weight Multimodal LLMs for Confidential Industrial Work
* **Organization:** Mangalore Refinery and Petrochemicals Limited (MRPL)
* **Ministry:** Ministry of Petroleum and Natural Gas
* **Theme:** Smart Automation (Software Edition)
* **Hackathon:** Smart India Hackathon 2026
