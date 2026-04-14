import { randomUUID } from "node:crypto";

const GMT_PLUS_0530_OFFSET_MINUTES = 5 * 60 + 30;

function pad2(value) {
  return String(value).padStart(2, "0");
}

function formatTimestampGmt0530(date = new Date()) {
  // Convert from UTC epoch to GMT+0530 clock time using a fixed offset.
  const shifted = new Date(date.getTime() + GMT_PLUS_0530_OFFSET_MINUTES * 60 * 1000);
  const hh = pad2(shifted.getUTCHours());
  const mm = pad2(shifted.getUTCMinutes());
  const ss = pad2(shifted.getUTCSeconds());
  const dd = pad2(shifted.getUTCDate());
  const month = pad2(shifted.getUTCMonth() + 1);
  const yy = pad2(shifted.getUTCFullYear() % 100);
  return `${hh} ${mm} ${ss} ${dd}${month}${yy} GMT+0530`;
}

function formatMeta(meta) {
  if (!meta || typeof meta !== "object") return "";
  try {
    return ` ${JSON.stringify(meta)}`;
  } catch {
    return "";
  }
}

function write(level, scope, traceId, step, message, meta) {
  const timestamp = formatTimestampGmt0530();
  const levelLabel = level.toUpperCase().padEnd(5);
  const stepLabel = step ? ` [STEP ${String(step).padStart(2, "0")}]` : "";
  const traceLabel = traceId ? ` [${traceId}]` : "";
  const line = `[${timestamp}] [${levelLabel}] [${scope}]${traceLabel}${stepLabel} ${message}${formatMeta(meta)}`;

  if (level === "error") {
    console.error(line);
    return;
  }
  if (level === "warn") {
    console.warn(line);
    return;
  }
  console.log(line);
}

export function createTrace(scope, traceId = randomUUID()) {
  let step = 0;

  return {
    id: traceId,
    step(message, meta) {
      step += 1;
      write("info", scope, traceId, step, message, meta);
    },
    info(message, meta) {
      write("info", scope, traceId, null, message, meta);
    },
    warn(message, meta) {
      write("warn", scope, traceId, null, message, meta);
    },
    error(message, meta) {
      write("error", scope, traceId, null, message, meta);
    },
  };
}

export function log(scope, message, meta) {
  write("info", scope, null, null, message, meta);
}

export function warn(scope, message, meta) {
  write("warn", scope, null, null, message, meta);
}

export function error(scope, message, meta) {
  write("error", scope, null, null, message, meta);
}
