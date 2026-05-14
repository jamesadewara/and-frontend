"use client";

import { MessageSquare, Target, Send, Loader2, Terminal, ChevronDown, Trash2, Square } from "lucide-react";
import { Bubble } from "./bubble";
import { type Mode, type Phase, type AgentResponse, type Message, REVIEW_INTRO, RECOMMEND_INTRO } from "@/src/data/workspace-data";
import { useState, useEffect } from "react";
import { cn } from "@/src/lib/utils";

export function AgentPanel({
  mode, phase, streamedSteps, status, submitting, onSubmit, consoleOpen, setConsoleOpen,
  messages, onLoadToEditor, handleRetry,
  hasWarnings, typing, isLive, onClearMessages, onOpenSimulator, onCancel,
  hideFooterOnMobile = false
}: {
  mode: Mode;
  phase: Phase;
  streamedSteps: string[];
  result: AgentResponse | null;
  status: "valid" | "invalid" | "warning";
  submitting: boolean;
  onSubmit: () => void;
  onCancel?: () => void;
  consoleOpen: boolean;
  setConsoleOpen: (open: boolean) => void;
  messages: Message[];
  onLoadToEditor: (data: unknown) => void;
  handleRetry: (text: string) => void;
  hasWarnings: boolean;
  typing: boolean;
  isLive: { taskA: boolean; taskB: boolean };
  onClearMessages: () => void;
  onOpenSimulator: (data: unknown) => void;
  hideFooterOnMobile?: boolean;
}) {
  const intro = mode === "review" ? REVIEW_INTRO : RECOMMEND_INTRO;
  const Icon = mode === "review" ? MessageSquare : Target;
  const [isReasoningExpanded, setIsReasoningExpanded] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const healthy = mode === "review" ? isLive.taskA : isLive.taskB;

useEffect(() => {
  const frame = requestAnimationFrame(() => {
    setIsMounted(true);
  });
  
  return () => cancelAnimationFrame(frame);
}, []);

  return (
    <div className="glass rounded-0 md:rounded-2xl h-full flex flex-col overflow-hidden border-none md:border md:border-border">
      <div className="px-4 py-3 md:p-5 flex items-center justify-between border-b border-border bg-secondary/10">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-primary/15 ring-1 ring-primary/30 grid place-items-center">
            <Icon className="size-5 text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold">AnD {mode === "review" ? "Review" : "Recommendation"} Agent</p>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary/50 border border-border">
                <span className={`size-1.5 rounded-full ${healthy ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
                <span className={`text-[9px] font-bold uppercase tracking-wider ${healthy ? 'text-emerald-500' : 'text-red-500'}`}>
                  {healthy ? 'Live' : 'Offline'}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">v1.0 · culturally grounded</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isMounted && messages.length > 0 && (
            <button
              onClick={onClearMessages}
              disabled={submitting}
              className="p-2 rounded-lg border border-border hover:bg-destructive/10 hover:border-destructive/40 text-muted-foreground hover:text-destructive transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              title="Clear Chat History"
            >
              <Trash2 className="size-4" />
            </button>
          )}
        </div>
      </div>

      <div className={cn("flex-1 overflow-y-auto p-2 md:p-5 space-y-3 md:space-y-8 scrollbar-thin relative", hideFooterOnMobile && "pb-28 md:pb-5")}>
        {isMounted && messages.length === 0 && (
          <div className="rounded-2xl rounded-tl-sm bg-secondary/60 p-4 text-sm whitespace-pre-line animate-fade-up border border-border/50">
            {intro}
          </div>
        )}

        {isMounted && messages.filter(m => m.mode === mode).map((m) => (
          <Bubble
            key={m.id}
            m={m}
            onLoadToEditor={onLoadToEditor}
            onAnalysis={() => { }}
            onReviewSimulator={(data) => onOpenSimulator(data)}
            onRetry={handleRetry}
          />
        ))}

        {isMounted && typing && (
          <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="h-10 w-10 rounded-2xl bg-primary grid place-items-center text-primary-foreground shrink-0 shadow-xl shadow-primary/10 border border-white/10">
              <Icon className="size-5" />
            </div>
            <div className="flex flex-col gap-2 max-w-[85%]">
              <div className="px-6 py-4 rounded-xl md:rounded-[2.5rem] md:rounded-tl-lg bg-card border border-border shadow-sm flex items-center gap-1.5 w-fit">
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
              </div>
            </div>
          </div>
        )}

        {isMounted && submitting && (phase === "streaming" || phase === "loading") && (
          <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col gap-2 ml-1">
              <button
                type="button"
                onClick={() => setIsReasoningExpanded(!isReasoningExpanded)}
                className="text-[10px] font-bold text-primary/70 tracking-widest hover:text-primary transition-colors flex items-center gap-1.5 w-fit bg-primary/5 px-3 py-1 rounded-full border border-primary/10"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                {isReasoningExpanded ? "Hide Reasoning" : "View Reasoning approach"}
                <ChevronDown className={cn("h-3 w-3 transition-transform", isReasoningExpanded && "rotate-180")} />
              </button>

              {isReasoningExpanded && (
                <div className="flex flex-col gap-1.5 p-3 rounded-xl md:rounded-2xl rounded-tl-lg bg-primary/5 border border-primary/10 animate-in fade-in slide-in-from-top-2 duration-500 shadow-inner max-h-62.5 overflow-y-auto scrollbar-none">
                  <div className="text-[8px] font-bold text-primary/40 uppercase tracking-[0.2em] mb-1 px-1">Reasoning Log</div>
                  
                  {streamedSteps.length > 0 ? (
                    streamedSteps.map((step, idx) => (
                      <div key={idx} className="flex gap-2 text-[10px] leading-tight text-foreground/70 font-medium animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 40}ms` }}>
                        <div className="size-1.5 rounded-full bg-primary/20 shrink-0 mt-1.5" />
                        <span className="">{step}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex gap-2 text-[10px] leading-tight text-primary/40 font-medium italic animate-pulse px-1 py-1">
                      Connecting to agent signal...
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-1 px-1">
                    <span className="text-[8px] font-bold text-primary/30 animate-pulse uppercase tracking-tighter">
                      {phase === 'loading' ? 'Initializing...' : 'Processing...'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className={cn("p-4 border-t border-border bg-secondary/20 flex gap-2", hideFooterOnMobile && "hidden md:flex")}>
        <div className="relative">
          <button
            onClick={() => setConsoleOpen(!consoleOpen)}
            className={`p-3 rounded-lg md:rounded-xl border border-border transition-all ${consoleOpen ? 'bg-primary/10 border-primary/40 text-primary' : 'bg-background hover:bg-secondary'}`}
            title="Toggle Console (Ctrl+J)"
          >
            <Terminal className="size-5" />
          </button>
          {isMounted && hasWarnings && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </div>
        
        {isMounted && submitting && (
          <button
            onClick={onCancel}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg md:rounded-xl px-6 py-3 font-bold bg-red-500/90 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all animate-pulse"
            title="Stop the agent thinking process"
          >
            <Square className="size-5 fill-current" />
            <span>Stop</span>
          </button>
        )}
        
        {isMounted && !submitting && (
          <button
            disabled={status === "invalid" || submitting}
            onClick={onSubmit}
            className={`flex-1 inline-flex items-center justify-center gap-3 rounded-lg md:rounded-xl px-6 py-3 font-bold transition-all ${status !== "invalid" && !submitting
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10 hover:scale-[1.01] active:scale-[0.99]"
              : "bg-secondary text-muted-foreground cursor-not-allowed opacity-50"
              }`}
          >
            {submitting ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
            <span>{submitting ? "Agent Thinking..." : "Submit to Agent"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
