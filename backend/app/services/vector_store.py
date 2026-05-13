from __future__ import annotations

from collections import Counter
from math import sqrt
from typing import Iterable
import json

from app.models import Document, RetrievedDocument


def tokenize(text: str) -> list[str]:
    cleaned = "".join(char.lower() if char.isalnum() else " " for char in text)
    return [token for token in cleaned.split() if token]


def vectorize(tokens: Iterable[str]) -> Counter[str]:
    return Counter(tokens)


def cosine_similarity(left: Counter[str], right: Counter[str]) -> float:
    shared = set(left) & set(right)
    numerator = sum(left[token] * right[token] for token in shared)
    left_norm = sqrt(sum(value * value for value in left.values()))
    right_norm = sqrt(sum(value * value for value in right.values()))
    if not left_norm or not right_norm:
        return 0.0
    return numerator / (left_norm * right_norm)



class LocalVectorStore:
    def __init__(self, documents: list[Document]) -> None:
        self.documents = documents
        self.document_vectors = {
            document.id: vectorize(tokenize(f"{document.title} {document.topic} {document.content}"))
            for document in documents
        }

    @classmethod
    def from_json_file(cls, path: str) -> "LocalVectorStore":
        with open(path, "r", encoding="utf-8") as handle:
            raw_documents = json.load(handle)
        documents = [Document.model_validate(item) for item in raw_documents]
        return cls(documents)

    def search(self, query: str, locale: str, top_k: int) -> list[RetrievedDocument]:
        query_vector = vectorize(tokenize(query))
        requested_language = locale.split("-")[0].lower()
        ranked: list[tuple[float, Document]] = []

        for document in self.documents:
            score = cosine_similarity(query_vector, self.document_vectors[document.id])
            if document.language.lower() == requested_language:
                score += 0.08
            ranked.append((score, document))

        ranked.sort(key=lambda item: item[0], reverse=True)

        return [
            RetrievedDocument(
                id=document.id,
                title=document.title,
                language=document.language,
                topic=document.topic,
                score=round(score, 4),
                excerpt=document.content[:180] + ("..." if len(document.content) > 180 else ""),
            )
            for score, document in ranked[:top_k]
        ]


class PineconeVectorStore:
    def __init__(self, api_key: str, index_name: str, environment: str) -> None:
        self.api_key = api_key
        self.index_name = index_name
        self.environment = environment

    def search(self, query: str, locale: str, top_k: int) -> list[RetrievedDocument]:
        raise NotImplementedError(
            "This demo intentionally ships with a local vector store. Replace this adapter with a Pinecone client in production."
        )
