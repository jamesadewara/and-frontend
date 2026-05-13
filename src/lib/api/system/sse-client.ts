import { fetchEventSource } from '@microsoft/fetch-event-source';
import { config } from '@/src/lib/config';

export interface SSECallbacks<T> {
    onStep: (step: { step: string; action: string; output: string }) => void;
    onDone: (result: T) => void;
    onError: (error: any) => void;
}

/**
 * Streaming Review Generator Client
 */
export async function streamReview(
    payload: any,
    callbacks: SSECallbacks<any>,
    signal?: AbortSignal
) {
    const url = `${config.externalApis.taskA.apiUrl}reviews/generate/stream`;

    await fetchEventSource(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
        },
        body: JSON.stringify(payload),
        signal,
        onopen: async (response) => {
            if (!response.ok) {
                const err = await response.json().catch(() => ({ detail: response.statusText }));
                throw new Error(err.detail || 'Failed to open stream');
            }
        },
        onmessage: (msg) => {
            if (msg.event === 'reasoning') {
                callbacks.onStep(JSON.parse(msg.data));
            } else if (msg.event === 'final_result') {
                callbacks.onDone(JSON.parse(msg.data));
            } else if (msg.event === 'error') {
                callbacks.onError(JSON.parse(msg.data));
            }
        },
        onerror: (err) => {
            callbacks.onError(err);
            throw err; // Stop retrying
        },
    });
}

/**
 * Streaming Recommendation Client
 */
export async function streamRecommendation(
    payload: any,
    callbacks: SSECallbacks<any>,
    signal?: AbortSignal
) {
    const url = `${config.externalApis.taskB.apiUrl}recommendations/stream`;

    await fetchEventSource(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
        },
        body: JSON.stringify(payload),
        signal,
        onopen: async (response) => {
            if (!response.ok) {
                const err = await response.json().catch(() => ({ detail: response.statusText }));
                throw new Error(err.detail || 'Failed to open stream');
            }
        },
        onmessage: (msg) => {
            if (msg.event === 'reasoning') {
                callbacks.onStep(JSON.parse(msg.data));
            } else if (msg.event === 'final_result') {
                callbacks.onDone(JSON.parse(msg.data));
            } else if (msg.event === 'error') {
                callbacks.onError(JSON.parse(msg.data));
            }
        },
        onerror: (err) => {
            callbacks.onError(err);
            throw err;
        },
    });
}
