/**
 * @file recommendation.service.ts
 * @description Service for interacting with the AI Recommendation Engine.
 */

import { taskBAxios } from "@/src/lib/api/system/axios";
import { RecommendRequest, RecommendationResponse } from "@/src/lib/types/system/recommendation";
import { streamRecommendation, SSECallbacks } from "@/src/lib/api/system/sse-client";

/**
 * Generates recommendations (One-shot, non-streaming).
 */
export async function generateRecommendation(payload: RecommendRequest): Promise<RecommendationResponse> {
    const { data } = await taskBAxios.post<RecommendationResponse>("/recommendations/", payload);
    return data;
}

/**
 * Generates recommendations with streaming reasoning (SSE).
 */
export async function generateRecommendationStream(
    payload: RecommendRequest,
    callbacks: SSECallbacks<Partial<RecommendationResponse>>,
    signal?: AbortSignal
) {
    return streamRecommendation(payload, callbacks, signal);
}
