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
        "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium transition-all duration-150",
        "bg-primary text-primary-foreground",
        "hover:brightness-110 active:scale-[0.97]",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        isScanning && "animate-scan-pulse",
        className
      )}
    >
      {isScanning ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>Scanning…</span>
        </>
      ) : (
        <>
          <Scan className="h-3.5 w-3.5" />
          <span>Scan</span>
        </>
      )}
    </button>
  );
}
