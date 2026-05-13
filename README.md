# Enterprise RAG Engine Demo

This repository is a recruiter-friendly portfolio reconstruction of an **enterprise RAG engine** built with **TypeScript, Python, FastAPI, Pinecone-style vector retrieval, and AWS Lambda deployment patterns**.

The goal is to demonstrate:

- A TypeScript orchestration layer for multi-step retrieval and answer generation.
- A Python FastAPI backend for retrieval, indexing, and confidence scoring.
- A serverless-ready entrypoint for AWS Lambda + API Gateway.
- A multilingual academic knowledge corpus with transparent source citations.

## Repository layout

- `frontend/`: React + TypeScript chat client.
- `orchestrator/`: Node.js API layer that manages sessions, retrieval calls, and answer composition.
- `backend/`: FastAPI retrieval service with local vector search and Pinecone-ready adapter design.
- `data/`: Sample academic corpus used for local indexing and demos.

## System flow

```text
React Chat UI
  -> TypeScript Orchestrator
     -> FastAPI Retrieval API
        -> Local vector store or Pinecone adapter
     -> OpenAI answer synthesis (optional)
  -> Returns answer, confidence, sources, and follow-up suggestions
```

## Local setup

### 1. Install Node dependencies from the repo root

```bash
npm install
```

### 2. Start the backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

### 3. Start the orchestrator from the repo root

```bash
npm run dev:orchestrator
```

### 4. Start the frontend from the repo root

```bash
npm run dev:frontend
```

The frontend targets `http://localhost:8090`, and the orchestrator targets the retrieval service at `http://localhost:8001`.

## Optional environment variables

### `orchestrator/.env`

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
RETRIEVAL_API_URL=http://localhost:8001
```

### `backend/.env`

```env
RETRIEVAL_CORPUS_PATH=../data/academic_corpus.json
PINECONE_API_KEY=
PINECONE_INDEX=
PINECONE_ENVIRONMENT=
```

Copy the examples first:

```bash
copy orchestrator\.env.example orchestrator\.env
copy backend\.env.example backend\.env
```

## Verified locally

- `npm run build` succeeded for both the TypeScript orchestrator and the React frontend.
- `python -m unittest tests.test_retrieval` passed.
- `GET /health` responded correctly from both the retrieval API and the orchestrator.
- `POST /retrieve` returned ranked academic sources with confidence scoring.
- `POST /api/chat` returned a full RAG answer with sources and follow-up prompts.

## Interview talking points

- The orchestration layer keeps chat memory, retrieval, and generation separate so each concern scales independently.
- The retrieval API exposes confidence scoring and structured source metadata for auditability.
- The vector store abstraction supports a local in-memory strategy for demos and a Pinecone-backed strategy in production.
- The Lambda adapter makes the same FastAPI app deployable behind API Gateway without rewriting business logic.

## Suggested GitHub description

`Production-style RAG demo with a TypeScript orchestrator, FastAPI retrieval API, vector search, and serverless deployment patterns.`
