import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Robustly formats an error from the backend (FastAPI/Pydantic) 
 * into a human-readable string. Prevents React rendering crashes.
 */
export function formatError(err: unknown): string {
    if (!err) return "An unknown error occurred";
    
    // 1. Safe access to common error structures
    const errObj = err as Record<string, unknown>;
    const response = errObj.response as Record<string, unknown> | undefined;
    const data = response?.data as Record<string, unknown> | undefined;
    const detail = data?.detail || errObj.detail;
    
    // 2. Handle FastAPI/Pydantic validation lists: [{type, loc, msg, ...}, ...]
    if (Array.isArray(detail)) {
        return detail.map((d: unknown) => {
            const item = d as Record<string, unknown>;
            return String(item.msg || JSON.stringify(d));
        }).join(", ");
    }
    
    // 3. Handle simple string details
    if (typeof detail === "string") return detail;
    
    // 4. Handle object details: { message: "..." }
    if (typeof detail === "object" && detail !== null) {
        const detObj = detail as Record<string, unknown>;
        return String(detObj.message || detObj.msg || JSON.stringify(detail));
    }
    
    // 5. Fallback to generic error message
    const errorInstance = err as Error;
    return errorInstance.message || JSON.stringify(err) || "An unexpected error occurred";
}
