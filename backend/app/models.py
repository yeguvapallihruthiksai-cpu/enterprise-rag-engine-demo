from __future__ import annotations

from pydantic import BaseModel, Field


class Document(BaseModel):
    id: str
    title: str
    language: str
    topic: str
    content: str


class RetrieveRequest(BaseModel):
    query: str = Field(min_length=3)
    locale: str = "en-US"


class RetrievedDocument(BaseModel):
    id: str
    title: str
    language: str
    topic: str
    score: float
    excerpt: str


class RetrieveResponse(BaseModel):
    language: str
    confidence: float
    answerContext: str
    sources: list[RetrievedDocument]

