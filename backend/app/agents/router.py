from typing import Dict, Any, Optional
from app.config import settings

class ModelRouter:
    """
    Intelligent Open-Weight Model Router.
    Analyzes prompt intent, file extensions, MIME types, and computational requirements,
    dynamically selecting the optimal on-premise model.
    """
    @staticmethod
    def route_task(
        prompt: str,
        filename: Optional[str] = None,
        mime_type: Optional[str] = None
    ) -> Dict[str, Any]:
        p_lower = prompt.lower()
        file_lower = (filename or "").lower()

        # 0. General Conversation / Short Chat (detect first, before anything else)
        chat_keywords = [
            "hello", "hi ", "hey ", "how are you", "what can you do",
            "who are you", "what is this", "explain", "tell me about",
            "what do you", "can you", "help me understand", "good morning",
            "good evening", "thanks", "thank you", "okay", "ok", "sure",
            "yes", "no", "please", "what is", "what are", "how does",
            "why is", "why are", "i want to know", "describe",
        ]
        is_chat = (
            not filename and
            len(prompt.strip().split()) <= 20 and
            (
                len(prompt.strip()) < 80 or
                any(kw in p_lower for kw in chat_keywords)
            )
        )
        if is_chat:
            return {
                "task_type": "GENERAL_CHAT",
                "selected_model": settings.DEFAULT_FAST_MODEL,
                "model_capability": "GENERAL",
                "reasoning": f"Short conversational query detected. Routed to fast local model ({settings.DEFAULT_FAST_MODEL}) for direct response.",
                "estimated_vram_gb": 2.8
            }

        # 1. Multimodal Document / Inspection / P&ID Image Analysis
        is_multimodal = (
            file_lower.endswith((".pdf", ".png", ".jpg", ".jpeg", ".bmp", ".tiff", ".p&id", ".dwg")) or
            any(kw in p_lower for kw in ["scanned", "image", "diagram", "p&id", "drawing", "ocr", "inspection report", "visual", "photo", "handwritten", "ultrasonic thickness", "pitting"])
        )
        
        # 2. Code Generation & Sandbox Execution Task
        is_code = (
            file_lower.endswith((".py", ".csv", ".xlsx", ".json", ".sql", ".sh")) or
            any(kw in p_lower for kw in ["code", "python", "script", "pandas", "numpy", "calculate", "algorithm", "debug", "execute", "run code", "sandbox", "telemetry", "modbus", "openpyxl", "function to calculate", "degradation models", "heat transfer coefficient", "u-value", "u-values"])
        )
        
        # 3. Fast SOP Search & Summary vs Deep Reasoning
        is_fast_lookup = any(kw in p_lower for kw in [
            "lookup", "search knowledge", "quick summary", "definition of", "muster point",
            "summarize", "find document", "retrieval", "emergency evacuation", "testing frequency"
        ])
        
        # 4. Deep Reasoning / Approval Note / RCFA / First-Principles Proofs
        is_reasoning = any(kw in p_lower for kw in [
            "approval note", "board memo", "compliance audit",
            "root cause", "rcfa", "reasoning", "trade-off", "first-principles", "derivation",
            "equilibrium", "hazop", "thermodynamic", "hazard identification", "failure analysis",
            "risk matrix", "remaining life assessment", "postponement risk"
        ])
        
        has_file = bool(filename)
        
        if has_file and file_lower.endswith((".pdf", ".png", ".jpg", ".jpeg", ".bmp", ".tiff", ".p&id", ".dwg")):
            return {
                "task_type": "MULTIMODAL_DOC",
                "selected_model": settings.DEFAULT_VISION_MODEL,
                "model_capability": "VISION",
                "reasoning": f"Task involves multimodal attachment ({filename}). Auto-routed to high-precision local Vision-Language Model ({settings.DEFAULT_VISION_MODEL}).",
                "estimated_vram_gb": 5.8
            }
        elif has_file and file_lower.endswith((".py", ".csv", ".xlsx", ".json", ".sql", ".sh")):
            return {
                "task_type": "CODE_EXEC",
                "selected_model": settings.DEFAULT_CODE_MODEL,
                "model_capability": "CODE",
                "reasoning": f"Task involves code/tabular data attachment ({filename}). Auto-routed to coding model ({settings.DEFAULT_CODE_MODEL}).",
                "estimated_vram_gb": 5.2
            }
        elif is_fast_lookup and not is_reasoning:
            return {
                "task_type": "GENERAL",
                "selected_model": settings.DEFAULT_FAST_MODEL,
                "model_capability": "GENERAL",
                "reasoning": f"Fast SOP / knowledge retrieval & summary query. Auto-routed to high-throughput lightweight local model ({settings.DEFAULT_FAST_MODEL}).",
                "estimated_vram_gb": 2.8
            }
        elif is_reasoning:
            return {
                "task_type": "REPORT_GEN",
                "selected_model": settings.DEFAULT_REASONING_MODEL,
                "model_capability": "REASONING",
                "reasoning": f"Task requires multi-step engineering logic and deep reasoning proofs. Auto-routed to reasoning-distilled open model ({settings.DEFAULT_REASONING_MODEL}).",
                "estimated_vram_gb": 5.6
            }
        elif is_multimodal:
            return {
                "task_type": "MULTIMODAL_DOC",
                "selected_model": settings.DEFAULT_VISION_MODEL,
                "model_capability": "VISION",
                "reasoning": f"Task references visual/drawing artifacts. Auto-routed to Vision-Language Model ({settings.DEFAULT_VISION_MODEL}).",
                "estimated_vram_gb": 5.8
            }
        elif is_code:
            return {
                "task_type": "CODE_EXEC",
                "selected_model": settings.DEFAULT_CODE_MODEL,
                "model_capability": "CODE",
                "reasoning": f"Task requests algorithmic data processing/script execution. Auto-routed to specialized coding model ({settings.DEFAULT_CODE_MODEL}).",
                "estimated_vram_gb": 5.2
            }
        else:
            return {
                "task_type": "GENERAL",
                "selected_model": settings.DEFAULT_FAST_MODEL,
                "model_capability": "GENERAL",
                "reasoning": f"General knowledge / SOP lookup / quick summary query. Auto-routed to high-throughput lightweight local model ({settings.DEFAULT_FAST_MODEL}).",
                "estimated_vram_gb": 2.8
            }

model_router = ModelRouter()
