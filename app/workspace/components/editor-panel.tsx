"use client";

import { useEffect, useState } from "react";
import { FileJson, Loader2, Send, Trash2 } from "lucide-react";
import { type Mode, REVIEW_TEMPLATES, RECOMMEND_TEMPLATES } from "@/src/data/workspace-data";
import { JsonEditor } from "@/src/components/json-editor";

export function EditorPanel({
  mode, value, setValue, status, errorMsg, missing, submitting, onClear,
}: {
  mode: Mode;
  value: string;
  setValue: (v: string) => void;
  status: "valid" | "invalid" | "warning";
  errorMsg?: string;
  missing: string[];
  submitting: boolean;
  onClear: () => void;
}) {
  const templates = mode === "review" ? REVIEW_TEMPLATES : RECOMMEND_TEMPLATES;
  const keys = Object.keys(templates);
  const defaultKey = keys.includes("Blank Template") ? "Blank Template" : keys[0];
  const [selected, setSelected] = useState<string>(defaultKey);

  useEffect(() => {
    setSelected(defaultKey);
  }, [mode, defaultKey]);

  const onPick = (name: string) => {
    setSelected(name);
    setValue(JSON.stringify(templates[name], null, 2));
  };

  return (
    <div className="flex flex-col gap-2 md:gap-4 h-full overflow-hidden">
      <div className="flex flex-wrap gap-2 items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-secondary grid place-items-center">
            <FileJson className="size-4 text-muted-foreground" />
          </div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Payload Editor</label>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selected}
            onChange={(e) => onPick(e.target.value)}
            className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-xs font-medium outline-none focus:border-primary/60 transition-colors"
          >
            {keys.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          <button 
            onClick={onClear}
            disabled={submitting}
            className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 hover:border-destructive/40 text-muted-foreground hover:text-destructive transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            title="Clear Payload"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      <JsonEditor value={value} onChange={setValue} status={status} />
    </div>
  );
}
