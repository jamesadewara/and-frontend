import { useMemo } from "react";

export function JsonEditor({
  value,
  onChange,
  status,
}: {
  value: string;
  onChange: (v: string) => void;
  status: "valid" | "invalid" | "warning";
}) {
  const lines = useMemo(() => value.split("\n"), [value]);
  const borderColor =
    status === "valid"
      ? "border-primary/60"
      : status === "invalid"
      ? "border-destructive/60"
      : "border-border";

  return (
    <div
      className={`rounded-xl border-2 ${borderColor} transition-colors overflow-auto flex-1 scrollbar-thin group`}
      style={{ background: "var(--code-bg)" }}
    >
      <div className="flex font-mono text-xs md:text-sm min-w-max min-h-full">
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
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          wrap="off"
          rows={Math.max(lines.length, 12)}
          className="flex-1 min-w-[500px] md:min-w-[800px] py-2 md:py-4 px-3 md:px-4 leading-5 md:leading-6 bg-transparent outline-none resize-none whitespace-pre overflow-visible"
          style={{ color: "var(--code-string)" }}
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

function renderJson(value: any, depth: number): React.ReactNode {
  const pad = "  ".repeat(depth);
  if (value === null) return <span style={{ color: "var(--code-number)" }}>null</span>;
  if (typeof value === "number" || typeof value === "boolean")
    return <span style={{ color: "var(--code-number)" }}>{String(value)}</span>;
  if (typeof value === "string")
    return <span style={{ color: "var(--code-string)" }}>"{value}"</span>;
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
  if (typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) return <span>{"{}"}</span>;
    return (
      <>
        {"{\n"}
        {entries.map(([k, v], i) => (
          <span key={k}>
            {pad}{"  "}
            <span style={{ color: "var(--code-key)" }}>"{k}"</span>: {renderJson(v, depth + 1)}
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
