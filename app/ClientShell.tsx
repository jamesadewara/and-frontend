"use client";

import React from 'react';
import { GoogleTranslate } from '@/src/components/GoogleTranslate';
import { Toaster } from '@/src/components/ui/sonner';
import { AppProvider } from '@/src/providers/app';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function ClientShell({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <NuqsAdapter>
            <AppProvider>
                <GoogleTranslate />
                <NextTopLoader
                    showAtBottom={false}
                    showForHashAnchor={true}
                    showSpinner={false}
                    color="var(--primary)"
                    shadow="none"
                />
                {children}
                <Toaster />
            </AppProvider>
        </NuqsAdapter >
    );
}
