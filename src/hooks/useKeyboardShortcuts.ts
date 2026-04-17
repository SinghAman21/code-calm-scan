import { useEffect } from "react";

interface KeyboardShortcutMap {
  [key: string]: () => void;
}

/**
 * Custom hook for managing keyboard shortcuts globally
 * Handles Ctrl+K, arrow navigation, etc.
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcutMap, disabled: boolean = false) {
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Guard: Don't intercept in input fields or textareas
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).contentEditable === "true"
      ) {
        return;
      }

      const key = `${e.ctrlKey || e.metaKey ? "ctrl+" : ""}${e.shiftKey ? "shift+" : ""}${e.key.toLowerCase()}`;
      const handler = shortcuts[key];

      if (handler) {
        e.preventDefault();
        handler();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts, disabled]);
}
