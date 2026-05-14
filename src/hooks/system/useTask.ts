'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import * as reviewService from '@/src/lib/services/system/review.service'
import * as recommendationService from '@/src/lib/services/system/recommendation.service'
import { ReasoningStep, ReviewGenerateRequest } from '@/src/lib/types/system/review'
import { RecommendRequest } from '@/src/lib/types/system/recommendation'
import { config } from '@/src/lib/config'
import { type AgentResponse } from '@/src/data/workspace-data'

/**
 * Hook to manage Agent streaming tasks (Review or Recommendation)
 */
export function useAgentStream(mode: 'review' | 'recommend') {
    const [phase, setPhase] = useState<'intro' | 'loading' | 'streaming' | 'done'>('intro')
    const [streamedSteps, setStreamedSteps] = useState<string[]>([])
    const [result, setResult] = useState<AgentResponse | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const abortControllerRef = useRef<AbortController | null>(null)

    const cancel = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
            abortControllerRef.current = null
        }
        setIsSubmitting(false)
        setPhase('intro')
    }, [])

    const submit = useCallback(async (payload: unknown) => {
        setIsSubmitting(true)
        setPhase('loading')
        setStreamedSteps([])
        setResult(null)
        setError(null)

        const controller = new AbortController()
        abortControllerRef.current = controller
        
        // Generate unique trace ID for this request (for log streaming)
        const traceId = `${mode}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        const callbacks = {
            onStep: (step: ReasoningStep) => {
                setPhase('streaming')
                setStreamedSteps(prev => {
                    if (prev.length > 0 && prev[prev.length - 1] === step.output) {
                        return prev;
                    }
                    return [...prev, step.output];
                })
            },
            onDone: (data: AgentResponse) => {
                setResult(data)
                setPhase('done')
                setIsSubmitting(false)
                abortControllerRef.current = null
            },
            onError: (err: unknown) => {
                let msg = 'Stream connection failed';
                if (typeof err === 'object' && err !== null && 'message' in err) {
                    msg = String((err as any).message);
                } else if (err instanceof Error) {
                    msg = err.message;
                } else if (typeof err === 'string') {
                    msg = err;
                }
                setError(msg)
                toast.error(msg)
                setIsSubmitting(false)
                setPhase('intro')
                abortControllerRef.current = null
            }
        }

        try {
            if (mode === 'review') {
                await reviewService.generateReviewStream(
                    payload as ReviewGenerateRequest,
                    callbacks,
                    controller.signal,
                    traceId
                )
            } else {
                await recommendationService.generateRecommendationStream(
                    payload as RecommendRequest,
                    callbacks,
                    controller.signal,
                    traceId
                )
            }
        } catch (err: unknown) {
            if (err instanceof Error && err.name === 'AbortError') return
            callbacks.onError(err)
        }
    }, [mode])

    return { submit, cancel, phase, streamedSteps, result, isSubmitting, error, setPhase, setStreamedSteps, setResult, setIsSubmitting }
}

/**
 * Hook to check health of backend services
 */
export function useHealthCheck() {
    const [isLive, setIsLive] = useState({ taskA: false, taskB: false })

    useEffect(() => {
        const streamA = new EventSource(`${config.externalApis.taskA.apiUrl}health/stream`);
        const streamB = new EventSource(`${config.externalApis.taskB.apiUrl}health/stream`);

        streamA.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.status === 'ok') setIsLive(prev => ({ ...prev, taskA: true }));
            } catch (e) {
                console.error("Health stream parse error (Task A)", e);
            }
        };

        streamB.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.status === 'ok') setIsLive(prev => ({ ...prev, taskB: true }));
            } catch (e) {
                console.error("Health stream parse error (Task B)", e);
            }
        };

        streamA.onerror = () => {
            setIsLive(prev => ({ ...prev, taskA: false }));
        };

        streamB.onerror = () => {
            setIsLive(prev => ({ ...prev, taskB: false }));
        };

        return () => {
            streamA.close();
            streamB.close();
        }
    }, [])

    return isLive
}
