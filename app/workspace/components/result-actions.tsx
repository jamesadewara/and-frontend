"use client";

import { useState } from "react";
import { Copy, Download, FileJson } from "lucide-react";
import { type AgentResponse } from "@/src/data/workspace-data";

function flattenForCsv(obj: unknown, prefix = "", out: Record<string, string> = {}) {
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

export function ResultActions({ data }: { data: unknown }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  const onJson = () => downloadBlob(JSON.stringify(data, null, 2), "and-ai-result.json", "application/json");
  const onCsv = () => {
    const output = (data as AgentResponse)?.output ?? data;
    const flat = flattenForCsv(output);
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
