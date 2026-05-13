import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("theme")) as
      | "dark"
      | "light"
      | null;
    const initial = stored ?? "dark";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try { localStorage.setItem("theme", next); } catch {}
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="glass rounded-full p-2.5 hover:scale-105 transition-transform"
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
