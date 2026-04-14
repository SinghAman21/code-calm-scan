# Code Calm Scan

AI-assisted code scanner with a modern frontend workspace and a local-first backend.

The app accepts a code snippet and language, sends it to a model endpoint, receives a strict `ScanResult` JSON object, stores it locally on disk, and uses that object as the source of truth for the `/app` workspace UI.

## What This Repo Includes

1. Frontend
- React + TypeScript + Vite.
- Monaco editor for source input.
- Findings panel, summary, diff, and improved-code views.
- Route-based UI with animated transitions.

2. Backend
- Node.js + Express API.
- Scan endpoint that calls an OpenAI-compatible chat completion API.
- Local storage of scan artifacts under `server/data/scans`.
- Verbose runtime logs for every request and scan stage.

3. Local model workflow
- Configured for Ollama via OpenAI-compatible API format.
- CPU-friendly default model support.

## Core Flow

1. User opens `/app` and enters code.
2. Frontend calls `POST /api/scan`.
3. Backend validates input and calls model endpoint with strict prompt contract.
4. Backend normalizes model output to schema-safe JSON.
5. Backend saves scan to `server/data/scans/<scan-id>.json` and updates `server/data/scans/latest.json`.
6. Frontend renders findings/summary/diff/fixed output from returned JSON.
7. On app load, frontend calls `GET /api/scan/latest` to hydrate latest context.

## API Contract

The backend returns:

```json
{
  "ok": true,
  "result": {
    "id": "scan-...",
    "timestamp": "2026-...",
    "language": "javascript",
    "originalCode": "...",
    "improvedCode": "...",
    "findings": [],
    "stats": {
      "critical": 0,
      "high": 0,
      "medium": 0,
      "low": 0,
      "total": 0,
      "linesScanned": 0,
      "scanDuration": 0.0
    }
  }
}
```

## Runtime Ports

1. Frontend dev server: `8080`
2. Backend API server: `3004`
3. Ollama server: `11434`

Vite proxies `/api/*` to `http://localhost:3004`.

## Prerequisites

1. Node.js 20+.
2. npm.
3. Ollama installed and running.
4. A local model pulled (recommended below).

## Recommended Model (CPU)

1. Best default for i5 + 8GB RAM:
- `qwen2.5-coder:3b-instruct`

2. Faster but lower quality:
- `qwen2.5-coder:1.5b-instruct`

3. Better quality but slower on CPU:
- `qwen2.5-coder:7b`

## Quick Start

1. Install dependencies.

```bash
npm install
```

2. Create environment file.

```bash
cp .env.example .env
```

3. Set local model config in `.env`.

```dotenv
LOCAL_BASE_URL=http://localhost:11434/v1
LOCAL_API_KEY=ollama
LOCAL_MODEL=qwen2.5-coder:3b-instruct
PORT=3004
```

4. Start Ollama service.

```bash
ollama serve
```

5. Pull model (first time only).

```bash
ollama pull qwen2.5-coder:3b-instruct
```

6. Start backend.

```bash
npm run dev:backend
```

7. Start frontend (new terminal).

```bash
npm run dev
```

8. Open app.

```text
http://localhost:8080/app
```

## How Backend Picks The Model

The backend always sends the `model` value from `LOCAL_MODEL` in your `.env`.

If you change this variable and restart backend, scans will use the new model without code changes.

Example:

```dotenv
LOCAL_MODEL=qwen2.5-coder:7b
```

## Available Scripts

1. `npm run dev`:
- Runs Vite frontend in development.

2. `npm run dev:backend`:
- Runs Express backend with file watch.

3. `npm run build`:
- Builds production frontend bundle.

4. `npm test`:
- Runs Vitest test suite.

## Backend Logging

Backend prints detailed logs in terminal.

1. `[API]` logs:
- Incoming requests.
- Response status and timing.
- Validation, persistence, and route-level flow.

2. `[SCAN]` logs:
- Model endpoint/model selection.
- Request payload sizing metadata.
- Model response status.
- JSON parse and normalization summary.

## Tips For Smooth CPU Runs

1. Keep snippet size reasonable.
- Large files significantly increase inference time on CPU.

2. Use one scan at a time.
- Avoid concurrent requests on low-resource machines.

3. Keep temperature low.
- Current value is `0.2` for stable JSON output.

4. Keep model warm (optional).

```bash
ollama run qwen2.5-coder:3b-instruct
```

5. Reuse previous context.
- App auto-hydrates from latest stored scan at startup.

## Troubleshooting

1. `EADDRINUSE: address already in use :::3004`
- Another backend process is running.
- Check process:

```bash
lsof -iTCP:3004 -sTCP:LISTEN -n -P
```

- Kill process:

```bash
kill <PID>
```

2. `ECONNREFUSED` from frontend `/api/*`
- Backend is not running on `3004`.
- Start backend with `npm run dev:backend`.

3. Model request errors
- Confirm Ollama is running on `11434`.
- Confirm model exists:

```bash
ollama list
```

- Confirm `.env` values are correct.

4. Slow responses
- Switch to smaller model.
- Reduce code size per scan.

## Useful Paths

1. Frontend scan API client: `src/lib/scan-api.ts`
2. Frontend scan store/context: `src/hooks/useScanStore.tsx`
3. Backend entry API: `server/index.mjs`
4. Backend scanner/model call: `server/scanner.mjs`
5. Prompt contract: `server/prompt.mjs`
6. Local scan persistence: `server/storage.mjs`

## Notes

1. This project currently uses OpenAI-compatible request shape with local Ollama endpoint.
2. The scanner normalizes model output to enforce schema consistency before sending to UI.
3. The `/app` workspace is the primary route for scan operations.