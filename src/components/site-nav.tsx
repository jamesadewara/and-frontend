import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 group ${className}`}>
      <div className="relative size-8 rounded-lg bg-primary/15 grid place-items-center ring-1 ring-primary/30 group-hover:ring-primary/60 transition">
        <Sparkles className="size-4 text-primary" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-display font-bold text-base">AnD AI</span>
        <span className="text-[10px] text-muted-foreground tracking-widest">NIGERIA</span>
      </div>
    </Link>
  );
}

export function TopNav({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-40 glass border-b border-glass-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Logo />
        <div className="flex-1 flex justify-center">{children}</div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
