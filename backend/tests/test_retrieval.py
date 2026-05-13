from __future__ import annotations

import unittest

from app.services.vector_store import LocalVectorStore
from app.models import Document


class LocalVectorStoreTests(unittest.TestCase):
    def setUp(self) -> None:
        self.store = LocalVectorStore(
            [
                Document(
                    id="1",
                    title="Serverless Education Systems",
                    language="en",
                    topic="cloud",
                    content="AWS Lambda scales academic portals without idle servers.",
                ),
                Document(
                    id="2",
                    title="Busqueda multilingue",
                    language="es",
                    topic="retrieval",
                    content="Los modelos RAG multilingues mejoran la relevancia y las citas.",
                ),
            ]
        )

    def test_prefers_matching_language_when_scores_are_close(self):
        results = self.store.search("Como mejorar la relevancia de un chatbot RAG", "es-ES", 2)
        self.assertEqual(results[0].language, "es")

    def test_returns_requested_number_of_results(self):
        results = self.store.search("serverless academic systems", "en-US", 1)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].id, "1")


if __name__ == "__main__":
    unittest.main()
