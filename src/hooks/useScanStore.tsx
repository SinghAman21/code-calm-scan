import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { ScanResult, Finding, SupportedLanguage } from "@/types";
import { VULNERABLE_JS_CODE } from "@/data/mock-data";
import { fetchLatestScan, requestScan } from "@/lib/scan-api";
import { toast } from "sonner";

interface ScanState {
  code: string;
  setCode: (code: string) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  isScanning: boolean;
  result: ScanResult | null;
  selectedFinding: Finding | null;
  setSelectedFinding: (f: Finding | null) => void;
  runScan: () => Promise<void>;
  activeFilter: string;
  setActiveFilter: (f: string) => void;
}

const ScanContext = createContext<ScanState | null>(null);

export function ScanProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState(VULNERABLE_JS_CODE);
  const [language, setLanguage] = useState<SupportedLanguage>("javascript");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    let cancelled = false;

    const hydrateLatest = async () => {
      try {
        const latest = await fetchLatestScan();
        if (!latest || cancelled) return;

        setResult(latest);
        setCode(latest.originalCode);
        setLanguage(latest.language as SupportedLanguage);
        if (latest.findings.length > 0) {
          setSelectedFinding(latest.findings[0]);
        }
      } catch {
        // Keep initial local UI state if there is no retrievable backend history.
      }
    };

    hydrateLatest();

    return () => {
      cancelled = true;
    };
  }, []);

  const runScan = useCallback(async () => {
    if (!code.trim()) {
      toast.error("Code snippet is empty.");
      return;
    }

    setIsScanning(true);
    setResult(null);
    setSelectedFinding(null);

    try {
      const scanResult = await requestScan(code, language);
      setResult(scanResult);
      if (scanResult.findings.length > 0) {
        setSelectedFinding(scanResult.findings[0]);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Scan failed.";
      toast.error(message);
    } finally {
      setIsScanning(false);
    }
  }, [code, language]);

  return (
    <ScanContext.Provider
      value={{
        code, setCode, language, setLanguage,
        isScanning, result, selectedFinding, setSelectedFinding,
        runScan, activeFilter, setActiveFilter,
      }}
    >
      {children}
    </ScanContext.Provider>
  );
}

export function useScan() {
  const ctx = useContext(ScanContext);
  if (!ctx) throw new Error("useScan must be used within ScanProvider");
  return ctx;
}
