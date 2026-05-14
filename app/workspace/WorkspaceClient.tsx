"use client";

import { useCallback, useEffect, useMemo, useRef, useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import {
  FileJson, Loader2, Send, X, Terminal, Trash2
} from "lucide-react";
import { TopNav } from "@/src/components/site-nav";
import {
  REVIEW_TEMPLATES,
  validatePayload, type Mode, type Message, type AgentResponse,
  RECOMMEND_TEMPLATES
} from "@/src/data/workspace-data";

import { ModeSwitch } from "./components/mode-switch";
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
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("review");
  const [value, setValue] = useState<string>(JSON.stringify(REVIEW_TEMPLATES["Blank Template"], null, 2));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);

  // Load initial state on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load messages
    const savedMessages = localStorage.getItem("and_messages");
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error("Failed to load corrupted messages", e);
        localStorage.removeItem("and_messages");
        toast.error("Message history was corrupted and has been reset.");
      }
    }

    // Load payload for current mode
    const savedPayload = localStorage.getItem(`and_payload_${mode}`);
    if (savedPayload) {
      setValue(savedPayload);
    }
  }, []); // Only on mount

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

  // Persist payload to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Debounce or at least ensure we don't write during initial load if possible
    localStorage.setItem(`and_payload_${mode}`, value);
  }, [value, mode]);

  // When mode changes, load the saved payload for that mode
  useEffect(() => {
    const saved = localStorage.getItem(`and_payload_${mode}`);
    if (saved) {
      setValue(saved);
    } else {
      const def = mode === "review"
        ? REVIEW_TEMPLATES["Blank Template"]
        : RECOMMEND_TEMPLATES["Blank Template"];
      setValue(JSON.stringify(def, null, 2));
    }

    startTransition(() => {
      setPhase("intro");
      setStreamedSteps([]);
      setResult(null);
      setIsSubmitting(false);
    });

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

  const generateId = useCallback(() => Math.random().toString(36).substring(7), []);

  const createTimestamp = useCallback(() => Date.now(), []);

  const persistMessages = useCallback((newMessages: Message[] | ((prev: Message[]) => Message[])) => {
    setMessages((prev) => {
      const next = typeof newMessages === "function" ? newMessages(prev) : newMessages;
      if (typeof window !== "undefined") {
        try {
          // Truncate metadata if it's too large to prevent localStorage overflow/truncation
          const sanitized = next.map(m => ({
            ...m,
            metadata: m.metadata ? {
              ...m.metadata,
              reasoning_chain: (m.metadata.reasoning_chain as string[] | undefined)?.slice(-50) // Only keep last 50 steps per message
            } : undefined
          })).slice(-30); // Keep only last 30 messages in history

          localStorage.setItem("and_messages", JSON.stringify(sanitized));
        } catch (e) {
          console.error("Failed to persist messages", e);
          // If quota exceeded, try saving without reasoning chain at all
          try {
            const stripped = next.map(m => ({ ...m, metadata: { ...m.metadata, reasoning_chain: [] } })).slice(-10);
            localStorage.setItem("and_messages", JSON.stringify(stripped));
          } catch (e2) {
            localStorage.removeItem("and_messages");
          }
        }
      }
      return next;
    });
  }, []);

  const submit = async () => {
    if (!value.trim() || value.trim().length < 20) {
      toast.warning("Payload is too short. Please provide at least 20 characters.");
      return;
    }

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
      id: generateId(),
      from: "user",
      mode: mode,
      blocks: [{
        kind: "text",
        text: `🚀 [TASK: ${mode.toUpperCase()}] Request Submitted\n` +
          `Target: ${(() => {
            try {
              const parsed = JSON.parse(value);
              return parsed.user_persona?.name || parsed.persona?.name || "Unknown User";
            } catch (e) {
              return "Custom Payload";
            }
          })()}\n` +
          `Payload Length: ${value.length} characters`
      }],
      timestamp: createTimestamp(),
      metadata: { payload: value }
    };
    persistMessages((prev) => [...prev, userMsg]);

    setMobileOpen(false);

    try {
      // Handle both JSON and plain text modes
      let payload: unknown;
      if (validation.isTextMode) {
        // Plain text mode — send as string wrapped in request format
        if (mode === "review") {
          payload = {
            user_persona: {
              name: "Nigerian User",
              archetype: "default_consumer",
              budget: 10000.0,
              interests: [],
              traits: [],
              tone: "conversational",
              style_sample: "",
              nigerian_context: true,
              price_sensitivity: "medium",
              past_reviews: []
            },
            product: {
              name: "Product",
              category: "General",
              description: value,
              image_url: null,
              price: 0.0
            }
          };
          addLog(`[TASK A] Text mode review request: "${value.slice(0, 50)}..."`, 'info');
        } else {
          // Task B: Recommendation
          payload = {
            user_persona: {
              name: "Nigerian User",
              location: "Nigeria",
              archetype: "default_consumer",
              interests: [],
              traits: [],
              tone: "conversational",
              style_sample: null,
              nigerian_context: true,
              budget: 10000.0,
              price_sensitivity: "medium",
              past_reviews: []
            },
            context: {
              location: "Nigeria",
              time_of_day: "day",
              occasion: value,
              conversation_history: []
            }
          };
          addLog(`[TASK B] Text mode recommendation request: "${value.slice(0, 50)}..."`, 'info');
        }
      } else {
        // JSON mode — use parsed data
        payload = JSON.parse(value);
        addLog(`JSON mode request submitted`, 'info');
      }
      addLog(`Payload structure validated. Starting ${mode} stream...`, 'success');
      await runStream(payload);
    } catch (e) {
      console.error("Submission failed", e);
      toast.error("Submission failed. Check console for details.");
      setConsoleOpen(true);
    }
  };

  // Watch for result to navigate to result page
  useEffect(() => {
    if (result && phase === "done") {
      const typedResult = result as AgentResponse;
      const isReview = mode === "review";
      const resultId = `${mode}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const agentMsg: Message = {
        id: generateId(),
        from: "agent",
        mode: mode,
        blocks: [
          {
            kind: "text",
            text: `✅ [${mode.toUpperCase()} COMPLETE] ${new Date().toLocaleTimeString()}\n` +
              (isReview
                ? `Generated a culturally grounded review with ${typedResult.predicted_rating} stars.`
                : `Identified ${typedResult.recommendations?.length || 0} personalized recommendations.`)
          },
          ...(typedResult.recommendations ? typedResult.recommendations.map((r) => ({ kind: "rec" as const, data: r })) : [])
        ],
        timestamp: Date.now(),
        hasAnalysis: true,
        hasSimulator: mode === "review",
        metadata: {
          resultId: resultId,
          recommendations: typedResult.recommendations,
          reasoning_chain: streamed,
          review: typedResult,
          full_response: typedResult
        }
      };

      startTransition(() => {
        // Store result in sessionStorage
        const resultData = {
          mode,
          result: typedResult,
          reasoning: streamed,
          timestamp: Date.now()
        };
        sessionStorage.setItem(`and_result_${resultId}`, JSON.stringify(resultData));

        // Add message to history and persist immediately before navigation
        persistMessages((prev) => [...prev, agentMsg]);

        // Navigate to result page
        setTimeout(() => {
          router.push(`/workspace/${resultId}`);
        }, 100);
      });
    }
  }, [result, phase, mode, streamed, generateId, router, persistMessages]);

  const handleViewOutput = (metadata: any) => {
    if (metadata?.resultId) {
      router.push(`/workspace/${metadata.resultId}`);
    } else if (metadata?.review || metadata?.recommendations) {
      setResult((metadata.review || metadata.recommendations) as AgentResponse);
    }
  };

  const handleRetry = (text: string) => {
    toast.info("Retrying with: " + text);
    submit();
  };

  const handleLoadToEditor = (data: unknown) => {
    const json = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    setValue(json);
    toast.success("Loaded to editor");
  };

  const [consoleLogs, setConsoleLogs] = useState<{ id: string; type: 'info' | 'warn' | 'error' | 'success' | 'system'; msg: string; time: string; task: 'A' | 'B' | 'both' }[]>([]);

  const addLog = useCallback((msg: string, type: 'info' | 'warn' | 'error' | 'success' | 'system' = 'info', targetTask?: 'A' | 'B' | 'both') => {
    const task = targetTask || (mode === 'review' ? 'A' : 'B');
    setConsoleLogs(prev => [
      ...prev,
      { id: generateId(), type, msg, time: new Date().toLocaleTimeString([], { hour12: false }), task }
    ].slice(-100)); // Keep last 100 logs
  }, [mode, generateId, setConsoleLogs]);

  // Initial logs
  useEffect(() => {
    if (consoleLogs.length === 0) {
      addLog('Initializing AnD Agent Node v1.0.4...', 'system', 'both');
      addLog(`Active node configuration: ${mode.toUpperCase()}`, 'system', mode === 'review' ? 'A' : 'B');
    }
  }, []);

  const clearConsole = () => {
    setConsoleLogs([]);
    toast.success("Console cleared");
  };

  useEffect(() => {
    addLog(`Switched to ${mode.toUpperCase()} mode`, 'system');
  }, [mode, addLog]);

  useEffect(() => {
    if (streamError) {
      addLog(`[ERROR] ${streamError}`, 'error');
    }
  }, [streamError, addLog]);

  useEffect(() => {
    if (phase === 'loading') {
      addLog(`Connecting to agent stream...`, 'info');
    } else if (phase === 'streaming') {
      addLog(`Streaming reasoning steps...`, 'success');
    } else if (phase === 'done') {
      addLog(`Stream complete. Result received.`, 'success');
    }
  }, [phase, mode, addLog]);

  useEffect(() => {
    if (validation.parseError) {
      addLog(`[VALIDATION] JSON Error: ${validation.parseError}`, 'error');
    }
    if (validation.missing.length > 0) {
      validation.missing.forEach(m => addLog(`[VALIDATION] Missing field: ${m}`, 'warn'));
    }
  }, [validation.parseError, validation.missing, addLog]);

  const [consoleHeight, setConsoleHeight] = useState(350);
  const isResizing = useRef(false);

  const startResizing = () => {
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

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background selection:bg-primary/20 relative">
      <TopNav>
        <div className="">
          <ModeSwitch
            mode={mode}
            setMode={(newMode) => {
              if (submitting) {
                toast.error("Please wait for the current agent to finish or stop it first.");
                return;
              }
              setMode(newMode);
            }}
            disabled={submitting}
          />
        </div>
      </TopNav>

      {/* DESKTOP */}
      <main className="hidden md:flex flex-1 mx-auto max-w-360 w-full p-6 gap-0 overflow-hidden">
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
              onCancel={cancelStream}
              consoleOpen={consoleOpen}
              setConsoleOpen={setConsoleOpen}
              messages={messages}
              onLoadToEditor={handleLoadToEditor}
              handleRetry={handleRetry}
              hasWarnings={validation.missing.length > 0}
              typing={submitting && phase !== "done"}
              isLive={isLive}
              onClearMessages={clearMessages}
              onOpenSimulator={handleViewOutput}
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
      <main className="md:hidden flex-1 flex flex-col overflow-hidden relative bg-secondary/5 overflow-x-hidden">
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
              onCancel={cancelStream}
              consoleOpen={consoleOpen}
              setConsoleOpen={setConsoleOpen}
              messages={messages}
              onLoadToEditor={handleLoadToEditor}
              handleRetry={handleRetry}
              hasWarnings={validation.missing.length > 0}
              typing={submitting && phase !== "done"}
              isLive={isLive}
              onClearMessages={clearMessages}
              onOpenSimulator={handleViewOutput}
              hideFooterOnMobile
            />
          </div>

          {/* Floating Mobile Controls */}
          <div className="absolute bottom-3 left-3 right-3 flex flex-row items-center justify-center gap-1.5 pointer-events-none">
            <div className="pointer-events-auto flex-1 max-w-37.5">
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
                        disabled={status === "invalid" || submitting}
                        onClick={submit}
                        className={`w-full rounded-xl py-4 font-bold text-sm transition-all flex items-center justify-center gap-3 shadow-xl ${status !== 'invalid' && !submitting ? 'bg-primary text-primary-foreground shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]' : 'bg-secondary text-muted-foreground opacity-50'}`}
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
              className="pointer-events-auto flex-1 max-w-37.5 glass rounded-xl py-3 font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 border-border/40 hover:bg-secondary/50 transition-all text-muted-foreground shadow-sm"
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

            {/* SPLIT LOG VIEW */}
            <div className="grid grid-cols-2 gap-6 h-[calc(100%-100px)]">
              {/* Task A Logs */}
              <div className="flex flex-col gap-1.5 overflow-y-auto scrollbar-none border-r border-white/5 pr-4">
                <div className="text-[9px] font-bold text-primary/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <div className="size-1 rounded-full bg-primary/40" />
                  Review Stream (A)
                </div>
                {consoleLogs.filter(l => l.task === 'A' || l.task === 'both').map(log => (
                  <div key={log.id} className="flex gap-2 py-0.5 animate-in fade-in slide-in-from-left-1 duration-200">
                    <span className="shrink-0 text-muted-foreground/30 text-[9px] w-12">[{log.time}]</span>
                    <span className={cn(
                      "font-medium",
                      log.type === 'error' && "text-red-400",
                      log.type === 'warn' && "text-yellow-400",
                      log.type === 'success' && "text-emerald-400",
                      log.type === 'system' && "text-primary/70",
                      log.type === 'info' && "text-[#e6edf3]/80"
                    )}>
                      {log.msg}
                    </span>
                  </div>
                ))}
                {submitting && mode === "review" && (
                  <div className="text-primary/60 text-[10px] animate-pulse mt-2 font-bold"># PROCESSING...</div>
                )}
              </div>

              {/* Task B Logs */}
              <div className="flex flex-col gap-1.5 overflow-y-auto scrollbar-none">
                <div className="text-[9px] font-bold text-primary/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <div className="size-1 rounded-full bg-primary/40" />
                  Recommend Stream (B)
                </div>
                {consoleLogs.filter(l => l.task === 'B' || l.task === 'both').map(log => (
                  <div key={log.id} className="flex gap-2 py-0.5 animate-in fade-in slide-in-from-left-1 duration-200">
                    <span className="shrink-0 text-muted-foreground/30 text-[9px] w-12">[{log.time}]</span>
                    <span className={cn(
                      "font-medium",
                      log.type === 'error' && "text-red-400",
                      log.type === 'warn' && "text-yellow-400",
                      log.type === 'success' && "text-emerald-400",
                      log.type === 'system' && "text-primary/70",
                      log.type === 'info' && "text-[#e6edf3]/80"
                    )}>
                      {log.msg}
                    </span>
                  </div>
                ))}
                {submitting && mode === "recommend" && (
                  <div className="text-primary/60 text-[10px] animate-pulse mt-2 font-bold"># PROCESSING...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
