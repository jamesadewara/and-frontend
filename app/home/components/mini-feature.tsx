"use client";

import React from "react";

export function MiniFeature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-0 bg-card border border-border p-5 hover:bg-card hover:shadow-md hover:-translate-y-0.5 transition">
      <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center [&>svg]:h-4 [&>svg]:w-4">{icon}</div>
      <div className="mt-3 font-medium">{title}</div>
      <div className="text-sm text-muted-foreground mt-1 leading-relaxed">{body}</div>
    </div>
  );
}
