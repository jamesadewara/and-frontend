"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Copy, Download } from "lucide-react";
import { TopNav } from "@/src/components/site-nav";
import { type AgentResponse } from "@/src/data/workspace-data";
import { toast } from "sonner";

interface ResultData {
  mode: "review" | "recommend";
  result: AgentResponse;
  reasoning: string[];
  timestamp: number;
}

export default function AgentOutputClient() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<ResultData | null>(null);

  useEffect(() => {
    if (!id) return;

    // Retrieve result from sessionStorage using the ID
    const stored = sessionStorage.getItem(`and_result_${id}`);
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse result:", e);
        toast.error("Failed to load result");
      }
    } else {
      toast.error("Result not found");
    }
  }, [id]);

  const handleCopy = () => {
    if (!data?.result) return;
    navigator.clipboard.writeText(JSON.stringify(data.result, null, 2));
    toast.success("Copied to clipboard");
  };

  const handleDownload = () => {
    if (!data?.result) return;
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(data.result, null, 2)));
    element.setAttribute("download", `${data.mode}-output-${data.timestamp}.json`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Downloaded");
  };

  if (!data) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <TopNav />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Result Not Found</h1>
            <p className="text-muted-foreground">The result data could not be loaded.</p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
            >
              <ArrowLeft className="size-4" />
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  const result = data.result;
  const isReview = data.mode === "review";
  const title = isReview ? "Review Output" : "Recommendation Output";

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden w-full">
      <TopNav />
      <main className="flex-1 w-full mx-auto p-4 md:p-6 overflow-x-hidden overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
              >
                <ArrowLeft className="size-4" />
                Back to Workspace
              </button>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">{title}</h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Generated {new Date(data.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-secondary transition-all text-xs md:text-sm font-medium"
              >
                <Copy className="size-3.5" />
                <span>Copy</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-secondary transition-all text-xs md:text-sm font-medium"
              >
                <Download className="size-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Main Output */}
            {isReview ? (
              <div className="w-full space-y-4">
                <div className="rounded-lg border border-border bg-card p-4 md:p-6 space-y-4 min-w-0">
                  <h2 className="text-lg font-semibold mb-2">Review Text</h2>
                  <div className="w-full max-w-full overflow-auto max-h-96 scrollbar-thin border rounded-md bg-muted/20 min-w-0">
                    <p className="text-sm md:text-base p-4 leading-relaxed whitespace-pre w-max min-w-full">
                      {result.review_text}
                    </p>
                  </div>

                  {result.predicted_rating !== undefined && (
                    <div className="pt-4 border-t border-border">
                      <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Predicted Rating</h3>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl md:text-3xl font-bold text-primary">
                          {result.predicted_rating.toFixed(1)}
                        </div>
                        <div className="text-xs md:text-sm text-muted-foreground">out of 5</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reasoning Chain */}
                {data.reasoning.length > 0 && (
                  <div className="rounded-lg border border-border bg-card p-6">
                    <h2 className="text-lg font-semibold mb-4">Reasoning Process</h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin">
                      {data.reasoning.map((step, idx) => (
                        <div key={idx} className="flex gap-3 p-2 rounded-md hover:bg-muted/30 transition-colors">
                          <div className="text-xs font-bold text-primary/60 bg-primary/10 rounded px-2 py-1 h-fit shrink-0">
                            Step {idx + 1}
                          </div>
                          <p className="text-sm text-foreground/80 flex-1 pt-1 break-words">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-card p-4 md:p-6">
                  <h2 className="text-lg font-semibold mb-4">Recommendations</h2>
                  {result.recommendations && result.recommendations.length > 0 ? (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
                      {result.recommendations.map((rec, idx) => (
                        <div key={idx} className="p-3 md:p-4 rounded-lg bg-secondary/50 border border-border/50 hover:border-primary/30 transition-all">
                          <div className="font-medium mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span className="text-sm md:text-base">{rec.title || rec.item || `Recommendation ${idx + 1}`}</span>
                            {rec.score !== undefined && (
                              <span className="text-[10px] w-fit font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
                                Score: {rec.score.toFixed(2)}
                              </span>
                            )}
                          </div>
                          {rec.reason && (
                            <p className="text-xs md:text-sm text-muted-foreground mb-3 italic">"{rec.reason}"</p>
                          )}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 text-[11px] md:text-xs text-muted-foreground bg-background/50 p-3 rounded-md">
                            {rec.category && (
                              <div className="flex justify-between sm:justify-start sm:gap-2">
                                <span className="font-semibold">Category:</span>
                                <span>{rec.category}</span>
                              </div>
                            )}
                            {rec.price !== undefined && (
                              <div className="flex justify-between sm:justify-start sm:gap-2">
                                <span className="font-semibold">Price:</span>
                                <span className="text-foreground font-medium">₦{rec.price.toLocaleString()}</span>
                              </div>
                            )}
                            {rec.estimated_price && (
                              <div className="flex justify-between sm:justify-start sm:gap-2">
                                <span className="font-semibold">Est. Price:</span>
                                <span>{rec.estimated_price}</span>
                              </div>
                            )}
                            {rec.location && (
                              <div className="flex justify-between sm:justify-start sm:gap-2">
                                <span className="font-semibold">Location:</span>
                                <span>{rec.location}</span>
                              </div>
                            )}
                            {rec.rank !== undefined && (
                              <div className="flex justify-between sm:justify-start sm:gap-2">
                                <span className="font-semibold">Rank:</span>
                                <span className="bg-secondary px-1.5 rounded">#{rec.rank}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No recommendations available</p>
                  )}
                </div>

                {/* Reasoning Chain */}
                {data.reasoning.length > 0 && (
                  <div className="rounded-lg border border-border bg-card p-4 md:p-6">
                    <h2 className="text-lg font-semibold mb-4">Reasoning Process</h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin">
                      {data.reasoning.map((step, idx) => (
                        <div key={idx} className="flex gap-3 p-2 rounded-md hover:bg-muted/30 transition-colors">
                          <div className="text-[10px] md:text-xs font-bold text-primary/60 bg-primary/10 rounded px-2 py-1 h-fit shrink-0">
                            Step {idx + 1}
                          </div>
                          <p className="text-[13px] md:text-sm text-foreground/80 flex-1 pt-1 break-words">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Raw JSON */}
            <div className="rounded-lg border border-border bg-card p-4 md:p-6 min-w-0 h-auto">
              <h2 className="text-lg font-semibold mb-4">Raw Response</h2>
              <pre className="bg-secondary/50 rounded p-4 text-xs leading-relaxed max-h-180 h-auto overflow-auto scrollbar-thin font-mono w-full min-w-0">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
