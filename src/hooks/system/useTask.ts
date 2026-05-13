'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import * as reviewService from '@/src/lib/services/system/review.service'
import * as recommendationService from '@/src/lib/services/system/recommendation.service'
import * as tasksApi from '@/src/lib/api/system/tasks'
import { ReasoningStep } from '@/src/lib/types/system/review'
import { config } from '@/src/lib/config'

/**
 * Hook to manage Agent streaming tasks (Review or Recommendation)
 */
export function useAgentStream(mode: 'review' | 'recommend') {
    const [phase, setPhase] = useState<'intro' | 'loading' | 'streaming' | 'done'>('intro')
    const [streamedSteps, setStreamedSteps] = useState<string[]>([])
    const [result, setResult] = useState<any>(null)
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

    const submit = useCallback(async (payload: any) => {
        setIsSubmitting(true)
        setPhase('loading')
        setStreamedSteps([])
        setResult(null)
        setError(null)

        const controller = new AbortController()
        abortControllerRef.current = controller

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
            onDone: (data: any) => {
                setResult(data)
                setPhase('done')
                setIsSubmitting(false)
                abortControllerRef.current = null
            },
            onError: (err: any) => {
                const msg = err.message || 'Stream connection failed'
                setError(msg)
                toast.error(msg)
                setIsSubmitting(false)
                setPhase('intro')
                abortControllerRef.current = null
            }
        }

        try {
            if (mode === 'review') {
                await reviewService.generateReviewStream(payload, callbacks, controller.signal)
            } else {
                await recommendationService.generateRecommendationStream(payload, callbacks, controller.signal)
            }
        } catch (err: any) {
            if (err.name === 'AbortError') return
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
        const urlA = `${config.externalApis.taskA.apiUrl}health/stream`;
        const urlB = `${config.externalApis.taskB.apiUrl}health/stream`;

        const esA = new EventSource(urlA);
        const esB = new EventSource(urlB);

        esA.onmessage = () => setIsLive(prev => ({ ...prev, taskA: true }));
        esA.onerror = () => setIsLive(prev => ({ ...prev, taskA: false }));

        esB.onmessage = () => setIsLive(prev => ({ ...prev, taskB: true }));
        esB.onerror = () => setIsLive(prev => ({ ...prev, taskB: false }));

        return () => {
            esA.close();
            esB.close();
        };
    }, []);

    return isLive;
}
