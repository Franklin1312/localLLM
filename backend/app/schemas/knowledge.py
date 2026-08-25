from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class DocumentChunkOut(BaseModel):
    id: str
    chunk_index: int
    page_number: int
    content: str
    metadata_json: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class DocumentOut(BaseModel):
    id: str
    collection_id: Optional[str] = None
    filename: str
    title: str
    file_type: str
    file_size_bytes: int
    total_pages: int
    uploaded_at: datetime
    chunk_count: Optional[int] = 0

    class Config:
        from_attributes = True

class KnowledgeCollectionOut(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    department: str
    created_at: datetime
    document_count: Optional[int] = 0

    class Config:
        from_attributes = True

class KnowledgeSearchRequest(BaseModel):
    query: str
    collection_name: Optional[str] = None
    top_k: int = 4

class KnowledgeSearchResult(BaseModel):
    document_id: str
    document_title: str
    filename: str
    chunk_id: str
    page_number: int
    content: str
    score: float
    source_citation: str
