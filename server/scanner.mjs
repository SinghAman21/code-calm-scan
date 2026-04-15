import { randomUUID } from "node:crypto";
import { SCAN_SYSTEM_PROMPT, buildScanUserPrompt } from "./prompt.mjs";
import { createTrace } from "./logger.mjs";

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

function normalizeForSubstantiveComparison(source) {
  return String(source)
    .replace(/["'`]/g, "\"")
    .replace(/;(?=\s*(\n|$))/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function hasSubstantiveCodeChange(originalCode, candidateCode) {
  if (typeof candidateCode !== "string" || !candidateCode.trim()) return false;
  if (candidateCode === originalCode) return false;
  return normalizeForSubstantiveComparison(candidateCode) !== normalizeForSubstantiveComparison(originalCode);
}

function extractAssistantContent(payload) {
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (typeof part?.text === "string") return part.text;
        return "";
      })
      .join("")
      .trim();
  }

  return "";
}

function printDebugSection(title, content) {
  const border = "=".repeat(28);
  console.log(`\n${border} ${title} ${border}`);
  console.log(content);
  console.log(`${"=".repeat(border.length + title.length + border.length + 2)}\n`);
}

function detectRiskSignals(code) {
  const checks = [
    { key: "weak-hash-sha1", regex: /createHash\(\s*["']sha1["']\s*\)/i },
    { key: "weak-hash-md5", regex: /createHash\(\s*["']md5["']\s*\)/i },
    { key: "hardcoded-password", regex: /password\s*:\s*["'][^"']+["']/i },
    { key: "token-generated-from-time", regex: /Date\.now\(\)/i },
    { key: "unsafe-eval", regex: /\beval\s*\(/i },
    { key: "unsafe-command-exec", regex: /\b(exec|spawn|system)\s*\(/i },
  ];

  return checks.filter((c) => c.regex.test(code)).map((c) => c.key);
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

async function requestOpenAIScan({ code, language, trace, mode = "primary" }) {
  const apiKey = process.env.LOCAL_API_KEY || "ollama";

  const model = process.env.LOCAL_MODEL || "qwen2.5-coder:3b-instruct";
  const baseUrl = process.env.LOCAL_BASE_URL || "http://localhost:11434/v1";
  const endpoint = `${baseUrl.replace(/\/$/, "")}/chat/completions`;
  const requestPayload = {
    model,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          mode === "second-opinion"
            ? `${SCAN_SYSTEM_PROMPT}\n\nYou are in second-opinion mode because a first pass returned no findings on potentially risky code. Focus on concrete security and reliability flaws that are clearly present.`
            : SCAN_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content:
          mode === "second-opinion"
            ? `${buildScanUserPrompt({ language, code })}\n\nRe-check common vulnerability patterns: weak hashing, insecure auth/token handling, hardcoded credentials, missing authorization guards, and injection risk.`
            : buildScanUserPrompt({ language, code }),
      },
    ],
  };

  const requestPayloadWithoutResponseFormat = {
    model,
    temperature: 0.2,
    messages: requestPayload.messages,
  };

  async function sendModelRequest(payloadToSend, label) {
    trace.info(`Model request payload (${label})`, payloadToSend);
    printDebugSection(
      `MODEL REQUEST ${label.toUpperCase()}`,
      JSON.stringify(
        {
          endpoint,
          model,
          payload: payloadToSend,
        },
        null,
        2
      )
    );
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payloadToSend),
    });

    const rawResponseText = await response.text();
    trace.info(`Model raw HTTP response (${label})`, {
      status: response.status,
      ok: response.ok,
      body: rawResponseText,
    });
    printDebugSection(`MODEL RESPONSE ${label.toUpperCase()}`, rawResponseText || "<empty-body>");

    let payload = null;
    try {
      payload = rawResponseText ? JSON.parse(rawResponseText) : null;
    } catch (error) {
      trace.error("Model response is not valid JSON", {
        status: response.status,
        message: error instanceof Error ? error.message : String(error),
        body: rawResponseText,
      });
      throw new Error("Model returned non-JSON response. Check console logs for full body.");
    }

    return { response, payload };
  }

  trace.step("Dispatching model request", {
    provider: baseUrl.includes("11434") ? "ollama" : "openai-compatible",
    endpoint,
    model,
    language,
    codeChars: code.length,
    codeLines: code.split("\n").length,
  });
  let { response, payload } = await sendModelRequest(requestPayload, "primary");

  if (!response.ok) {
    const errorMessage = String(payload?.error?.message || "");
    const unsupportedResponseFormat =
      /response_format/i.test(errorMessage) || /json_object/i.test(errorMessage);

    if (unsupportedResponseFormat) {
      trace.warn("Model rejected response_format. Retrying without response_format.", {
        message: errorMessage,
      });
      ({ response, payload } = await sendModelRequest(requestPayloadWithoutResponseFormat, "fallback-no-response-format"));
    }
  }

  trace.step("Model response received", {
    status: response.status,
    ok: response.ok,
  });

  if (!response.ok) {
    const message = payload?.error?.message || `OpenAI request failed with status ${response.status}`;
    trace.error("Model request failed", { message });
    throw new Error(message);
  }

  const text = extractAssistantContent(payload);
  if (!text) {
    trace.error("Model response missing message content", { payload });
    throw new Error("OpenAI did not return a JSON response payload.");
  }

  printDebugSection("MODEL MESSAGE CONTENT", text);

  trace.step("Parsing model JSON payload");
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

export async function scanCode({ code, language, trace: externalTrace }) {
  const trace = externalTrace || createTrace("SCAN");
  const startedAt = performance.now();
  const riskSignals = detectRiskSignals(code);
  trace.step("Scan pipeline started", { language, chars: code.length, lines: code.split("\n").length });
  if (riskSignals.length > 0) {
    trace.warn("Static risk signals detected before model scan", { riskSignals });
  }

  let llmResult = await requestOpenAIScan({ code, language, trace, mode: "primary" });

  if ((!Array.isArray(llmResult?.findings) || llmResult.findings.length === 0) && riskSignals.length > 0) {
    trace.warn("Primary model pass returned no findings despite risk signals. Running second opinion.", {
      riskSignals,
    });
    llmResult = await requestOpenAIScan({ code, language, trace, mode: "second-opinion" });
  }

  trace.step("Normalizing findings from model response");
  const findings = Array.isArray(llmResult?.findings)
    ? llmResult.findings.map((f, i) => normalizeFinding(f, i, code))
    : [];

  trace.step("Findings extracted from model", {
    findingsCount: findings.length,
    riskSignals,
  });

  if (findings.length === 0 && riskSignals.length > 0) {
    trace.warn("No findings returned even after second opinion, but static risk signals remain", {
      riskSignals,
    });
  }

  const durationSeconds = Number(((performance.now() - startedAt) / 1000).toFixed(3));

  trace.step("Building deterministic stats");
  const stats = buildStats(findings, code, durationSeconds, llmResult?.stats);

  trace.step("Scan normalization completed", {
    findings: findings.length,
    critical: stats.critical,
    high: stats.high,
    medium: stats.medium,
    low: stats.low,
    durationSeconds: stats.scanDuration,
  });

  const rawImprovedCode = typeof llmResult?.improvedCode === "string" ? llmResult.improvedCode : "";
  const useImprovedCode = hasSubstantiveCodeChange(code, rawImprovedCode);
  if (!useImprovedCode && rawImprovedCode.trim()) {
    trace.step("Discarding cosmetic-only improvedCode from model output");
  }

  return {
    id: `scan-${randomUUID()}`,
    timestamp: new Date().toISOString(),
    language,
    originalCode: code,
    improvedCode: useImprovedCode ? rawImprovedCode : code,
    findings,
    stats,
  };
}
