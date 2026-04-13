import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const SCANS_DIR = path.resolve(process.cwd(), "server/data/scans");
const LATEST_FILE = path.join(SCANS_DIR, "latest.json");

async function ensureScansDir() {
  await mkdir(SCANS_DIR, { recursive: true });
}

export async function persistScanResult(result) {
  await ensureScansDir();
  const content = JSON.stringify(result, null, 2);
  await writeFile(path.join(SCANS_DIR, `${result.id}.json`), content, "utf-8");
  await writeFile(LATEST_FILE, content, "utf-8");
}

export async function readLatestScanResult() {
  await ensureScansDir();
  try {
    const raw = await readFile(LATEST_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
