from typing import List, Dict, Any

DEFAULT_MODELS_SEED: List[Dict[str, Any]] = [
    {
        "id": "qwen2.5-vl:7b",
        "name": "Qwen 2.5 Vision-Language (7B Instruct)",
        "provider": "ollama",
        "capability": "VISION",
        "context_length": 32768,
        "quantization": "Q4_K_M",
        "vram_required_gb": 5.8,
        "is_active": True,
        "is_default": True,
        "description": "High-precision multimodal reasoning for scanned inspection reports, P&ID diagrams, and technical drawings."
    },
    {
        "id": "qwen2.5-coder:7b",
        "name": "Qwen 2.5 Coder (7B Instruct)",
        "provider": "ollama",
        "capability": "CODE",
        "context_length": 32768,
        "quantization": "Q4_K_M",
        "vram_required_gb": 5.2,
        "is_active": True,
        "is_default": False,
        "description": "Specialized open-weight coding model for industrial data processing, calculation scripts, and sandbox verification."
    },
    {
        "id": "deepseek-r1:7b",
        "name": "DeepSeek R1 Distill Qwen (7B)",
        "provider": "ollama",
        "capability": "REASONING",
        "context_length": 32768,
        "quantization": "Q4_K_M",
        "vram_required_gb": 5.6,
        "is_active": True,
        "is_default": False,
        "description": "Deep chain-of-thought reasoning for safety compliance analysis, risk matrices, and approval note synthesis."
    },
    {
        "id": "llama3.2:3b",
        "name": "Llama 3.2 (3B Instruct)",
        "provider": "ollama",
        "capability": "GENERAL",
        "context_length": 16384,
        "quantization": "Q4_K_M",
        "vram_required_gb": 2.8,
        "is_active": True,
        "is_default": False,
        "description": "Lightweight on-premise model for high-throughput summarization, metadata extraction, and quick query answering."
    }
]
