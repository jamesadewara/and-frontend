"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, Copy, Download, FileJson, Loader2, MessageSquare, Send, Star, Target, X, Terminal, Trash2
} from "lucide-react";
import { TopNav } from "@/src/components/site-nav";
import { JsonEditor, JsonViewer } from "@/src/components/json-editor";
import { config } from "@/src/lib/config";
import {
  REVIEW_TEMPLATES,
  validatePayload, type Mode, type Message,
  RECOMMEND_TEMPLATES
} from "@/src/data/workspace-data";

import { ModeSwitch } from "./components/mode-switch";
import { StarRating } from "./components/star-rating";
import { ResultActions } from "./components/result-actions";
import { AgentPanel } from "./components/agent-panel";
import { EditorPanel } from "./components/editor-panel";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/src/components/ui/resizable";
import { useAgentStream, useHealthCheck } from "@/src/hooks/system/useTask";
import { toast } from "sonner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/src/components/ui/drawer";
import { cn } from "@/src/lib/utils";

export default function WorkspaceClient() {
  const [mode, setMode] = useState<Mode>("review");
  const [value, setValue] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`and_payload_${mode}`);
      if (saved) return saved;
    }
    return JSON.stringify(REVIEW_TEMPLATES["Blank Template"], null, 2);
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    submit: runStream,
    cancel: cancelStream,
    phase,
    streamedSteps: streamed,
    result,
    isSubmitting: submitting,
    error: streamError,
    setPhase,
    setStreamedSteps,
    setResult,
    setIsSubmitting
  } = useAgentStream(mode);

  const isLive = useHealthCheck();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "j") {
        e.preventDefault();
        setConsoleOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Persistence
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("and_messages");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load messages", e);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("and_messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(`and_payload_${mode}`, value);
  }, [value, mode]);

  useEffect(() => {
    const def = mode === "review"
      ? REVIEW_TEMPLATES["Blank Template"]
      : RECOMMEND_TEMPLATES["Blank Template"];
    const saved = localStorage.getItem(`and_payload_${mode}`);
    setValue(saved || JSON.stringify(def, null, 2));

    setPhase("intro");
    setStreamedSteps([]);
    setResult(null);
    setIsSubmitting(false);
    setResultOpen(false);
    cancelStream();
  }, [mode, cancelStream, setPhase, setStreamedSteps, setResult, setIsSubmitting]);

  const validation = useMemo(() => validatePayload(mode, value), [value, mode]);
  const status: "valid" | "invalid" | "warning" = validation.parseError
    ? "invalid"
    : validation.missing.length > 0
      ? "warning"
      : "valid";

  const handleClearPayload = () => {
    const def = mode === "review"
      ? REVIEW_TEMPLATES["Blank Template"]
      : RECOMMEND_TEMPLATES["Blank Template"];
    setValue(JSON.stringify(def, null, 2));
    toast.success("Payload cleared");
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem("and_messages");
    toast.success("Chat history cleared");
  };

  const submit = async () => {
    if (status !== "valid") {
      const errorMsg = validation.parseError
        ? "JSON Syntax Error"
        : `Missing fields: ${validation.missing.join(", ")}`;

      toast.error(`Validation Failed: ${errorMsg}`);
      setConsoleOpen(true);
      return;
    }

    // Add user message
    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      from: "user",
      blocks: [{ kind: "text", text: `Mode: ${mode}\nPayload: ${value.slice(0, 100)}...` }],
      timestamp: Date.now(),
      metadata: { payload: value }
    };
    setMessages(prev => [...prev, userMsg]);

    setMobileOpen(false);

    try {
      const parsed = JSON.parse(value);
      await runStream(parsed);
    } catch (e) {
      console.error("Submission failed", e);
      toast.error("Submission failed. Check console for details.");
      setConsoleOpen(true);
    }
  };

  // Watch for result to append agent message
  useEffect(() => {
    if (result && phase === "done") {
      setResultOpen(true);
      const agentMsg: Message = {
        id: Math.random().toString(36).substring(7),
        from: "agent",
        blocks: [
          { kind: "text", text: result.review_text || "Recommendations ready." },
          ...(result.recommendations ? result.recommendations.map((r: any) => ({ kind: "rec" as const, data: r })) : [])
        ],
        timestamp: Date.now(),
        hasAnalysis: true,
        hasSimulator: mode === "review",
        metadata: {
          recommendations: result.recommendations,
          reasoning_chain: streamed,
          review: result,
          full_response: result
        }
      };
      setMessages(prev => [...prev, agentMsg]);
    }
  }, [result, phase, mode, streamed]);

  const handleOpenSimulator = (data: any) => {
    setResult(data);
    setResultOpen(true);
  };

  const handleRetry = (text: string) => {
    toast.info("Retrying with: " + text);
    submit();
  };

  const handleLoadToEditor = (data: any) => {
    const json = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    setValue(json);
    toast.success("Loaded to editor");
  };

  const [consoleLogs, setConsoleLogs] = useState<{ id: string; type: 'info' | 'warn' | 'error' | 'success' | 'system'; msg: string; time: string }[]>([
    { id: '1', type: 'system', msg: 'Initializing AnD Agent Node v1.0.4...', time: new Date().toLocaleTimeString([], { hour12: false }) },
    { id: '2', type: 'system', msg: `Active node configuration: ${mode.toUpperCase()}`, time: new Date().toLocaleTimeString([], { hour12: false }) }
  ]);

  const addLog = useCallback((msg: string, type: 'info' | 'warn' | 'error' | 'success' | 'system' = 'info') => {
    setConsoleLogs(prev => [
      ...prev,
      { id: Math.random().toString(36).substring(7), type, msg, time: new Date().toLocaleTimeString([], { hour12: false }) }
    ].slice(-100)); // Keep last 100 logs
  }, []);

  const clearConsole = () => {
    setConsoleLogs([]);
    toast.success("Console cleared");
  };

  useEffect(() => {
    addLog(`Switched to ${mode.toUpperCase()} mode`, 'system');
  }, [mode, addLog]);

  useEffect(() => {
    if (streamError) addLog(streamError, 'error');
  }, [streamError, addLog]);

  useEffect(() => {
    if (validation.parseError) addLog(`JSON Error: ${validation.parseError}`, 'error');
    if (validation.missing.length > 0) {
      validation.missing.forEach(m => addLog(`Missing field: ${m}`, 'warn'));
    }
  }, [validation.parseError, validation.missing, addLog]);

  const [consoleHeight, setConsoleHeight] = useState(350);
  const isResizing = useRef(false);

  const startResizing = (e: React.MouseEvent) => {
    isResizing.current = true;
    document.addEventListener("mousemove", handleResizing);
    document.addEventListener("mouseup", stopResizing);
  };

  const handleResizing = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const newHeight = window.innerHeight - e.clientY;
    if (newHeight > 100 && newHeight < window.innerHeight * 0.8) {
      setConsoleHeight(newHeight);
    }
  };

  const stopResizing = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleResizing);
    document.removeEventListener("mouseup", stopResizing);
  };

  if (!isMounted) return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background selection:bg-primary/20 relative">
      <TopNav>
        <div className="">
          <ModeSwitch mode={mode} setMode={setMode} />
        </div>
      </TopNav>

      {/* DESKTOP */}
      <main className="hidden md:flex flex-1 mx-auto max-w-[1440px] w-full p-6 gap-0 overflow-hidden">
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel defaultSize={400} minSize={380}>
            <AgentPanel
              mode={mode}
              phase={phase}
              streamedSteps={streamed}
              result={result}
              status={status}
              submitting={submitting}
              onSubmit={submit}
              consoleOpen={consoleOpen}
              setConsoleOpen={setConsoleOpen}
              messages={messages}
              onLoadToEditor={handleLoadToEditor}
              handleRetry={handleRetry}
              hasWarnings={validation.missing.length > 0}
              typing={submitting && phase !== "done"}
              isLive={isLive}
              onClearMessages={clearMessages}
              onOpenSimulator={handleOpenSimulator}
            />
          </ResizablePanel>

          <ResizableHandle className="w-1.5 hover:bg-primary/20 transition-colors mx-2 rounded-full cursor-col-resize group flex items-center justify-center">
            <div className="w-px h-8 bg-border group-hover:bg-primary/40" />
          </ResizableHandle>

          <ResizablePanel defaultSize={700} minSize={600}>
            <EditorPanel
              mode={mode}
              value={value}
              setValue={setValue}
              status={status}
              errorMsg={validation.parseError}
              missing={validation.missing}
              submitting={submitting}
              onClear={handleClearPayload}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>

      {/* MOBILE */}
      <main className="md:hidden flex-1 flex flex-col overflow-hidden relative bg-secondary/5">
        <div className="flex-1 overflow-hidden relative">
          <div className="h-full p-0 md:p-4 overflow-hidden">
            <AgentPanel
              mode={mode}
              phase={phase}
              streamedSteps={streamed}
              result={result}
              status={status}
              submitting={submitting}
              onSubmit={submit}
              consoleOpen={consoleOpen}
              setConsoleOpen={setConsoleOpen}
              messages={messages}
              onLoadToEditor={handleLoadToEditor}
              handleRetry={handleRetry}
              hasWarnings={validation.missing.length > 0}
              typing={submitting && phase !== "done"}
              isLive={isLive}
              onClearMessages={clearMessages}
              onOpenSimulator={handleOpenSimulator}
              hideFooterOnMobile
            />
          </div>

          {/* Floating Mobile Controls */}
          <div className="absolute bottom-3 left-3 right-3 flex flex-row items-center justify-center gap-1.5 pointer-events-none">
            <div className="pointer-events-auto flex-1 max-w-[150px]">
              <Drawer open={mobileOpen} onOpenChange={setMobileOpen}>
                <DrawerTrigger asChild>
                  <button className="w-full glass rounded-xl py-3 font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg border-primary/10 hover:bg-primary/5 transition-all bg-primary/10 text-primary">
                    <FileJson className="size-3" />
                    Payload
                  </button>
                </DrawerTrigger>
                <DrawerContent className="h-[92vh] border-none glass-dark">
                  <div className="flex flex-col h-full overflow-hidden">
                    <DrawerHeader className="px-4 pt-4 pb-2">
                      <div className="flex items-center justify-between">
                        <DrawerTitle className="text-xl font-bold tracking-tight">Configure Payload</DrawerTitle>
                        <DrawerClose className="p-2 rounded-full hover:bg-secondary/20 transition-colors">
                          <X className="size-5" />
                        </DrawerClose>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Adjust parameters for the {mode} agent signal.</p>
                    </DrawerHeader>

                    <div className="flex-1 overflow-hidden px-4 py-2 flex flex-col">
                      <EditorPanel
                        mode={mode}
                        value={value}
                        setValue={setValue}
                        status={status}
                        errorMsg={validation.parseError}
                        missing={validation.missing}
                        submitting={submitting}
                        onClear={handleClearPayload}
                      />
                    </div>

                    <div className="p-4 border-t border-border/10 bg-secondary/5">
                      <button
                        disabled={status !== "valid" || submitting}
                        onClick={submit}
                        className={`w-full rounded-xl py-4 font-bold text-sm transition-all flex items-center justify-center gap-3 shadow-xl ${status === 'valid' && !submitting ? 'bg-primary text-primary-foreground shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]' : 'bg-secondary text-muted-foreground opacity-50'}`}
                      >
                        {submitting ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
                        {submitting ? "Agent Processing..." : "Submit to Agent"}
                      </button>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>

            <button
              onClick={() => setConsoleOpen(true)}
              className="pointer-events-auto flex-1 max-w-[150px] glass rounded-xl py-3 font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 border-border/40 hover:bg-secondary/50 transition-all text-muted-foreground shadow-sm"
            >
              <Terminal className="size-3" />
              Console
            </button>
          </div>
        </div>
      </main>

      {/* CONSOLE UI - Fixed modal at bottom */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ease-in-out ${consoleOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ height: consoleOpen ? `${consoleHeight}px` : '0' }}
      >
        <div className="w-full h-full flex flex-col bg-background border-t border-border shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] overflow-hidden">
          {/* Resize Handle */}
          <div
            onMouseDown={startResizing}
            className="h-1.5 w-full hover:bg-primary/40 cursor-ns-resize transition-colors flex items-center justify-center group"
          >
            <div className="w-12 h-1 rounded-full bg-border group-hover:bg-primary/60" />
          </div>

          <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-secondary/30 shrink-0">
            <div className="flex items-center gap-2">
              <Terminal className="size-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Agent Console Log</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearConsole}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all border border-border/50 hover:border-destructive/30"
              >
                <Trash2 className="size-3" />
                Clear
              </button>
              <button onClick={() => setConsoleOpen(false)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                <X className="size-4" />
              </button>
            </div>
          </div>
          <div className="p-6 flex-1 overflow-auto font-mono text-xs space-y-3 bg-[#0d1117] text-[#e6edf3] scrollbar-thin">
            {/* SYSTEM STATUS HEADERS */}
            <div className="grid grid-cols-2 gap-4 mb-6 pb-4 border-b border-white/10">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Review Service (8000)</span>
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${isLive.taskA ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-red-400 animate-pulse'}`} />
                  <span className={`font-bold ${isLive.taskA ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isLive.taskA ? 'SYSTEM ONLINE' : 'SYSTEM OFFLINE'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Recommend Service (8001)</span>
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${isLive.taskB ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-red-400 animate-pulse'}`} />
                  <span className={`font-bold ${isLive.taskB ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isLive.taskB ? 'SYSTEM ONLINE' : 'SYSTEM OFFLINE'}
                  </span>
                </div>
              </div>
            </div>

            {/* LOG ENTRIES */}
            <div className="space-y-1.5">
              {consoleLogs.map(log => (
                <div key={log.id} className="flex gap-2 py-0.5 animate-in fade-in slide-in-from-left-2 duration-300">
                  <span className="shrink-0 text-muted-foreground/40 text-[10px]">[{log.time}]</span>
                  <span className={cn(
                    "font-medium",
                    log.type === 'error' && "text-red-400",
                    log.type === 'warn' && "text-yellow-400",
                    log.type === 'success' && "text-emerald-400",
                    log.type === 'system' && "text-primary/70",
                    log.type === 'info' && "text-[#e6edf3]/80"
                  )}>
                    {log.type === 'error' && "❌ "}
                    {log.type === 'warn' && "⚠️ "}
                    {log.type === 'success' && "✅ "}
                    {log.type === 'system' && "# "}
                    {log.msg}
                  </span>
                </div>
              ))}

              {submitting && (
                <div className="text-primary animate-pulse flex gap-2 py-1 border-y border-primary/10 bg-primary/5 mt-2">
                  <span className="shrink-0 text-primary/50 text-[10px]">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                  <span className="font-bold"># RUNNING AGENT PIPELINE: {phase.toUpperCase()}...</span>
                </div>
              )}

              {!submitting && phase === 'done' && (
                <div className="text-emerald-400 flex gap-2 py-1 bg-emerald-400/5 px-2 rounded mt-2">
                  <span className="shrink-0 text-emerald-500/50 text-[10px]">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                  <span># SIGNAL PROCESSED. RESPONSE GENERATED SUCCESSFULLY.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {resultOpen && result && (
        <div className="fixed inset-0 z-[60] bg-background flex flex-col animate-fade-up overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border bg-card">
            <button
              onClick={() => setResultOpen(false)}
              className="inline-flex items-center gap-2 text-sm rounded-full glass px-3 py-1.5 hover:border-primary/40 transition"
            >
              <ArrowLeft className="size-4" /> Back
            </button>
            <p className="font-semibold text-sm sm:text-base">
              {mode === "review" ? "Review Agent Output" : "Recommendation Agent Output"}
            </p>
            <div className="w-20" />
          </div>
          <div className="flex-1 overflow-hidden p-4 sm:p-8 flex flex-col items-center">
            <div className="w-full max-w-4xl h-full flex flex-col glass rounded-2xl p-5 sm:p-8 overflow-hidden">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Final Output</p>
                {typeof result?.output?.predicted_rating === "number" && (
                  <StarRating value={result.output.predicted_rating} />
                )}
              </div>
              <div className="flex-1 min-h-0 w-full overflow-hidden flex flex-col gap-4">
                <div className="flex-1 min-h-0 overflow-auto rounded-xl border border-border/50">
                  <JsonViewer data={result} />
                </div>
                <div className="shrink-0 pt-2">
                  <ResultActions data={result} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
