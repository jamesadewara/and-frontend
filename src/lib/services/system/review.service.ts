/**
 * @file review.service.ts
 * @description Service for interacting with the AI Review Generator.
 */

import { taskAAxios } from "@/src/lib/api/system/axios";
import { ReviewGenerateRequest, ReviewResponse } from "@/src/lib/types/system/review";
import { streamReview, SSECallbacks } from "@/src/lib/api/system/sse-client";

/**
 * Generates a review (One-shot, non-streaming).
 */
export async function generateReview(payload: ReviewGenerateRequest): Promise<ReviewResponse> {
    const { data } = await taskAAxios.post<ReviewResponse>("/reviews/generate", payload);
    return data;
}

/**
 * Generates a review with REST API + optional SSE log streaming.
 */
export async function generateReviewStream(
    payload: ReviewGenerateRequest,
    callbacks: SSECallbacks<Partial<ReviewResponse>>,
    signal?: AbortSignal,
    traceId?: string
) {
    return streamReview(payload, callbacks as SSECallbacks<unknown>, signal, traceId);
}
