import "dotenv/config";
import { createServer } from "node:http";
import { SessionStore } from "./services/sessionStore.js";
import { retrieveContext } from "./services/retrieval.js";
import { synthesizeAnswer } from "./services/openaiClient.js";

const sessions = new SessionStore();

function sendJson(response: import("node:http").ServerResponse, status: number, body: unknown) {
  response.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  response.end(JSON.stringify(body));
}

const server = createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }

  if (request.method === "GET" && request.url === "/health") {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === "POST" && request.url === "/api/chat") {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", async () => {
      try {
        const payload = JSON.parse(body) as { question: string; locale?: string; sessionId?: string };
        const sessionId = payload.sessionId ?? "demo-session";
        const history = sessions.getSession(sessionId).map((turn) => `${turn.role}: ${turn.content}`);
        const retrieval = await retrieveContext(payload.question, payload.locale ?? "en-US");
        const answer = await synthesizeAnswer(payload.question, retrieval, history);

        sessions.append(sessionId, { role: "user", content: payload.question });
        sessions.append(sessionId, { role: "assistant", content: answer });

        sendJson(response, 200, {
          answer,
          confidence: retrieval.confidence,
          language: retrieval.language,
          sources: retrieval.sources,
          suggestedFollowUps: [
            "Show me how this would scale on AWS Lambda.",
            "What signals improve multilingual retrieval quality?",
            "How would you audit hallucination risk?"
          ]
        });
      } catch (error) {
        sendJson(response, 500, {
          error: error instanceof Error ? error.message : "RAG workflow failed"
        });
      }
    });
    return;
  }

  sendJson(response, 404, { error: "Not found" });
});

const PORT = 8090;
server.listen(PORT, () => {
  console.log(`RAG orchestrator listening on http://localhost:${PORT}`);
});

