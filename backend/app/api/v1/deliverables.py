import os
from pathlib import Path
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.config import settings

router = APIRouter(prefix="/deliverables", tags=["Deliverables Download"])

@router.get("/download/{filename}")
async def download_file(filename: str):
    # Search in order: generated files -> uploaded files -> demo data
    search_dirs = [
        Path(settings.GENERATED_DIR),
        Path(settings.UPLOAD_DIR),
        Path(settings.DEMO_DATA_DIR),
    ]
    file_path = None
    for d in search_dirs:
        if not d.exists():
            continue
        # Direct match
        candidate = d / filename
        if candidate.exists():
            file_path = candidate
            break
        # Uploaded files are stored as {user_id}_{filename}
        for p in d.glob(f"*_{filename}"):
            file_path = p
            break
        if file_path:
            break

    if not file_path:
        raise HTTPException(status_code=404, detail="Requested file not found.")

    name_lower = filename.lower()
    media_type = "application/octet-stream"
    if name_lower.endswith(".docx"):
        media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    elif name_lower.endswith(".pptx"):
        media_type = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    elif name_lower.endswith(".xlsx"):
        media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    elif name_lower.endswith(".pdf"):
        media_type = "application/pdf"
    elif name_lower.endswith(".csv"):
        media_type = "text/csv"
    elif name_lower.endswith(".txt"):
        media_type = "text/plain"

    return FileResponse(
        path=str(file_path),
        filename=filename,
        media_type=media_type
    )
