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
      className="panel-shell relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-[2rem]"
    >
      <div className="flex items-center justify-between border-b border-border/70 px-4 py-4 shrink-0" style={{ backgroundColor: "hsl(var(--surface-1) / 0.82)" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[1rem] border border-primary/20 bg-primary/10 text-primary">
            <FileCode2 className="h-4 w-4" />
          </div>
          <div>
            <div className="panel-title">Source stage</div>
            <div className="mt-1 text-sm font-medium text-foreground capitalize">{language}</div>
          </div>
        </div>
        <div className="rounded-full border border-border/80 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {lineCount} lines
        </div>
      </div>

      <div className="relative flex-1 min-h-0" style={{ backgroundColor: "hsl(var(--code-bg))" }}>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-16 bg-gradient-to-b from-background/20 to-transparent" />
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

      {isScanning && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute inset-0 bg-background/26 backdrop-blur-[1px]" />
          <div className="absolute left-6 right-6 top-16 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-primary shadow-[var(--shadow-soft)]">
            tracing threat signatures
          </div>
          <div className="scan-line absolute left-0 right-0 top-24 h-[2px] animate-scan-sweep" />
        </div>
      )}
    </motion.div>
  );
}
