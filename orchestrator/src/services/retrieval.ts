export interface RetrievedSource {
  id: string;
  title: string;
  score: number;
  language: string;
  excerpt: string;
  topic: string;
}

export interface RetrievalResponse {
  language: string;
  confidence: number;
  answerContext: string;
  sources: RetrievedSource[];
}

const RETRIEVAL_API_URL = process.env.RETRIEVAL_API_URL ?? "http://localhost:8001";

export async function retrieveContext(question: string, locale: string): Promise<RetrievalResponse> {
  const response = await fetch(`${RETRIEVAL_API_URL}/retrieve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: question,
      locale
    })
  });

  if (!response.ok) {
    throw new Error(`Retrieval API failed with status ${response.status}`);
  }

  return (await response.json()) as RetrievalResponse;
}

