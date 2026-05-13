"use client";

import { Star } from "lucide-react";

export function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-5 ${i < Math.round(value) ? "fill-primary text-primary" : "text-muted-foreground/40"}`}
        />
      ))}
      <span className="ml-2 text-sm text-muted-foreground">{value.toFixed(1)} / 5</span>
    </div>
  );
}
