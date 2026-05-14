import { config } from '@/src/lib/config';

export interface SSECallbacks<T> {
    onStep: (step: { step: string; action: string; output: string }) => void;
    onDone: (result: T) => void;
    onError: (error: unknown) => void;
}

const REQUEST_TIMEOUT_MS = 30000; // 30 second timeout

/**
 * Review Generator - REST API for main payload + optional SSE for reasoning logs
 */
/**
 * Unified Stream Client - Handles both Reviews and Recommendations
 */
async function runUnifiedStream<T>(
    url: string,
    payload: unknown,
    callbacks: SSECallbacks<T>,
    signal?: AbortSignal,
    _traceId?: string
) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'text/event-stream',
            },
            body: JSON.stringify(payload),
            signal
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({ detail: response.statusText }));
            throw new Error(err.detail || `HTTP ${response.status}: ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error("Response body is null");

        let buffer = "";
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || !trimmed.startsWith("data: ")) continue;

                try {
                    const jsonStr = trimmed.replace("data: ", "");
                    const data = JSON.parse(jsonStr);

                    if (data.event === "reasoning") {
                        callbacks.onStep(data.data);
                    } else if (data.event === "final_result") {
                        callbacks.onDone(data.data as T);
                    } else if (data.event === "error") {
                        throw new Error(data.data);
                    }
                } catch (e) {
                    console.warn("Failed to parse SSE line:", trimmed, e);
                }
            }
        }
    } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        callbacks.onError(err);
        throw err;
    }
}

/**
 * Review Generator - Streaming SSE via POST
 */
export async function streamReview(
    payload: unknown,
    callbacks: SSECallbacks<unknown>,
    signal?: AbortSignal,
    traceId?: string
) {
    const url = `${config.externalApis.taskA.apiUrl}reviews/stream`;
    return runUnifiedStream(url, payload, callbacks, signal, traceId);
}

/**
 * Recommendation Engine - Streaming SSE via POST
 */
export async function streamRecommendation(
    payload: unknown,
    callbacks: SSECallbacks<unknown>,
    signal?: AbortSignal,
    traceId?: string
) {
    const url = `${config.externalApis.taskB.apiUrl}recommendations/stream`;
    return runUnifiedStream(url, payload, callbacks, signal, traceId);
}

/**
 * Stream reasoning logs via SSE (separate from main request)
 * Attempts to connect but won't fail the main request if unavailable
 * Currently disabled until backend implements /api/v1/system/logs/{traceId}
 */
function streamLogsSSE(
    logsUrl: string,
    callbacks: SSECallbacks<unknown>,
    signal?: AbortSignal
) {
    try {
        const eventSource = new EventSource(logsUrl);

        eventSource.addEventListener('reasoning', (event) => {
            try {
                const data = JSON.parse(event.data);
                callbacks.onStep(data);
            } catch (e) {
                console.warn('Failed to parse reasoning log:', e);
            }
        });

        eventSource.addEventListener('error', (event) => {
            // Silently close on error (endpoint may not exist yet)
            eventSource.close();
        });

        // Clean up on abort
        signal?.addEventListener('abort', () => {
            eventSource.close();
        });

        return eventSource;
    } catch (err) {
        // Silently fail - SSE is optional, don't log
    }
}
