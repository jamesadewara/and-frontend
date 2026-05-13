"use client";

import { type Mode } from "@/src/data/workspace-data";

export function ModeSwitch({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return (
    <div className="glass rounded-full p-1 inline-flex text-[10px] sm:text-xs">
      {([
        { k: "review", l: "Review", fl: "📝 Review Generation" },
        { k: "recommend", l: "Recommend", fl: "🎯 Recommendation" },
      ] as const).map((o) => (
        <button
          key={o.k}
          onClick={() => setMode(o.k)}
          className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full transition font-bold uppercase tracking-tight sm:tracking-normal ${mode === o.k ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
        >
          <span className="hidden sm:inline">{o.fl}</span>
          <span className="sm:hidden">{o.l}</span>
        </button>
      ))}
    </div>
  );
}
