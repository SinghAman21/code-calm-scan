import { ScanResult, SupportedLanguage } from "@/types";

interface ScanApiResponse {
  ok: boolean;
  result?: ScanResult | null;
  error?: string;
}

async function parseApiResponse(response: Response): Promise<ScanApiResponse | null> {
  try {
    return (await response.json()) as ScanApiResponse;
  } catch {
    return null;
  }
}

export async function requestScan(code: string, language: SupportedLanguage): Promise<ScanResult> {
  const response = await fetch("/api/scan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, language }),
  });

  const payload = await parseApiResponse(response);

  if (!response.ok || !payload?.ok || !payload.result) {
    const message = payload?.error || `Scan request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload.result;
}

export async function fetchLatestScan(): Promise<ScanResult | null> {
  const response = await fetch("/api/scan/latest", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = await parseApiResponse(response);

  if (!response.ok || !payload?.ok) {
    const message = payload?.error || `Latest scan fetch failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload.result ?? null;
}

export async function fetchScanHistory(): Promise<ScanResult[]> {
  const response = await fetch("/api/scan/history", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = await parseApiResponse(response);

  if (!response.ok || !payload?.ok || !Array.isArray(payload.result)) {
    const message = payload?.error || `Scan history fetch failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload.result as ScanResult[];
}

export async function fetchScanById(id: string): Promise<ScanResult> {
  const response = await fetch(`/api/scan/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = await parseApiResponse(response);

  if (!response.ok || !payload?.ok || !payload.result) {
    const message = payload?.error || `Scan detail fetch failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload.result;
}
