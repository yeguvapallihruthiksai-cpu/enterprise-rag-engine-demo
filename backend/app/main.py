from __future__ import annotations

from fastapi import FastAPI

from app.models import RetrieveRequest
from app.services.retrieval import RetrievalService

app = FastAPI(title="Enterprise RAG Retrieval API", version="1.0.0")
retrieval_service = RetrievalService()


@app.get("/health")
def health_check() -> dict[str, bool]:
    return {"ok": True}


@app.post("/retrieve")
def retrieve(request: RetrieveRequest):
    return retrieval_service.retrieve(query=request.query, locale=request.locale)


@app.post("/admin/reindex")
def reindex():
    global retrieval_service
    retrieval_service = RetrievalService()
    return {"ok": True, "message": "Corpus reloaded"}

