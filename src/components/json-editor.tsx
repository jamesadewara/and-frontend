import { useMemo, useState, useEffect, useRef } from "react";
import { cn } from "@/src/lib/utils";

type InputMode = "json" | "text";

function detectInputMode(input: string): InputMode {
  if (!input || input.trim().length === 0) return "json";
  
  const trimmed = input.trim();
  
  // Check for JSON indicators
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return "json";
  }
  
  // Check for key-value JSON pattern
  if (/"[^"]*"\s*:\s*/.test(trimmed)) {
    return "json";
  }
  
  // Try to parse as JSON
  try {
    JSON.parse(trimmed);
    return "json";
  } catch {
    // Not valid JSON — it's text mode
    return "text";
  }
}

export function JsonEditor({
  value,
  onChange,
  status,
}: {
  value: string;
  onChange: (v: string) => void;
  status: "valid" | "invalid" | "warning";
}) {
  const [mode, setMode] = useState<InputMode>("json");
  const [isMounted, setIsMounted] = useState(false);
  const [wordWrap, setWordWrap] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        setWordWrap(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  const lines = useMemo(() => value.split("\n"), [value]);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Debounced mode detection
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      const detectedMode = detectInputMode(value);
      setMode(detectedMode);
    }, 300);
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [value]);
  
  // Determine border color - in text mode, never show invalid
  const borderColor = mode === "text"
    ? "border-border"
    : status === "valid"
    ? "border-primary/60"
    : status === "invalid"
    ? "border-destructive/60"
    : "border-border";
  
  const modeLabel = mode === "json" ? "JSON Mode" : "Text Mode";
  const modeBadgeColor = mode === "json" 
    ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
    : "bg-green-500/20 text-green-400 border-green-500/30";

  return (
    <div
      className={`rounded-xl border-2 ${borderColor} transition-colors overflow-auto flex-1 scrollbar-thin group relative`}
      style={{ background: "var(--code-bg)" }}
    >
      {/* Mode badge indicator */}
      <div className={`absolute top-2 right-2 md:top-3 md:right-3 px-2 py-1 rounded-md text-[10px] font-bold border ${modeBadgeColor} z-20 pointer-events-none`}>
        {modeLabel}
      </div>
      
      <div className="flex font-mono text-xs md:text-sm min-w-max min-h-full">
        {isMounted && mode === "json" && !wordWrap && (
          <div
            aria-hidden
            className="select-none text-right py-2 md:py-4 px-2 md:px-3 text-muted-foreground/40 border-r border-border/50 tabular-nums sticky left-0 z-10"
            style={{ background: "var(--code-bg)" }}
          >
            {lines.map((_, i) => (
              <div key={i} className="leading-5 md:leading-6">
                {i + 1}
              </div>
            ))}
          </div>
        )}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={true}
          wrap={wordWrap || mode === "text" ? "soft" : "off"}
          rows={Math.max(lines.length, 12)}
          className={cn(
            "flex-1 min-w-125 md:min-w-200 py-2 md:py-4 px-3 md:px-4 leading-5 md:leading-6 bg-transparent outline-none resize-none overflow-visible",
            wordWrap ? "whitespace-pre-wrap break-words" : "whitespace-pre"
          )}
          style={{ color: "var(--code-string)" }}
          placeholder={mode === "text" ? "Enter natural language or pidgin text..." : "Paste JSON here..."}
        />
      </div>
    </div>
  );
}

export function JsonViewer({ data }: { data: unknown }) {
  return (
    <pre
      className="h-full w-full p-4 overflow-auto text-xs font-mono leading-6 scrollbar-thin"
      style={{ background: "var(--code-bg)" }}
    >
      {renderJson(data, 0)}
    </pre>
  );
}

function renderJson(value: unknown, depth: number): React.ReactNode {
  const pad = "  ".repeat(depth);
  if (value === null) return <span style={{ color: "var(--code-number)" }}>null</span>;
  if (typeof value === "number" || typeof value === "boolean")
    return <span style={{ color: "var(--code-number)" }}>{String(value)}</span>;
  if (typeof value === "string")
    return <span style={{ color: "var(--code-string)" }}>&quot;{value}&quot;</span>;
  if (Array.isArray(value)) {
    if (value.length === 0) return <span>[]</span>;
    return (
      <>
        {"[\n"}
        {value.map((v, i) => (
          <span key={i}>
            {pad}{"  "}
            {renderJson(v, depth + 1)}
            {i < value.length - 1 ? "," : ""}
            {"\n"}
          </span>
        ))}
        {pad}
        {"]"}
      </>
    );
  }
  if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value);
    if (entries.length === 0) return <span>{"{}"}</span>;
    return (
      <>
        {"{\n"}
        {entries.map(([k, v], i) => (
          <span key={k}>
            {pad}{"  "}
            <span style={{ color: "var(--code-key)" }}>&quot;{k}&quot;</span>: {renderJson(v, depth + 1)}
            {i < entries.length - 1 ? "," : ""}
            {"\n"}
          </span>
        ))}
        {pad}
        {"}"}
      </>
    );
  }
  return null;
}
