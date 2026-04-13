export type Severity = "critical" | "high" | "medium" | "low";
export type FindingCategory = "vulnerability" | "bug" | "code-smell";

export interface Finding {
  id: string;
  title: string;
  severity: Severity;
  category: FindingCategory;
  line: number;
  endLine?: number;
  confidence: number;
  description: string;
  explanation: string;
  suggestion: string;
  ruleId: string;
}

export interface ScanResult {
  id: string;
  timestamp: string;
  language: string;
  originalCode: string;
  improvedCode: string;
  findings: Finding[];
  stats: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
    linesScanned: number;
    scanDuration: number;
  };
}

export interface Rule {
  id: string;
  name: string;
  category: string;
  severity: Severity;
  description: string;
  unsafeExample: string;
  safeExample: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  language: string;
  snippet: string;
  stats: ScanResult["stats"];
  status: "completed" | "failed";
}

export type SupportedLanguage =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "go"
  | "rust"
  | "php"
  | "ruby"
  | "csharp"
  | "cpp";
