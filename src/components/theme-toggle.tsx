import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useApp } from "../hooks/app";

export function ThemeToggle() {
  const { theme, setTheme, lang, setLang, resetAppState } = useApp();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="glass rounded-full p-2.5 hover:scale-105 transition-transform"
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
