import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  uiFontSize: number;
  setUiFontSize: (size: number) => void;
  editorFontSize: number;
  setEditorFontSize: (size: number) => void;
}

const ThemeContext = createContext<ThemeState>({
  theme: "dark",
  toggleTheme: () => {},
  uiFontSize: 15,
  setUiFontSize: () => {},
  editorFontSize: 14,
  setEditorFontSize: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "dark";
    }
    return "dark";
  });
  const [uiFontSize, setUiFontSize] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const stored = Number(localStorage.getItem("ui-font-size"));
      return Number.isFinite(stored) && stored >= 13 && stored <= 18 ? stored : 15;
    }
    return 15;
  });
  const [editorFontSize, setEditorFontSize] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const stored = Number(localStorage.getItem("editor-font-size"));
      return Number.isFinite(stored) && stored >= 12 && stored <= 20 ? stored : 14;
    }
    return 14;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--app-font-size", `${uiFontSize}px`);
    localStorage.setItem("ui-font-size", String(uiFontSize));
  }, [uiFontSize]);

  useEffect(() => {
    localStorage.setItem("editor-font-size", String(editorFontSize));
  }, [editorFontSize]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      uiFontSize,
      setUiFontSize,
      editorFontSize,
      setEditorFontSize,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
