"use client";
import { useContext } from "react";
import { AppCtx } from "@/src/providers/app";
import { AppContextValue } from "@/src/lib/types/app";

export function useApp(): AppContextValue {
  const ctx = useContext(AppCtx);
  if (!ctx) {
    throw new Error("useApp must be used within AppProvider");
  }
  return ctx;
}
