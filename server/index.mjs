import "dotenv/config";
import express from "express";
import { randomUUID } from "node:crypto";
import { scanCode, validateScanInput } from "./scanner.mjs";
import { createTrace, error as logError, log } from "./logger.mjs";
import {
  persistScanResult,
  readAllScanResults,
  readLatestScanResult,
  readScanResultById,
} from "./storage.mjs";

const app = express();
const PORT = Number(process.env.PORT || 3004);

app.use(express.json({ limit: "1mb" }));

app.use((req, res, next) => {
  const trace = createTrace("API", `req-${randomUUID().slice(0, 8)}`);
  req.trace = trace;
  const startedAt = Date.now();
  trace.step("Incoming request", {
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
  });
  res.on("finish", () => {
    const elapsedMs = Date.now() - startedAt;
    trace.step("Request completed", {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: elapsedMs,
    });
  });
  next();
});

app.get("/api/health", (_req, res) => {
  log("API", "Health check served");
  res.json({ ok: true, service: "code-calm-scan-backend", timestamp: new Date().toISOString() });
});

app.get("/api/scan/latest", async (_req, res) => {
  const trace = _req.trace || createTrace("API");
  trace.step("Loading latest stored scan");
  const latest = await readLatestScanResult(trace);
  if (!latest) {
    trace.step("No latest scan found, returning null");
    return res.json({ ok: true, result: null });
  }

  trace.step("Latest scan loaded", { scanId: latest.id, findings: latest.stats?.total ?? 0 });
  return res.json({ ok: true, result: latest });
});

app.get("/api/scan/history", async (_req, res) => {
  const trace = _req.trace || createTrace("API");
  trace.step("Loading full scan history");
  const scans = await readAllScanResults(trace);
  trace.step("Scan history loaded", { count: scans.length });
  return res.json({ ok: true, result: scans });
});

app.get("/api/scan/:id", async (req, res) => {
  const { id } = req.params;
  const trace = req.trace || createTrace("API");
  trace.step("Loading scan by id", { scanId: id });
  const scan = await readScanResultById(id, trace);
  if (!scan) {
    trace.warn("Scan by id not found", { scanId: id });
    return res.status(404).json({ ok: false, error: "Scan not found." });
  }

  trace.step("Scan by id loaded", { scanId: id, findings: scan.stats?.total ?? 0 });
  return res.json({ ok: true, result: scan });
});

app.post("/api/scan", async (req, res) => {
  const trace = req.trace || createTrace("API");
  try {
    trace.step("Validating scan payload");
    const validated = validateScanInput(req.body);
    if (!validated.ok) {
      trace.warn("Payload validation failed", { error: validated.error });
      return res.status(400).json({
        ok: false,
        error: validated.error,
      });
    }

    trace.step("Dispatching scan pipeline", {
      language: validated.language,
      chars: validated.code.length,
      lines: validated.code.split("\n").length,
    });
    const result = await scanCode({ code: validated.code, language: validated.language, trace });
    trace.step("Persisting scan result", { scanId: result.id, totalFindings: result.stats.total });
    await persistScanResult(result, trace);
    trace.step("Scan request successfully completed", { scanId: result.id });

    return res.status(200).json({
      ok: true,
      result,
    });
  } catch (error) {
    logError("API", "Scan failed", {
      traceId: trace.id,
      message: error instanceof Error ? error.message : String(error),
    });
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
  log("API", `Backend API listening on http://localhost:${PORT}`);
});
