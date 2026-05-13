import axios from 'axios';

/**
 * Type-safe way to extract an error message from an API error.
 */
export function getErrorMessage(error: unknown, fallback: string = "Something went wrong"): string {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.detail || error.response?.data?.message || error.message || fallback;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return fallback;
}
