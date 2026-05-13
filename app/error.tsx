'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="max-w-md w-full space-y-8">
                {/* Visual indicator */}
                <div className="relative mx-auto w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-destructive/10 rounded-3xl animate-pulse" />
                    <div className="relative h-full w-full rounded-3xl border border-destructive/20 flex items-center justify-center">
                        <AlertTriangle className="h-10 w-10 text-destructive" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Something went wrong</h1>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        AnD AI encountered an unexpected error while processing this page. Our team has been notified.
                    </p>

                    <div className="p-4 rounded-2xl bg-card border border-border text-left overflow-hidden">
                        <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                            Error Details
                        </div>
                        <p className="text-sm font-mono text-muted-foreground break-words line-clamp-3">
                            {error.message || "An unknown error occurred"}
                        </p>
                        {error.digest && (
                            <div className="mt-3 text-[10px] text-muted-foreground/60 font-mono">
                                Digest: {error.digest}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                    <button
                        onClick={() => reset()}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all active:scale-95"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Try again
                    </button>
                    <Link
                        href="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-background hover:bg-muted font-semibold transition-all active:scale-95"
                    >
                        <Home className="h-4 w-4" />
                        Return home
                    </Link>
                </div>

                <div className="pt-8 flex justify-center gap-6 grayscale opacity-40">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">AnD AI</p>
                </div>
            </div>
        </div>
    )
}
