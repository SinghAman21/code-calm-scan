import { useScan } from "@/hooks/useScanStore";
import { Loader2, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScanButton({ className }: { className?: string }) {
  const { isScanning, runScan, code } = useScan();

  return (
    <button
      onClick={runScan}
      disabled={isScanning || !code.trim()}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
        "bg-primary text-primary-foreground hover:opacity-90",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {isScanning ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Scanning…
        </>
      ) : (
        <>
          <Play className="h-4 w-4" />
          Scan
        </>
      )}
    </button>
  );
}
