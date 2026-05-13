import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="max-w-md w-full space-y-8">
                {/* Visual indicator */}
                <div className="relative mx-auto w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-primary/10 rounded-3xl animate-pulse" />
                    <div className="relative h-full w-full rounded-3xl border border-primary/20 flex items-center justify-center">
                        <Compass className="h-10 w-10 text-primary" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-7xl font-bold tracking-tighter text-foreground">404</h1>
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Page not found</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        The page you&apos;re looking for doesn&apos;t exist or has been moved to a different coordinate.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                    <Link
                        href="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all active:scale-95"
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