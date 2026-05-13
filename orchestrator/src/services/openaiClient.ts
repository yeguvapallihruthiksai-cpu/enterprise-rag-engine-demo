import OpenAI from "openai";
import type { RetrievalResponse } from "./retrieval.js";

function fallbackAnswer(question: string, retrieval: RetrievalResponse) {
  const sourceTitles = retrieval.sources.map((source) => source.title).join(", ");
  return [
    `Question: ${question}`,
    `The retrieval pipeline surfaced ${retrieval.sources.length} relevant sources, with strongest evidence from ${sourceTitles}.`,
    retrieval.answerContext,
    "A production deployment would feed this evidence into an LLM with source-grounded prompting and answer validation."
  ].join(" ");
}

export async function synthesizeAnswer(question: string, retrieval: RetrievalResponse, history: string[]) {
  if (!process.env.OPENAI_API_KEY) {
    return fallbackAnswer(question, retrieval);
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    input: [
      {
        role: "system",
        content:
          "You are an enterprise academic assistant. Use only the provided evidence, cite the themes clearly, and keep the response concise."
      },
      {
        role: "user",
        content: [
          `Question: ${question}`,
          `Conversation history: ${history.join(" | ") || "none"}`,
          `Evidence: ${retrieval.answerContext}`
        ].join("\n")
      }
    ]
  });

  return response.output_text || fallbackAnswer(question, retrieval);
}

