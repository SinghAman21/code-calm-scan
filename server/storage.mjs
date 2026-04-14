import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createTrace } from "./logger.mjs";

const SCANS_DIR = path.resolve(process.cwd(), "server/data/scans");
const LATEST_FILE = path.join(SCANS_DIR, "latest.json");

async function ensureScansDir() {
  await mkdir(SCANS_DIR, { recursive: true });
}

export async function persistScanResult(result, externalTrace) {
  const trace = externalTrace || createTrace("STORAGE");
  trace.step("Ensuring scan storage directory");
  await ensureScansDir();
  const content = JSON.stringify(result, null, 2);
  trace.step("Writing scan result file", { path: path.join(SCANS_DIR, `${result.id}.json`) });
  await writeFile(path.join(SCANS_DIR, `${result.id}.json`), content, "utf-8");
  trace.step("Updating latest scan snapshot", { path: LATEST_FILE });
  await writeFile(LATEST_FILE, content, "utf-8");
}

export async function readLatestScanResult(externalTrace) {
  const trace = externalTrace || createTrace("STORAGE");
  trace.step("Ensuring scan storage directory");
  await ensureScansDir();
  try {
    trace.step("Reading latest scan snapshot", { path: LATEST_FILE });
    const raw = await readFile(LATEST_FILE, "utf-8");
    trace.step("Latest scan snapshot parsed");
    return JSON.parse(raw);
  } catch {
    trace.warn("Latest scan snapshot not found or unreadable");
    return null;
  }
}

export async function readAllScanResults(externalTrace) {
  const trace = externalTrace || createTrace("STORAGE");
  trace.step("Ensuring scan storage directory");
  await ensureScansDir();
  try {
    trace.step("Listing scan files", { directory: SCANS_DIR });
    const files = await readdir(SCANS_DIR);
    const scanFiles = files.filter((file) => file.startsWith("scan-") && file.endsWith(".json"));
    trace.step("Loading scan documents", { count: scanFiles.length });

    const scans = await Promise.all(
      scanFiles.map(async (file) => {
        const raw = await readFile(path.join(SCANS_DIR, file), "utf-8");
        return JSON.parse(raw);
      })
    );

    return scans.sort((a, b) => {
      const aTime = new Date(a.timestamp).getTime();
      const bTime = new Date(b.timestamp).getTime();
      return bTime - aTime;
    });
  } catch {
    trace.warn("Failed to read scan history, returning empty list");
    return [];
  }
}

export async function readScanResultById(id, externalTrace) {
  const trace = externalTrace || createTrace("STORAGE");
  trace.step("Ensuring scan storage directory");
  await ensureScansDir();
  try {
    trace.step("Reading scan file by id", { scanId: id });
    const raw = await readFile(path.join(SCANS_DIR, `${id}.json`), "utf-8");
    trace.step("Scan file parsed", { scanId: id });
    return JSON.parse(raw);
  } catch {
    trace.warn("Scan file not found or unreadable", { scanId: id });
    return null;
  }
}
