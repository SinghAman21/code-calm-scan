import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ScanResult, Finding, SupportedLanguage } from "@/types";
import { MOCK_SCAN_RESULT, VULNERABLE_JS_CODE } from "@/data/mock-data";

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

  const runScan = useCallback(async () => {
    setIsScanning(true);
    setResult(null);
    setSelectedFinding(null);
    await new Promise((r) => setTimeout(r, 2000));
    setResult({ ...MOCK_SCAN_RESULT, originalCode: code, language });
    setIsScanning(false);
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
