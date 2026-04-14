import Editor from "@monaco-editor/react";
import { useScan } from "@/hooks/useScanStore";
import { useTheme } from "@/hooks/useTheme";
import { motion } from "framer-motion";
import { duration } from "@/animations/motion-presets";
import { FileCode2, Loader2 } from "lucide-react";

export function CodeEditorPanel() {
  const { code, setCode, language, isScanning } = useScan();
  const { theme, editorFontSize } = useTheme();
  const lineCount = code.split("\n").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.normal, delay: 0.1 }}
      className="h-full flex flex-col relative"
    >
      {/* Editor header */}
      <div className="h-9 px-3 border-b border-border flex items-center justify-between shrink-0" style={{ backgroundColor: "hsl(var(--surface-1))" }}>
        <div className="flex items-center gap-1.5">
          <FileCode2 className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Source</span>
        </div>
        <span className="text-2xs text-muted-foreground font-mono tabular-nums">{lineCount} lines</span>
      </div>

      {/* Editor body */}
      <div className="flex-1 min-h-0" style={{ backgroundColor: "hsl(var(--code-bg))" }}>
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(v) => setCode(v || "")}
          theme={theme === "dark" ? "vs-dark" : "light"}
          loading={
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          }
          options={{
            fontSize: editorFontSize,
            lineHeight: 20,
            fontFamily: "'JetBrains Mono', monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 12, bottom: 12 },
            lineNumbers: "on",
            lineNumbersMinChars: 3,
            renderLineHighlight: "gutter",
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            wordWrap: "on",
            bracketPairColorization: { enabled: true },
            guides: { indentation: true, bracketPairs: true },
            overviewRulerBorder: false,
            scrollbar: {
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
              useShadows: false,
            },
          }}
        />
      </div>

      {/* Scan overlay */}
      {isScanning && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px]" />
          <div className="scan-line absolute left-0 right-0 h-[2px] animate-scan-sweep" />
        </div>
      )}
    </motion.div>
  );
}
