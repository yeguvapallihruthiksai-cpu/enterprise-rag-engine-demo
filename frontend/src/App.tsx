import { useState } from "react";
import { SourceList, type SourceItem } from "./components/SourceList";

interface ChatResponse {
  answer: string;
  confidence: number;
  language: string;
  suggestedFollowUps: string[];
  sources: SourceItem[];
}

const INITIAL_QUESTION = "How can a multilingual academic chatbot improve answer quality for university users?";

export default function App() {
  const [question, setQuestion] = useState(INITIAL_QUESTION);
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function askQuestion() {
    setLoading(true);
    try {
      const apiResponse = await fetch("http://localhost:8090/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, locale: "en-US" })
      });
      const payload = (await apiResponse.json()) as ChatResponse;
      setResponse(payload);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">Enterprise RAG Engine</p>
        <h1>Explainable, multilingual retrieval with a TypeScript orchestration layer.</h1>
        <p className="hero-copy">
          This demo recreates a production-style RAG flow with separate retrieval and answer synthesis services,
          source transparency, and serverless deployment patterns.
        </p>
      </header>

      <main className="dashboard">
        <section className="query-card">
          <label htmlFor="question">Ask the academic assistant</label>
          <textarea
            id="question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            rows={6}
          />
          <button className="primary-button" onClick={askQuestion} disabled={loading}>
            {loading ? "Retrieving..." : "Run RAG Workflow"}
          </button>
        </section>

        <section className="response-card">
          <div className="response-header">
            <h2>Answer</h2>
            <span className="confidence-pill">
              {response ? `${Math.round(response.confidence * 100)}% confidence` : "Awaiting query"}
            </span>
          </div>

          {response ? (
            <>
              <p className="answer-text">{response.answer}</p>
              <div className="followups">
                {response.suggestedFollowUps.map((item) => (
                  <span key={item} className="followup-pill">
                    {item}
                  </span>
                ))}
              </div>
              <SourceList sources={response.sources} />
            </>
          ) : (
            <p className="placeholder">Run a question to inspect retrieved sources and generated reasoning.</p>
          )}
        </section>
      </main>
    </div>
  );
}

