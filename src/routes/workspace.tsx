import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, Copy, Download, FileJson, Loader2, MessageSquare, Send, Star, Target, X,
} from "lucide-react";
import { TopNav } from "@/components/site-nav";
import { JsonEditor, JsonViewer } from "@/components/json-editor";
import {
  RECOMMEND_INTRO, RECOMMEND_REASONING, RECOMMEND_RESPONSE, RECOMMEND_TEMPLATES,
  REVIEW_INTRO, REVIEW_REASONING, REVIEW_RESPONSE, REVIEW_TEMPLATES,
  validatePayload, type Mode,
} from "@/lib/workspace-data";

export const Route = createFileRoute("/workspace")({
  head: () => ({
    meta: [
      { title: "Workspace — AnD AI" },
      { name: "description", content: "Build payloads and run AnD AI agents for review generation and recommendations." },
    ],
  }),
  component: Workspace,
});

type Phase = "intro" | "loading" | "streaming" | "done";

function ModeSwitch({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return (
    <div className="glass rounded-full p-1 inline-flex text-sm">
      {([
        { k: "review", l: "📝 Review Generation" },
        { k: "recommend", l: "🎯 Recommendation" },
      ] as const).map((o) => (
        <button
          key={o.k}
          onClick={() => setMode(o.k)}
          className={`px-4 py-2 rounded-full transition font-medium ${
            mode === o.k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-5 ${i < Math.round(value) ? "fill-primary text-primary" : "text-muted-foreground/40"}`}
        />
      ))}
      <span className="ml-2 text-sm text-muted-foreground">{value.toFixed(1)} / 5</span>
    </div>
  );
}

function flattenForCsv(obj: any, prefix = "", out: Record<string, string> = {}) {
  if (obj === null || obj === undefined) {
    out[prefix] = "";
  } else if (Array.isArray(obj)) {
    obj.forEach((v, i) => flattenForCsv(v, `${prefix}[${i}]`, out));
  } else if (typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      flattenForCsv(v, prefix ? `${prefix}.${k}` : k, out);
    }
  } else {
    out[prefix] = String(obj);
  }
  return out;
}

function downloadBlob(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function ResultActions({ data }: { data: any }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  const onJson = () => downloadBlob(JSON.stringify(data, null, 2), "and-ai-result.json", "application/json");
  const onCsv = () => {
    const flat = flattenForCsv(data?.output ?? data);
    const rows = [["key", "value"], ...Object.entries(flat)]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    downloadBlob(rows, "and-ai-result.csv", "text/csv");
  };
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      <button onClick={onCopy} className="text-xs inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 hover:border-primary/40 transition">
        <Copy className="size-3.5" /> {copied ? "Copied!" : "Copy JSON"}
      </button>
      <button onClick={onJson} className="text-xs inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 hover:border-primary/40 transition">
        <Download className="size-3.5" /> Download JSON
      </button>
      <button onClick={onCsv} className="text-xs inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 hover:border-primary/40 transition">
        <FileJson className="size-3.5" /> Download CSV
      </button>
    </div>
  );
}

function AgentPanel({
  mode, phase, streamedSteps, result,
}: {
  mode: Mode; phase: Phase; streamedSteps: string[]; result: any;
}) {
  const intro = mode === "review" ? REVIEW_INTRO : RECOMMEND_INTRO;
  const Icon = mode === "review" ? MessageSquare : Target;
  const rating = result?.output?.predicted_rating;
  return (
    <div className="glass rounded-2xl p-5 h-full flex flex-col gap-4 overflow-hidden">
      <div className="flex items-center gap-2 pb-3 border-b border-border">
        <div className="size-8 rounded-lg bg-primary/15 ring-1 ring-primary/30 grid place-items-center">
          <Icon className="size-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold">AnD {mode === "review" ? "Review" : "Recommendation"} Agent</p>
          <p className="text-xs text-muted-foreground">v1.0 · culturally grounded</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
        {phase === "intro" && (
          <div className="rounded-2xl rounded-tl-sm bg-secondary/60 p-4 text-sm whitespace-pre-line animate-fade-up">
            {intro}
          </div>
        )}

        {(phase === "loading" || phase === "streaming" || phase === "done") &&
          streamedSteps.map((s, i) => (
            <div key={i} className="rounded-2xl rounded-tl-sm bg-secondary/60 p-3 text-sm animate-fade-up">
              {s}
            </div>
          ))}

        {phase === "loading" && (
          <div className="rounded-2xl rounded-tl-sm bg-secondary/60 p-3 inline-flex">
            <span className="dot-pulse"><span /><span /><span /></span>
          </div>
        )}

        {phase === "done" && result && (
          <div className="rounded-2xl bg-secondary/40 p-4 animate-fade-up">
            <p className="text-xs uppercase tracking-widest text-primary mb-3">Final Output</p>
            {typeof rating === "number" && (
              <div className="mb-3">
                <StarRating value={rating} />
              </div>
            )}
            <JsonViewer data={result} />
            <ResultActions data={result} />
          </div>
        )}
      </div>
    </div>
  );
}

function EditorPanel({
  mode, value, setValue, onSubmit, status, errorMsg, missing, submitting,
}: {
  mode: Mode;
  value: string;
  setValue: (v: string) => void;
  onSubmit: () => void;
  status: "valid" | "invalid" | "warning";
  errorMsg?: string;
  missing: string[];
  submitting: boolean;
}) {
  const templates = mode === "review" ? REVIEW_TEMPLATES : RECOMMEND_TEMPLATES;
  const keys = Object.keys(templates);
  const defaultKey = keys.includes("Blank Template") ? "Blank Template" : keys[0];
  const [selected, setSelected] = useState<string>(defaultKey);

  useEffect(() => {
    setSelected(defaultKey);
  }, [mode]); // eslint-disable-line

  const onPick = (name: string) => {
    setSelected(name);
    setValue(JSON.stringify(templates[name], null, 2));
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <label className="text-xs uppercase tracking-widest text-muted-foreground">Template</label>
        <select
          value={selected}
          onChange={(e) => onPick(e.target.value)}
          className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/60"
        >
          {keys.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
      </div>

      <JsonEditor value={value} onChange={setValue} status={status} />

      {status === "invalid" && errorMsg && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 text-destructive text-sm px-3 py-2">
          ❌ {errorMsg}
        </div>
      )}
      {status === "warning" && missing.length > 0 && (
        <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 text-sm px-3 py-2 space-y-0.5">
          {missing.map((m) => (
            <div key={m}>⚠️ Missing required field: {m}</div>
          ))}
        </div>
      )}
      {status === "valid" && (
        <div className="inline-flex items-center gap-2 text-sm text-primary">
          <span className="size-2 rounded-full bg-primary" /> ✅ Ready to submit
        </div>
      )}

      <button
        disabled={status !== "valid" || submitting}
        onClick={onSubmit}
        className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-medium transition ${
          status === "valid" && !submitting
            ? "bg-primary text-primary-foreground hover:glow-primary"
            : "bg-secondary text-muted-foreground cursor-not-allowed"
        }`}
      >
        {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        {submitting ? "Agent thinking..." : "Submit to Agent →"}
      </button>
    </div>
  );
}

function Workspace() {
  const [mode, setMode] = useState<Mode>("review");
  const [value, setValue] = useState<string>(() =>
    JSON.stringify(REVIEW_TEMPLATES["Blank Template"], null, 2)
  );
  const [phase, setPhase] = useState<Phase>("intro");
  const [streamed, setStreamed] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const def = mode === "review"
      ? REVIEW_TEMPLATES["Blank Template"]
      : RECOMMEND_TEMPLATES["Blank Template"];
    setValue(JSON.stringify(def, null, 2));
    setPhase("intro");
    setStreamed([]);
    setResult(null);
    setSubmitting(false);
    setResultOpen(false);
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, [mode]);

  const validation = useMemo(() => validatePayload(mode, value), [value, mode]);
  const status: "valid" | "invalid" | "warning" = validation.parseError
    ? "invalid"
    : validation.missing.length > 0
    ? "warning"
    : "valid";

  const submit = () => {
    if (status !== "valid") return;
    setSubmitting(true);
    setPhase("loading");
    setStreamed([]);
    setResult(null);
    setMobileOpen(false);

    const steps = mode === "review" ? REVIEW_REASONING : RECOMMEND_REASONING;
    const response = mode === "review" ? REVIEW_RESPONSE : RECOMMEND_RESPONSE;

    // network delay before streaming
    const startDelay = 900;
    timers.current.push(
      window.setTimeout(() => {
        setPhase("streaming");
        steps.forEach((s, i) => {
          timers.current.push(
            window.setTimeout(() => {
              setStreamed((prev) => [...prev, s]);
              if (i === steps.length - 1) {
                timers.current.push(
                  window.setTimeout(() => {
                    setResult(response);
                    setPhase("done");
                    setSubmitting(false);
                  }, 500)
                );
              }
            }, 600 * (i + 1))
          );
        });
      }, startDelay)
    );
  };

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav>
        <div className="hidden sm:block">
          <ModeSwitch mode={mode} setMode={setMode} />
        </div>
      </TopNav>

      <div className="sm:hidden border-b border-border px-4 py-3 flex justify-center">
        <ModeSwitch mode={mode} setMode={setMode} />
      </div>

      {/* DESKTOP */}
      <main className="hidden md:grid flex-1 mx-auto max-w-[1400px] w-full p-6 gap-6 grid-cols-[35fr_65fr]">
        <AgentPanel mode={mode} phase={phase} streamedSteps={streamed} result={result} />
        <EditorPanel
          mode={mode}
          value={value}
          setValue={setValue}
          onSubmit={submit}
          status={status}
          errorMsg={validation.parseError}
          missing={validation.missing}
          submitting={submitting}
        />
      </main>

      {/* MOBILE */}
      <main className="md:hidden flex-1 p-4 flex flex-col gap-4">
        <div className="glass rounded-2xl p-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Template</p>
          <select
            onChange={(e) => {
              const t = (mode === "review" ? REVIEW_TEMPLATES : RECOMMEND_TEMPLATES)[e.target.value];
              setValue(JSON.stringify(t, null, 2));
            }}
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm outline-none"
          >
            {Object.keys(mode === "review" ? REVIEW_TEMPLATES : RECOMMEND_TEMPLATES).map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          <button
            onClick={() => setMobileOpen(true)}
            className="mt-3 w-full rounded-xl bg-primary text-primary-foreground py-3 font-medium hover:glow-primary transition"
          >
            Open Editor
          </button>
        </div>
        <AgentPanel mode={mode} phase={phase} streamedSteps={streamed} result={result} />
      </main>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <p className="font-semibold">Build Your Payload</p>
            <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full hover:bg-secondary">
              <X className="size-5" />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <EditorPanel
              mode={mode}
              value={value}
              setValue={setValue}
              onSubmit={submit}
              status={status}
              errorMsg={validation.parseError}
              missing={validation.missing}
              submitting={submitting}
            />
          </div>
        </div>
      )}
    </div>
  );
}
