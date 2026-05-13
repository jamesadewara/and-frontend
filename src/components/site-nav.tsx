"use client";

import { ThemeToggle } from "./theme-toggle";
import Logo from "./Logo";

export function TopNav({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-40 glass border-b border-glass-border backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 h-12 md:h-16 flex items-center justify-between gap-2 md:gap-4">
        <Logo className="scale-90 md:scale-100" />
        <div className="flex-1 flex justify-center">{children}</div>
        <div className="flex items-center gap-1 md:gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
