"use client";

import { useState } from "react";
import {
  Check, Copy, Pencil, PenLine, RotateCcw, ChevronDown, Bot as BotIcon,
  
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { cn } from "@/src/lib/utils";
import { type Message, type Block } from "@/src/data/workspace-data";

function Av() {
  return (
    <div className="size-8 md:size-10 rounded-lg md:rounded-2xl bg-primary grid place-items-center text-primary-foreground shrink-0 shadow-xl shadow-primary/10 border border-white/10">
      <BotIcon className="size-4 md:size-5" />
    </div>
  );
}

export function Bubble({
  m, onLoadToEditor, onReviewSimulator, onRetry
}: {
  m: Message;
  onLoadToEditor: (data: unknown) => void;
  onAnalysis: (r: unknown, chain?: string[]) => void;
  onReviewSimulator: (data: unknown) => void;
  onRetry: (text: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const MAX_LENGTH = 450;

  const handleCopy = () => {
    const json = m.from === 'user' ? m.metadata?.payload : (m.metadata?.full_response || m.metadata?.review);
    const textBlock = m.blocks.find(b => b.kind === 'text') as Extract<Block, { kind: 'text' }> | undefined;
    const content = json ? (typeof json === 'string' ? json : JSON.stringify(json, null, 2)) : (textBlock?.text || "");
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success(json ? "JSON copied to clipboard" : "Text copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  if (m.from === "user") {
    const text = m.blocks.find((b) => b.kind === "text") as Extract<Block, { kind: "text" }> | undefined;
    return (
      <div 
        className="flex justify-end animate-in fade-in slide-in-from-right-4 duration-500 group relative"
        onClick={() => setIsActive(!isActive)}
      >
        <div className="flex flex-col items-end gap-1.5 max-w-[90%] md:max-w-[85%] cursor-pointer">
          <div className="relative group/content">
            <div className="px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-[2.5rem] md:rounded-tr-lg bg-muted text-[13px] md:text-sm leading-relaxed shadow-sm font-medium transition-all group-hover:shadow-md border border-transparent group-hover:border-border/50">
              {(!isExpanded && (text?.text || "").length > MAX_LENGTH) ? (text?.text || "").slice(0, MAX_LENGTH) + "..." : text?.text}
              {(text?.text || "").length > MAX_LENGTH && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[10px] font-bold text-primary mt-2 hover:underline transition-all flex items-center gap-1"
                >
                  {isExpanded ? "Show Less" : "View More"}
                  <ChevronDown className={cn("h-3 w-3 transition-transform", isExpanded && "rotate-180")} />
                </button>
              )}
            </div>
            <div className={cn(
              "absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 transition-all duration-300",
              isActive ? "opacity-100 pointer-events-auto" : "opacity-0 group-hover:opacity-100"
            )}>
              <button onClick={handleCopy} className="p-2 rounded-xl bg-card border border-border shadow-sm text-muted-foreground hover:text-primary transition-all hover:scale-110">{copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}</button>
              <button
                onClick={() => onLoadToEditor(m.metadata?.payload)}
                className="p-2 rounded-xl bg-card border border-border shadow-sm text-muted-foreground hover:text-primary transition-all hover:scale-110"
                title="Load Payload to Editor"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex gap-3 md:gap-4 animate-in fade-in slide-in-from-left-4 duration-500 group"
      onClick={() => setIsActive(!isActive)}
    >
      <Av />
      <div className="flex-1 min-w-0 space-y-3 md:space-y-5 cursor-pointer">
        {m.blocks.map((b, i) => {
          if (b.kind === "text") {
            const aiText = b.text || "";
            return (
              <div key={i} className="px-3 py-2.5 md:px-6 md:py-5 rounded-xl md:rounded-[2.5rem] md:rounded-tl-lg bg-card border border-border text-[13px] md:text-sm leading-relaxed max-w-[98%] md:max-w-[95%] shadow-sm font-medium transition-all hover:shadow-md relative">
                <div className="prose prose-sm dark:prose-invert prose-p:my-2 prose-ul:my-2">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {(!isExpanded && aiText.length > MAX_LENGTH) ? aiText.slice(0, MAX_LENGTH) + "..." : aiText}
                  </ReactMarkdown>
                </div>
                {aiText.length > MAX_LENGTH && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-[10px] font-bold text-primary mt-2 hover:underline transition-all flex items-center gap-1"
                  >
                    {isExpanded ? "Show Less" : "View More"}
                    <ChevronDown className={cn("h-3 w-3 transition-transform", isExpanded && "rotate-180")} />
                  </button>
                )}
              </div>
            );
          }
          return null;
        })}

        <div className={cn(
          "flex items-center gap-1 mt-2 ml-1 transition-all duration-300",
          isActive ? "opacity-100 pointer-events-auto" : "opacity-0 group-hover:opacity-100"
        )}>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-full text-muted-foreground hover:text-primary transition-colors"
            title="Copy JSON Response"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onLoadToEditor(m.metadata?.full_response || m.metadata?.review)}
            className="p-1.5 rounded-full text-muted-foreground hover:text-primary transition-colors"
            title="Load JSON to Editor"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <div className="h-3 w-px bg-border mx-0.5" />
          <button
            onClick={() => {
              const retryBlock = m.blocks.find(b => b.kind === 'text') as Extract<Block, { kind: 'text' }> | undefined;
              onRetry(retryBlock ? (retryBlock.text || "").slice(0, 120) : "");
            }}
            title="Retry"
            className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border transition-all"
          >
            <RotateCcw className="h-3 w-3" /> Retry
          </button>
          {!!(m.hasSimulator || m.metadata?.resultId) && (
            <>
              <div className="h-3 w-px bg-border mx-0.5" />
              <button
                onClick={() => onReviewSimulator(m.metadata)}
                className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold text-primary hover:bg-primary/10 border border-primary/20 transition-all shadow-sm"
              >
                <PenLine className="h-3 w-3" /> View Output
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
