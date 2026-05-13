from __future__ import annotations

from app.config import settings
from app.models import RetrieveResponse
from app.services.vector_store import LocalVectorStore, PineconeVectorStore


def build_store():
    if settings.pinecone_api_key and settings.pinecone_index and settings.pinecone_environment:
        return PineconeVectorStore(
            api_key=settings.pinecone_api_key,
            index_name=settings.pinecone_index,
            environment=settings.pinecone_environment,
        )
    return LocalVectorStore.from_json_file(str(settings.corpus_path))


class RetrievalService:
    def __init__(self) -> None:
        self.store = build_store()

    def retrieve(self, query: str, locale: str) -> RetrieveResponse:
        sources = self.store.search(query=query, locale=locale, top_k=settings.top_k)
        language = locale.split("-")[0].lower()
        answer_context = " ".join(f"[{item.title}] {item.excerpt}" for item in sources)
        confidence = round(sum(item.score for item in sources) / max(len(sources), 1), 4)

        return RetrieveResponse(
            language=language,
            confidence=confidence,
            answerContext=answer_context,
            sources=sources,
        )

