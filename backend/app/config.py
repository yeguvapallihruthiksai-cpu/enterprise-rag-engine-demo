from __future__ import annotations

from pathlib import Path
import os


class Settings:
    def __init__(self) -> None:
        default_path = Path(__file__).resolve().parents[2] / "data" / "academic_corpus.json"
        self.corpus_path = Path(os.getenv("RETRIEVAL_CORPUS_PATH", default_path))
        self.top_k = int(os.getenv("RETRIEVAL_TOP_K", "3"))
        self.pinecone_api_key = os.getenv("PINECONE_API_KEY", "")
        self.pinecone_index = os.getenv("PINECONE_INDEX", "")
        self.pinecone_environment = os.getenv("PINECONE_ENVIRONMENT", "")


settings = Settings()

