import "dotenv/config";
import express from "express";
import { scanCode, validateScanInput } from "./scanner.mjs";
import { persistScanResult, readLatestScanResult } from "./storage.mjs";

const app = express();
const PORT = Number(process.env.PORT || 3004);

app.use(express.json({ limit: "1mb" }));

app.use((req, res, next) => {
  const startedAt = Date.now();
  console.log(`[API] -> ${req.method} ${req.originalUrl}`);
  res.on("finish", () => {
    const elapsedMs = Date.now() - startedAt;
    console.log(`[API] <- ${req.method} ${req.originalUrl} ${res.statusCode} (${elapsedMs}ms)`);
  });
  next();
});

app.get("/api/health", (_req, res) => {
  console.log("[API] Health check served");
  res.json({ ok: true, service: "code-calm-scan-backend", timestamp: new Date().toISOString() });
});

app.get("/api/scan/latest", async (_req, res) => {
  console.log("[API] Fetching latest stored scan result");
  const latest = await readLatestScanResult();
  if (!latest) {
    console.log("[API] No latest scan found, returning null result");
    return res.json({ ok: true, result: null });
  }

  console.log("[API] Latest scan found", { scanId: latest.id, findings: latest.stats?.total });
  return res.json({ ok: true, result: latest });
});

app.post("/api/scan", async (req, res) => {
  try {
    console.log("[API] Validating scan payload");
    const validated = validateScanInput(req.body);
    if (!validated.ok) {
      console.log("[API] Payload validation failed", { error: validated.error });
      return res.status(400).json({
        ok: false,
        error: validated.error,
      });
    }

    console.log("[API] Running model scan", {
      language: validated.language,
      chars: validated.code.length,
      lines: validated.code.split("\n").length,
    });
    const result = await scanCode({ code: validated.code, language: validated.language });
    console.log("[API] Persisting scan result", { scanId: result.id, totalFindings: result.stats.total });
    await persistScanResult(result);
    console.log("[API] Scan completed", { scanId: result.id });

    return res.status(200).json({
      ok: true,
      result,
    });
  } catch (error) {
    console.error("[API] Scan failed", error);
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unexpected scan failure.",
    });
  }
});

app.use((_req, res) => {
  res.status(404).json({ ok: false, error: "Endpoint not found." });
});

app.listen(PORT, () => {
  console.log(`Backend API listening on http://localhost:${PORT}`);
});
