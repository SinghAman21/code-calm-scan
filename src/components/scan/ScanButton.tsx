import { useScan } from "@/hooks/useScanStore";
import { Loader2, Scan } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScanButton({ className }: { className?: string }) {
  const { isScanning, runScan, code } = useScan();

  return (
    <button
      onClick={runScan}
      disabled={isScanning || !code.trim()}
      className={cn(
        "magnetic-hover inline-flex items-center gap-2 rounded-[1rem] border border-primary/35 bg-primary px-3.5 py-1.5 text-sm font-semibold text-primary-foreground",
        "shadow-[var(--shadow-soft)] active:scale-[0.98]",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        isScanning && "animate-scan-pulse",
        className
      )}
    >
      {isScanning ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Tracing risk...</span>
        </>
      ) : (
        <>
          <Scan className="h-4 w-4" />
          <span>Run scan</span>
        </>
      )}
    </button>
  );
}
