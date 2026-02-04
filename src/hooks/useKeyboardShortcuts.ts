import { useEffect } from "react";

interface KeyboardShortcutHandlers {
  onSpace?: () => void;
  onEscape?: () => void;
  onBackspace?: () => void;
  onCtrlArrowUp?: () => void;
  onCtrlArrowDown?: () => void;
  onEnd?: () => void;
}

export function useKeyboardShortcuts({
  onSpace,
  onEscape,
  onBackspace,
  onCtrlArrowUp,
  onCtrlArrowDown,
  onEnd,
}: KeyboardShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignorar si el usuario está escribiendo en un input, textarea, etc.
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Atajos con CTRL
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "ArrowUp":
            event.preventDefault();
            onCtrlArrowUp?.();
            return;
          case "ArrowDown":
            event.preventDefault();
            onCtrlArrowDown?.();
            return;
        }
      }

      // Atajos simples (sin modificadores)
      if (!event.ctrlKey && !event.metaKey && !event.altKey) {
        switch (event.key) {
          case " ":
            event.preventDefault();
            onSpace?.();
            break;
          case "Escape":
            event.preventDefault();
            onEscape?.();
            break;
          case "Backspace":
            event.preventDefault();
            onBackspace?.();
            break;
          case "End":
            event.preventDefault();
            onEnd?.();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSpace, onEscape, onBackspace, onCtrlArrowUp, onCtrlArrowDown, onEnd]);
}
