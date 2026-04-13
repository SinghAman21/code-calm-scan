import "dotenv/config";
import express from "express";
import { scanCode, validateScanInput } from "./scanner.mjs";
import { persistScanResult, readLatestScanResult } from "./storage.mjs";

const app = express();
const PORT = Number(process.env.PORT || 3004);

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "code-calm-scan-backend", timestamp: new Date().toISOString() });
});

app.get("/api/scan/latest", async (_req, res) => {
  const latest = await readLatestScanResult();
  if (!latest) {
    return res.json({ ok: true, result: null });
  }

  return res.json({ ok: true, result: latest });
});

app.post("/api/scan", async (req, res) => {
  try {
    const validated = validateScanInput(req.body);
    if (!validated.ok) {
      return res.status(400).json({
        ok: false,
        error: validated.error,
      });
    }

    const result = await scanCode({ code: validated.code, language: validated.language });
    await persistScanResult(result);

    return res.status(200).json({
      ok: true,
      result,
    });
  } catch (error) {
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
