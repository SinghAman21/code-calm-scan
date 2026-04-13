import { randomUUID } from "node:crypto";
import { SCAN_SYSTEM_PROMPT, buildScanUserPrompt } from "./gemini-prompt.mjs";

const SUPPORTED_LANGUAGES = new Set([
  "javascript",
  "typescript",
  "python",
  "java",
  "go",
  "rust",
  "php",
  "ruby",
  "csharp",
  "cpp",
]);

const VALID_SEVERITIES = new Set(["critical", "high", "medium", "low"]);
const VALID_CATEGORIES = new Set(["vulnerability", "bug", "code-smell"]);

function getLineNumber(source, index) {
  if (index <= 0) return 1;
  let line = 1;
  for (let i = 0; i < index; i += 1) {
    if (source.charCodeAt(i) === 10) line += 1;
  }
  return line;
}

function sanitizeJsonText(text) {
  const trimmed = text.trim();
  if (!trimmed.startsWith("```") && !trimmed.endsWith("```")) {
    return trimmed;
  }

  return trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

function toNumber(value, fallback) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function normalizeFinding(finding, index, code) {
  const normalizedLine = Math.max(1, Math.floor(toNumber(finding?.line, 1)));
  const maxLine = code.split("\n").length;
  const line = Math.min(normalizedLine, maxLine);

  return {
    id: typeof finding?.id === "string" && finding.id.trim() ? finding.id : `finding-${index + 1}`,
    title: typeof finding?.title === "string" && finding.title.trim() ? finding.title : `Issue ${index + 1}`,
    severity: VALID_SEVERITIES.has(finding?.severity) ? finding.severity : "medium",
    category: VALID_CATEGORIES.has(finding?.category) ? finding.category : "bug",
    line,
    endLine:
      finding?.endLine == null
        ? undefined
        : Math.max(line, Math.floor(toNumber(finding.endLine, line))),
    confidence: Math.max(0, Math.min(100, Math.round(toNumber(finding?.confidence, 75)))),
    description: typeof finding?.description === "string" ? finding.description : "Issue detected in code.",
    explanation: typeof finding?.explanation === "string" ? finding.explanation : "Review this issue for reliability and security impact.",
    suggestion: typeof finding?.suggestion === "string" ? finding.suggestion : "Apply a safer implementation pattern.",
    ruleId: typeof finding?.ruleId === "string" && finding.ruleId.trim() ? finding.ruleId : `RULE-${index + 1}`,
  };
}

function buildStats(findings, code, durationSeconds, llmStats) {
  const computed = {
    critical: findings.filter((f) => f.severity === "critical").length,
    high: findings.filter((f) => f.severity === "high").length,
    medium: findings.filter((f) => f.severity === "medium").length,
    low: findings.filter((f) => f.severity === "low").length,
    total: findings.length,
    linesScanned: code.split("\n").length,
    scanDuration: durationSeconds,
  };

  if (!llmStats || typeof llmStats !== "object") {
    return computed;
  }

  // Keep model-provided duration only if it is a valid finite number, while preserving deterministic counters.
  const candidateDuration = toNumber(llmStats.scanDuration, computed.scanDuration);
  return {
    ...computed,
    scanDuration: Number(candidateDuration.toFixed(3)),
  };
}

async function requestOpenAIScan({ code, language }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing. Add it to .env before scanning.");
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const endpoint = "https://api.openai.com/v1/chat/completions";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: SCAN_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: buildScanUserPrompt({ language, code }),
        },
      ],
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    const message = payload?.error?.message || `OpenAI request failed with status ${response.status}`;
    throw new Error(message);
  }

  const text = payload?.choices?.[0]?.message?.content;
  if (!text || typeof text !== "string") {
    throw new Error("OpenAI did not return a JSON response payload.");
  }

  return JSON.parse(sanitizeJsonText(text));
}

export function validateScanInput(payload) {
  const code = payload?.code;
  const language = payload?.language;

  if (typeof code !== "string" || !code.trim()) {
    return { ok: false, error: "'code' must be a non-empty string." };
  }

  if (typeof language !== "string" || !SUPPORTED_LANGUAGES.has(language)) {
    return { ok: false, error: "'language' is missing or unsupported." };
  }

  return { ok: true, code, language };
}

export async function scanCode({ code, language }) {
  const startedAt = performance.now();
  const llmResult = await requestOpenAIScan({ code, language });
  const findings = Array.isArray(llmResult?.findings)
    ? llmResult.findings.map((f, i) => normalizeFinding(f, i, code))
    : [];
  const durationSeconds = Number(((performance.now() - startedAt) / 1000).toFixed(3));

  const stats = buildStats(findings, code, durationSeconds, llmResult?.stats);

  return {
    id: `scan-${randomUUID()}`,
    timestamp: new Date().toISOString(),
    language,
    originalCode: code,
    improvedCode:
      typeof llmResult?.improvedCode === "string" && llmResult.improvedCode.trim()
        ? llmResult.improvedCode
        : code,
    findings,
    stats,
  };
}
