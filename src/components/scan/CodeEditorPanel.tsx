import Editor from "@monaco-editor/react";
import { useScan } from "@/hooks/useScanStore";
import { useTheme } from "@/hooks/useTheme";

export function CodeEditorPanel() {
  const { code, setCode, language, isScanning, result, selectedFinding } = useScan();
  const { theme } = useTheme();

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 border-b border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-mono">editor</span>
        <span className="text-xs text-muted-foreground">{code.split("\n").length} lines</span>
      </div>
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(v) => setCode(v || "")}
          theme={theme === "dark" ? "vs-dark" : "light"}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 12 },
            lineNumbers: "on",
            renderLineHighlight: "gutter",
            smoothScrolling: true,
            cursorBlinking: "smooth",
            wordWrap: "on",
          }}
        />
      </div>
    </div>
  );
}
